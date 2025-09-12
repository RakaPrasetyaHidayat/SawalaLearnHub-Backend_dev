const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');
const OUT = path.resolve(__dirname, '..', 'migrated-js');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.js$/.test(e.name) || /\.js\.map$/.test(e.name)) {
      const rel = path.relative(SRC, full);
      const dest = path.join(OUT, rel);
      ensureDir(path.dirname(dest));
      fs.renameSync(full, dest);
      console.log('moved', full, '->', dest);
    }
  }
}

ensureDir(OUT);
walk(SRC);
console.log('Migration complete. Review files under', OUT);
