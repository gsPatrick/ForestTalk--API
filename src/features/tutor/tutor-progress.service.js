const { TutorSession, PhaseProgress } = require('../../models');
const { wordsOfPhases } = require('../profile/profile-words.service');
const { TOTAL_PHASES } = require('../../config/constants');
const { lessonsOf } = require('./tutor-catalog');
const { getGoal } = require('./tutor-settings.service');
const { HISTORY_LIMIT } = require('./tutor.constants');
const { buildStreak, buildCallTime, buildFeedback } = require('./tutor-progress-stats');

const ATTRS = ['id', 'languageCode', 'lessonId', 'title', 'grammar', 'suggestions', 'pronunciation', 'durationSeconds', 'completed', 'startedAt', 'endedAt'];

/** Palavras do curso (jogos) que o aluno ainda não estudou: total do curso − fases concluídas. */
async function remainingCourseWords(deviceId, languageCode) {
  const rows = await PhaseProgress.findAll({ where: { deviceId, languageCode }, attributes: ['phaseNumber'] });
  const all = Array.from({ length: TOTAL_PHASES }, (_, i) => i + 1);
  return wordsOfPhases(languageCode, all).length - wordsOfPhases(languageCode, rows.map((r) => r.phaseNumber)).length;
}

function newWordsOf(languageCode, rows) {
  const done = new Set(rows.filter((r) => r.completed && r.lessonId).map((r) => r.lessonId));
  return lessonsOf(languageCode).filter((l) => done.has(l.id)).flatMap((l) => l.newWords);
}

async function getProgress(deviceId, languageCode, now = new Date()) {
  const [all, goal, nextCount] = await Promise.all([
    TutorSession.findAll({ where: { deviceId }, attributes: ATTRS, order: [['startedAt', 'DESC']] }),
    getGoal(deviceId),
    remainingCourseWords(deviceId, languageCode),
  ]);
  const rows = all.filter((r) => r.languageCode === languageCode);
  const newWords = [...new Set(newWordsOf(languageCode, rows))];
  return {
    feedback: buildFeedback(rows),
    vocabulary: { newWords, newCount: newWords.length, nextCount },
    streak: buildStreak(all.map((r) => r.startedAt), now),
    callTime: buildCallTime(rows, all, now, goal),
    history: rows
      .filter((r) => r.endedAt)
      .slice(0, HISTORY_LIMIT)
      .map((r) => ({ id: r.id, title: r.title, durationSeconds: r.durationSeconds, completed: r.completed, startedAt: r.startedAt.toISOString() })),
  };
}

module.exports = { getProgress };
