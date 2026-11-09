// Função PURA: sequências de dias seguidos a partir de datas 'YYYY-MM-DD' (UTC).
const DAY_MS = 86_400_000;

const toDay = (s) => Date.parse(`${s}T00:00:00Z`) / DAY_MS;
const fromDay = (n) => new Date(n * DAY_MS).toISOString().slice(0, 10);

/**
 * `current`: dias seguidos até hoje (ou até ontem, se hoje ainda não teve atividade).
 * `best`: maior sequência já feita.
 */
function computeStreaks(dateStrings, today) {
  const days = [...new Set(dateStrings)].map(toDay).sort((a, b) => a - b);
  if (days.length === 0) return { current: 0, best: 0 };

  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] - days[i - 1] === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  const set = new Set(days);
  const todayN = toDay(today);
  let cursor = set.has(todayN) ? todayN : todayN - 1;
  let current = 0;
  while (set.has(cursor)) {
    current += 1;
    cursor -= 1;
  }
  return { current, best };
}

module.exports = { computeStreaks, fromDay };
