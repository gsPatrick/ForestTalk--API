// Motor do tutor: roteiro determinístico para aulas; IA (com fallback) para o resto.
const script = require('./tutor-script');
const ai = require('./tutor-ai.service');
const { findLesson } = require('./tutor-catalog');
const { HISTORY_CONTEXT } = require('./tutor.constants');

const lessonOf = (s) => (s.lessonId ? findLesson(s.languageCode, s.lessonId) : null);
const msg = (type, text) => ({ type, text });
const NONE = { suggestions: 0, grammar: 0, pronunciation: 0 };

function start(session) {
  const lesson = lessonOf(session);
  if (lesson) {
    const out = script.start(lesson, session.displayName);
    return { ...out, step: 'lesson' };
  }
  const text = ai.greeting(session);
  return { messages: [msg('question', text)], state: { history: [{ role: 'tutor', text }] }, step: 'practice' };
}

async function turn(session, text, source) {
  const lesson = lessonOf(session);
  if (lesson) {
    const out = script.turn(lesson, session.displayName, session.state, text, source);
    const delta = { ...NONE, ...out.delta };
    return { messages: out.messages, state: { step: out.step }, done: out.done, delta, step: script.stepName(out.step) };
  }
  const history = session.state.history ?? [];
  const r = await ai.aiTurn(session, history, text);
  const messages = [msg('text', r.reply)];
  if (r.correction) messages.push(msg('feedback', r.correction));
  const next = [...history, { role: 'user', text }, { role: 'tutor', text: r.reply }].slice(-HISTORY_CONTEXT);
  const delta = { ...NONE, grammar: r.grammarIssues, suggestions: r.suggestions };
  return { messages, state: { history: next }, done: false, delta, step: 'practice' };
}

module.exports = { start, turn };
