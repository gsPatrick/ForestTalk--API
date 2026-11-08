/** Os 8 pares de uma fase: cada conceito vira palavra ⇄ tradução (ordem do currículo). */
function generatePairs({ phaseNumber, phase }) {
  return phase.concepts.map((c) => ({
    id: `p${phaseNumber}-${c.id}`,
    word: c.word,
    translit: c.translit ?? null,
    translation: c.pt,
    emoji: c.emoji,
    example: c.example ?? null,
    examplePt: c.examplePt ?? null,
    pron: c.pron ?? null,
    curiosity: c.curiosity ?? null,
  }));
}

module.exports = { generatePairs };
