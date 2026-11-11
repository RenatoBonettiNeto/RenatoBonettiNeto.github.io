import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { contentSchemas } from '../src/schemas/content.ts';

for (const [name, schema] of Object.entries(contentSchemas)) {
  const path = resolve('public/data', `${name}.json`);
  const result = schema.safeParse(JSON.parse(await readFile(path, 'utf8')));
  if (!result.success)
    throw new Error(`${name}.json:\n${result.error.message}`);
  if (name === 'profile') {
    const profile = contentSchemas.profile.parse(result.data);
    if (profile.resumeUrl?.startsWith('/'))
      await access(resolve('public', profile.resumeUrl.slice(1)));
    if (profile.photo)
      await access(resolve('public', profile.photo.src.slice(1)));
  }
  if (name === 'projects') {
    for (const project of contentSchemas.projects.parse(result.data)) {
      for (const image of [project.image, ...project.gallery]) {
        if (image) await access(resolve('public', image.src.slice(1)));
      }
    }
  }
  console.log(`OK: ${name}.json`);
}
