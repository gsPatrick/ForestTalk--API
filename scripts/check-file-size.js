// Falha se algum .js de app passar de 200 linhas (regra anti God File); avisa a partir de 150.
const fs = require('fs');
const path = require('path');

const roots = ['app.js', 'src', 'scripts', 'migrations'];
const skip = new Set(['node_modules']);
let failed = false;

function check(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n').length;
  if (lines > 200) {
    console.error(`❌ ${file}: ${lines} linhas (> 200)`);
    failed = true;
  } else if (lines >= 150) console.warn(`⚠️  ${file}: ${lines} linhas (>= 150, extrair)`);
}

function walk(target) {
  if (!fs.existsSync(target)) return;
  if (fs.statSync(target).isFile()) return target.endsWith('.js') && check(target);
  for (const name of fs.readdirSync(target)) if (!skip.has(name)) walk(path.join(target, name));
}

roots.forEach(walk);
if (failed) process.exit(1);
console.log('✅ check:size ok');
