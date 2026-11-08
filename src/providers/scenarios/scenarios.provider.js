const fs = require('fs/promises');
const path = require('path');
const env = require('../../config/env');

// Leitura dos JSON de simulação do app (`<contentDir>/scenarios/`), com cache em memória.
const cache = new Map();

async function readJson(file) {
  if (!cache.has(file)) {
    const promise = fs
      .readFile(path.join(env.contentDir, 'scenarios', file), 'utf8')
      .then(JSON.parse)
      .catch((err) => {
        cache.delete(file); // não guarda falha
        throw err;
      });
    cache.set(file, promise);
  }
  return cache.get(file);
}

/** Cenários neutros de idioma (mestre em PT), sem o roteiro interno. */
async function loadSummaries() {
  const { scenarios } = await readJson('scenarios.json');
  return scenarios.map(({ id, emoji, title, level, goal, turns, best }) => ({ id, emoji, title, level, goal, turns, best }));
}

/** Falas e opções de um cenário no idioma, ou `null` se não existir. */
async function loadScenarioContent(languageCode, scenarioId) {
  const all = await readJson(`${languageCode}.json`);
  return all.scenarios?.[scenarioId] ?? null;
}

function clearCache() {
  cache.clear();
}

module.exports = { loadSummaries, loadScenarioContent, clearCache };
