/** Itens da fase de Pronúncia: um por conceito, na ordem do currículo (sem embaralhar). */
function generatePronunciation({ phase }) {
  return phase.concepts.map((c) => ({
    id: c.id,
    emoji: c.emoji,
    word: c.word,
    translit: c.translit ?? null,
    translation: c.pt,
    example: c.example ?? null,
    examplePt: c.examplePt ?? null,
    pron: c.pron ?? null,
    curiosity: c.curiosity ?? null,
  }));
}

module.exports = { generatePronunciation };
