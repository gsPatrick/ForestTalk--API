const { KEYS } = require('./tutor.constants');

const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.!?"']+$/g, '')
    .trim();

/** Chave (A/B/C) escolhida: 'A', 'a', 'a)', 'a) texto' ou o texto da alternativa. `null` se inválido. */
function parseAnswer(text, options) {
  const t = norm(text);
  const letter = t.match(/^([abc])(?:\s*[).:-].*)?$/);
  if (letter) return letter[1].toUpperCase();
  const idx = options.findIndex((o) => norm(o) === t);
  return idx >= 0 ? KEYS[idx] : null;
}

module.exports = { parseAnswer };
