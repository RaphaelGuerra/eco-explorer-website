import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const indexPath = path.join(ROOT, 'index.html');
const swPath = path.join(ROOT, 'sw.js');
const localesDir = path.join(ROOT, 'locales');
const localeCodes = ['en', 'pt', 'es', 'fr'];

const read = filePath => fs.readFileSync(filePath, 'utf8');
const fail = message => {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
};

const indexHtml = read(indexPath);
const swSource = read(swPath);
const locales = Object.fromEntries(
  localeCodes.map(code => [
    code,
    JSON.parse(read(path.join(localesDir, `${code}.json`))),
  ])
);

const dataTranslateKeys = [
  ...indexHtml.matchAll(/data-translate="([^"]+)"/g),
].map(match => match[1]);
const uniqueDataTranslateKeys = [...new Set(dataTranslateKeys)];

for (const code of localeCodes) {
  const missing = uniqueDataTranslateKeys.filter(
    key => !(key in locales[code])
  );
  if (missing.length > 0) {
    fail(`locale ${code} is missing keys: ${missing.join(', ')}`);
  }
}

const enKeys = Object.keys(locales.en);
for (const code of localeCodes.filter(value => value !== 'en')) {
  const extra = Object.keys(locales[code]).filter(key => !enKeys.includes(key));
  if (extra.length > 0) {
    fail(`locale ${code} has keys not in en.json: ${extra.join(', ')}`);
  }
}

if (
  !indexHtml.includes('<!-- ANALYTICS_START -->') ||
  !indexHtml.includes('<!-- ANALYTICS_END -->')
) {
  fail('analytics markers are missing in index.html');
}

const shellMatch = swSource.match(/const APP_SHELL = \[([\s\S]*?)\];/);
if (!shellMatch) {
  fail('APP_SHELL was not found in sw.js');
} else {
  const shellEntries = [...shellMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(
    match => match[1]
  );
  for (const entry of shellEntries) {
    const localPath = entry.replace(/^\.\//, '');
    const absolutePath = path.join(ROOT, localPath);
    if (!fs.existsSync(absolutePath)) {
      fail(`APP_SHELL entry does not exist on disk: ${entry}`);
    }
  }
}

if (process.exitCode !== 1) {
  console.log('Site validation passed.');
}
