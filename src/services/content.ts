import { contentSchemas } from '../schemas/content';
import { published } from '../utils/content';
import type { PortfolioData } from '../types/content';
import type { z } from 'zod';

async function loadFile<T>(
  name: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}.json`, {
    signal,
  });
  if (!response.ok)
    throw new Error(
      `Não foi possível carregar ${name}.json (HTTP ${response.status}).`,
    );
  const parsed = schema.safeParse(await response.json());
  if (!parsed.success)
    throw new Error(
      `Conteúdo inválido em ${name}.json: ${parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
    );
  return parsed.data;
}

export async function loadPortfolio(
  signal?: AbortSignal,
): Promise<PortfolioData> {
  const [profile, experiences, education, certifications, skills, projects] =
    await Promise.all([
      loadFile('profile', contentSchemas.profile, signal),
      loadFile('experiences', contentSchemas.experiences, signal),
      loadFile('education', contentSchemas.education, signal),
      loadFile('certifications', contentSchemas.certifications, signal),
      loadFile('skills', contentSchemas.skills, signal),
      loadFile('projects', contentSchemas.projects, signal),
    ]);
  return {
    profile,
    experiences: published(experiences),
    education: published(education),
    certifications: published(certifications),
    skills: published(skills),
    projects: published(projects),
  };
}
