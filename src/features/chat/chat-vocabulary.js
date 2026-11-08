// Recuperação (a parte "R" do RAG): escolhe, no vocabulário que o aluno já estudou, as palavras
// mais úteis para a próxima resposta. Função pura, sem banco nem I/O.
const MAX_WORDS = 8;

const normalize = (s) =>
  String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
const tokens = (s) => normalize(s).split(/[^\p{L}\p{N}]+/u).filter((t) => t.length > 2);

/** Quantas palavras da fala do aluno aparecem no conceito (na palavra estudada ou na tradução). */
function relevance(concept, said) {
  if (!said.size) return 0;
  const own = new Set([...tokens(concept.word), ...tokens(concept.pt)]);
  let score = 0;
  for (const t of said) if (own.has(t)) score += 1;
  return score;
}

/**
 * `pool` vem do mais recente para o mais antigo. Primeiro os conceitos citados pelo aluno
 * (por relevância), depois os mais recentes, sem repetir, até `MAX_WORDS`.
 */
function pickVocabulary(pool, userText, limit = MAX_WORDS) {
  const said = new Set(tokens(userText));
  const scored = pool.map((concept, index) => ({ concept, index, score: relevance(concept, said) }));
  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score || a.index - b.index);
  const recent = scored.filter((s) => s.score === 0);
  const seen = new Set();
  const out = [];
  for (const { concept } of [...hits, ...recent]) {
    if (seen.has(concept.id) || out.length >= limit) continue;
    seen.add(concept.id);
    out.push({ word: concept.word, pt: concept.pt });
  }
  return out;
}

module.exports = { pickVocabulary, MAX_WORDS };
