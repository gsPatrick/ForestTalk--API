const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const CLI = require.resolve('sequelize-cli/lib/sequelize');

/**
 * Aplica as migrações pendentes (db:migrate do sequelize-cli) antes da API começar a responder.
 * A tabela SequelizeMeta garante que cada migração roda uma única vez. Se falhar, derruba o processo
 * (melhor não subir do que atender com o banco desatualizado).
 * Desligue com RUN_MIGRATIONS=false (ex.: quando as migrações rodam num passo separado do deploy).
 */
function runMigrations() {
  if (process.env.RUN_MIGRATIONS === 'false') return;
  console.log('Aplicando migrações pendentes...');
  const result = spawnSync(process.execPath, [CLI, 'db:migrate'], { cwd: ROOT, stdio: 'inherit', env: process.env });
  if (result.status !== 0) throw new Error(`Falha ao aplicar as migrações (código ${result.status})`);
}

module.exports = { runMigrations };
