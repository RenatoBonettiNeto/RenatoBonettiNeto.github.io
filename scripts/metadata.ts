import { readFile, writeFile } from 'node:fs/promises';
import { profileSchema } from '../src/schemas/content.ts';

const profile = profileSchema.parse(
  JSON.parse(await readFile('public/data/profile.json', 'utf8')),
);
const escape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const title = escape(`${profile.name} | QA & Test Automation`);
const description = escape(profile.intro);
const siteUrl = profile.siteUrl.endsWith('/')
  ? profile.siteUrl
  : `${profile.siteUrl}/`;
let html = await readFile('index.html', 'utf8');
html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
for (const [selector, value] of Object.entries({
  'name="description"': description,
  'property="og:title"': title,
  'property="og:description"': description,
  'property="og:url"': escape(siteUrl),
  'property="og:image"': escape(`${siteUrl}social-card.png`),
  'property="og:image:alt"': escape(`${profile.name} — ${profile.role}`),
})) {
  html = html.replace(
    new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`),
    `$1${value.replaceAll('$', '$$$$')}$2`,
  );
}
html = html.replace(
  /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
  `$1${escape(siteUrl)}$2`,
);
await writeFile('index.html', html);
await writeFile(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escape(siteUrl)}</loc></url></urlset>\n`,
);
await writeFile(
  'public/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`,
);
