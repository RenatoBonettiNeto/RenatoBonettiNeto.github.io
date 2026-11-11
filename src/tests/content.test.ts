import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  certificationSchema,
  contentSchemas,
  educationSchema,
  experienceSchema,
  profileSchema,
} from '../schemas/content';
import { formatMonth, formatPeriod, published } from '../utils/content';
import { experience, portfolio } from './fixtures';

describe('publicação e ordenação', () => {
  it('ordena por order, remove invisíveis e preserva a entrada', () => {
    const records = [
      { ...experience, id: 'later', order: 3 },
      { ...experience, id: 'hidden', visible: false, order: 0 },
      { ...experience, id: 'first', order: 1 },
    ];
    expect(published(records).map((record) => record.id)).toEqual([
      'first',
      'later',
    ]);
    expect(records[0].id).toBe('later');
  });
  it('mantém a ordem original quando order é igual', () => {
    expect(
      published([
        { ...experience, id: 'a' },
        { ...experience, id: 'b' },
      ]).map((item) => item.id),
    ).toEqual(['a', 'b']);
  });
});
describe('datas', () => {
  it('formata mês sem deslocamento de fuso e aceita datas ausentes', () => {
    expect(formatMonth('2024-01')).toBe('jan. de 2024');
    expect(formatMonth(null)).toBeNull();
    expect(formatMonth('2024-13')).toBeNull();
    expect(formatPeriod(null, null)).toBeNull();
    expect(formatPeriod(null, null, true)).toBe('Atual');
    expect(formatPeriod('2024-01', null, true)).toBe('jan. de 2024 — Atual');
  });
  it('rejeita meses e intervalos inválidos', () => {
    expect(
      experienceSchema.safeParse({ ...experience, startDate: '2024-13' })
        .success,
    ).toBe(false);
    expect(
      experienceSchema.safeParse({
        ...experience,
        current: true,
        endDate: '2025-01',
      }).success,
    ).toBe(false);
    expect(
      experienceSchema.safeParse({
        ...experience,
        current: false,
        endDate: '2023-01',
      }).success,
    ).toBe(false);
    expect(
      educationSchema.safeParse({
        id: 'curso',
        course: 'Exemplo',
        institution: 'Exemplo',
        status: 'completed',
        startDate: '2025-01',
        endDate: '2024-01',
      }).success,
    ).toBe(false);
  });
});
describe('esquemas', () => {
  it.each(Object.entries(contentSchemas))(
    'valida o JSON real de %s',
    (name, schema) => {
      const json = JSON.parse(readFileSync(`public/data/${name}.json`, 'utf8'));
      expect(schema.safeParse(json).success).toBe(true);
    },
  );
  it('permite dados opcionais ausentes e define defaults', () => {
    const result = experienceSchema.parse({
      ...experience,
      technologies: undefined,
      startDate: null,
      endDate: null,
    });
    expect(result.technologies).toEqual([]);
    expect(
      profileSchema.safeParse({
        ...portfolio.profile,
        linkedinUrl: undefined,
        resumeUrl: null,
        email: null,
      }).success,
    ).toBe(true);
  });
  it('exige campos, URLs seguras e slugs únicos', () => {
    expect(
      experienceSchema.safeParse({ ...experience, company: '' }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...portfolio.profile,
        githubUrl: 'javascript:alert(1)',
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...portfolio.profile,
        resumeUrl: '//exemplo.com/cv.pdf',
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...portfolio.profile,
        resumeUrl: '/assets/../cv.pdf',
      }).success,
    ).toBe(false);
    expect(
      contentSchemas.experiences.safeParse([experience, experience]).success,
    ).toBe(false);
    expect(
      contentSchemas.projects.safeParse([
        portfolio.projects[0],
        { ...portfolio.projects[0], id: 'outro-id' },
      ]).success,
    ).toBe(false);
  });
  it('não trata estudos em andamento como credenciais obtidas', () => {
    const study = {
      id: 'estudo',
      name: 'Curso exemplo',
      issuer: 'Emissor exemplo',
      status: 'in-progress',
    };
    expect(certificationSchema.safeParse(study).success).toBe(true);
    expect(
      certificationSchema.safeParse({ ...study, credentialId: 'ABC' }).success,
    ).toBe(false);
    expect(
      certificationSchema.safeParse({ ...study, issueDate: '2025-01' }).success,
    ).toBe(false);
    expect(
      certificationSchema.safeParse({
        ...study,
        kind: 'course',
        completionDate: '2025-01',
      }).success,
    ).toBe(false);
    expect(
      certificationSchema.safeParse({
        ...study,
        status: 'completed',
        issueDate: '2025-02',
        expiryDate: '2024-01',
      }).success,
    ).toBe(false);
  });
});
