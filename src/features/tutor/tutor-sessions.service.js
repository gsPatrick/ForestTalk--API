const AppError = require('../../utils/app-error');
const { TutorSession } = require('../../models');
const { findLesson, lessonsOf } = require('./tutor-catalog');
const { completedLessonIds, withStatus } = require('./tutor-lessons.service');
const { FREE_TITLE } = require('./tutor.constants');
const engine = require('./tutor-engine');

const METRICS = ['grammar', 'suggestions', 'pronunciation'];
const metricsOf = (s) => ({ grammar: s.grammar, suggestions: s.suggestions, pronunciation: s.pronunciation });

/** Dá ids às mensagens do tutor (`m1`, `m2`, ...) com um contador guardado no estado da sessão. */
function numbered(messages, seq) {
  return { seq: seq + messages.length, list: messages.map((m, i) => ({ id: `m${seq + i + 1}`, role: 'tutor', ...m })) };
}

async function resolveKind(deviceId, input) {
  const { languageCode, lessonId, topic, scenario } = input;
  if (lessonId) {
    const lesson = findLesson(languageCode, lessonId);
    if (!lesson) throw AppError.notFound('Aula não encontrada', 'LESSON_NOT_FOUND');
    const status = withStatus(languageCode, await completedLessonIds(deviceId, languageCode)).find((l) => l.id === lessonId).status;
    if (status === 'locked') throw AppError.forbidden('Conclua a aula anterior primeiro', 'LESSON_LOCKED');
    return { kind: 'lesson', lessonId, title: lesson.title };
  }
  if (topic) return { kind: 'topic', topic, title: topic };
  if (scenario) return { kind: 'scenario', topic: scenario, title: scenario };
  return { kind: 'free', title: FREE_TITLE };
}

async function createSession(deviceId, input) {
  const base = await resolveKind(deviceId, input);
  const draft = { deviceId, languageCode: input.languageCode, displayName: input.displayName, ...base };
  const started = engine.start(draft);
  const { seq, list } = numbered(started.messages, 0);
  const session = await TutorSession.create({ ...draft, state: { ...started.state, seq } });
  return { id: session.id, lessonId: session.lessonId ?? null, title: session.title, messages: list, metrics: metricsOf(session), done: false };
}

async function findOwned(deviceId, id) {
  const session = await TutorSession.findOne({ where: { id, deviceId } });
  if (!session) throw AppError.notFound('Sessão não encontrada', 'SESSION_NOT_FOUND');
  return session;
}

async function takeTurn(deviceId, id, { text, source }) {
  const session = await findOwned(deviceId, id);
  if (session.endedAt) throw AppError.conflict('Sessão encerrada', 'SESSION_ENDED');
  if (session.done) throw AppError.conflict('Aula já concluída', 'SESSION_DONE');
  const out = await engine.turn(session, text, source);
  const { seq, list } = numbered(out.messages, session.state.seq ?? 0);
  const totals = Object.fromEntries(METRICS.map((k) => [k, session[k] + (out.delta[k] ?? 0)]));
  await session.update({ ...totals, state: { ...out.state, seq }, done: out.done });
  return { messages: list, metrics: metricsOf(session), done: out.done, step: out.step };
}

/** Encerra a sessão. Só conta como concluída se (no caso de aula com roteiro) o roteiro terminou. */
async function completeSession(deviceId, id, { durationSeconds, completed }) {
  const session = await findOwned(deviceId, id);
  const scripted = Boolean(session.lessonId);
  const finished = completed && (!scripted || session.done);
  const wasDone = session.completed;
  await session.update({ durationSeconds, completed: wasDone || finished, endedAt: session.endedAt ?? new Date() });
  if (!finished) return { report: null, unlockedLessonId: null };
  const report = { ...metricsOf(session), newWords: scripted ? findLesson(session.languageCode, session.lessonId).newWords : [] };
  return { report, unlockedLessonId: scripted ? nextLessonId(session) : null };
}

function nextLessonId(session) {
  const all = lessonsOf(session.languageCode);
  const idx = all.findIndex((l) => l.id === session.lessonId);
  return all[idx + 1]?.id ?? null;
}

module.exports = { createSession, takeTurn, completeSession };
