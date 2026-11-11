import type { PortfolioData, SectionLink } from '../types/content';

export function published<T extends { visible: boolean; order: number }>(
  records: T[],
): T[] {
  return records
    .filter((record) => record.visible)
    .sort((a, b) => a.order - b.order);
}

export function formatMonth(value?: string | null): string | null {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return null;
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatPeriod(
  start?: string | null,
  end?: string | null,
  current = false,
): string | null {
  const from = formatMonth(start);
  const to = current ? 'Atual' : formatMonth(end);
  return [from, to].filter(Boolean).join(' — ') || null;
}

export function navigation(data: PortfolioData): SectionLink[] {
  return [
    { id: 'about', label: 'Sobre' },
    ...(data.skills.length ? [{ id: 'skills', label: 'Competências' }] : []),
    ...(data.experiences.length
      ? [{ id: 'experience', label: 'Experiência' }]
      : []),
    ...(data.education.length ? [{ id: 'education', label: 'Formação' }] : []),
    ...(data.certifications.length
      ? [{ id: 'certifications', label: learningLabel(data.certifications) }]
      : []),
    ...(data.projects.length ? [{ id: 'projects', label: 'Projetos' }] : []),
    { id: 'contact', label: 'Contato' },
  ];
}

export function learningLabel(
  records: PortfolioData['certifications'],
): string {
  if (records.length && records.every((item) => item.kind === 'course'))
    return 'Cursos';
  if (records.every((item) => item.kind !== 'course')) return 'Certificações';
  return 'Cursos e certificações';
}

export const sectionPath = (id: string) => `/#${id}`;
