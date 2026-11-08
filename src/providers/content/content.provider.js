// Leitura dos JSON de conteúdo (env.contentDir) com cache em memória. Nenhuma feature lê arquivo direto.
const fs = require('fs');
const path = require('path');
const env = require('../../config/env');
const { validateCurriculum, validateEntries } = require('./content.validation');

const GAMES = ['true_false', 'pairs', 'translation', 'pronunciation'];
const cache = new Map();

function readJson(...parts) {
  const file = path.join(env.contentDir, ...parts);
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch {
    throw new Error(`Conteúdo ausente: não foi possível ler ${file} (CONTENT_DIR=${env.contentDir})`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Conteúdo inválido: JSON malformado em ${file}`);
  }
}

function memo(key, build) {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key);
}

function loadCurriculum(game) {
  return memo(`${game}/curriculum`, () => {
    const data = readJson(game, 'curriculum.json');
    validateCurriculum(game, data);
    return data;
  });
}

function loadLanguage(game, languageCode) {
  if (!GAMES.includes(game)) throw new Error(`Jogo desconhecido: ${game}`);
  return memo(`${game}/${languageCode}`, () => {
    const curriculum = loadCurriculum(game);
    const lang = readJson(game, `${languageCode}.json`);
    validateEntries(game, languageCode, lang, curriculum);
    const phases = curriculum.phases.map((p) => ({
      phase: p.phase,
      globalPhase: p.globalPhase,
      chapter: p.chapter,
      level: p.level,
      theme: p.theme,
      concepts: p.concepts.map((c) => ({ id: c.id, emoji: c.emoji, pt: c.pt, ...lang.entries[c.id] })),
    }));
    return { phases, version: `${curriculum.version}.${lang.version}` };
  });
}

/** Fases (30) do jogo já com as palavras do idioma: `{ phase, globalPhase, chapter, level, theme, concepts[] }`. */
const getPhases = (game, languageCode) => loadLanguage(game, languageCode).phases;

/** Versão do conteúdo (curriculum.language) para ETag. */
const getVersion = (game, languageCode) => loadLanguage(game, languageCode).version;

function clearCache() {
  cache.clear();
}

module.exports = { getPhases, getVersion, clearCache, GAMES };
