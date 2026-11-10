// Funções puras do progresso do Professor (dias em UTC).
const { computeStreaks } = require('../profile/profile-streak');

const DAY_MS = 86_400_000;
const dayOf = (date) => date.toISOString().slice(0, 10);

/** Sequência atual/melhor e os 7 dias (segunda→domingo) da semana corrente. */
function buildStreak(dates, now) {
  const days = dates.map(dayOf);
  const { current, best } = computeStreaks(days, dayOf(now));
  const set = new Set(days);
  const dow = (now.getUTCDay() + 6) % 7; // segunda = 0
  const monday = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - dow * DAY_MS;
  const weekDays = Array.from({ length: 7 }, (_, i) => set.has(dayOf(new Date(monday + i * DAY_MS))));
  return { current, best, weekDays };
}

const sum = (rows, key) => rows.reduce((total, r) => total + r[key], 0);

/** Tempo: total e média por dia estudado (do idioma) e quanto já foi estudado hoje (todos os idiomas). */
function buildCallTime(languageRows, allRows, now, dailyGoalMinutes) {
  const totalSeconds = sum(languageRows, 'durationSeconds');
  const studiedDays = new Set(languageRows.map((r) => dayOf(r.startedAt))).size;
  const today = dayOf(now);
  const todaySeconds = sum(allRows.filter((r) => dayOf(r.startedAt) === today), 'durationSeconds');
  return {
    totalSeconds,
    dailyAverageSeconds: studiedDays ? Math.round(totalSeconds / studiedDays) : 0,
    dailyGoalMinutes,
    todaySeconds,
  };
}

const buildFeedback = (rows) => ({
  grammar: sum(rows, 'grammar'),
  suggestions: sum(rows, 'suggestions'),
  pronunciation: sum(rows, 'pronunciation'),
});

module.exports = { buildStreak, buildCallTime, buildFeedback };
