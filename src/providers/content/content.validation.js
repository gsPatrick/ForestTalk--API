// Validação básica do formato dos JSON de conteúdo (falha cedo e com mensagem clara).
const EXPECTED = { true_false: [10], pairs: [8], translation: [10], pronunciation: [8] };

function fail(message) {
  throw new Error(`Conteúdo inválido: ${message}`);
}

function validateCurriculum(game, data) {
  const [count] = EXPECTED[game];
  if (!data || !Array.isArray(data.phases) || data.phases.length !== 30) fail(`${game}/curriculum.json precisa de 30 fases`);
  data.phases.forEach((p, i) => {
    if (p.phase !== i + 1 || !p.theme || !Array.isArray(p.concepts)) fail(`${game}/curriculum.json fase ${i + 1} malformada`);
    if (p.concepts.length !== count) fail(`${game}/curriculum.json fase ${i + 1} deve ter ${count} conceitos`);
    for (const c of p.concepts) {
      if (!c.id || !c.pt || !c.emoji) fail(`${game}/curriculum.json fase ${i + 1} tem conceito sem id/pt/emoji`);
    }
  });
}

function validateEntries(game, code, data, curriculum) {
  if (!data || typeof data.entries !== 'object' || data.entries === null) fail(`${game}/${code}.json sem "entries"`);
  for (const phase of curriculum.phases) {
    for (const c of phase.concepts) {
      const entry = data.entries[c.id];
      if (!entry || typeof entry.word !== 'string' || !entry.word) fail(`${game}/${code}.json sem palavra para ${c.id}`);
    }
  }
}

module.exports = { validateCurriculum, validateEntries };
