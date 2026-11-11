import { z } from 'zod';

const text = z.string().trim().min(1);
const id = text.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Use um identificador em kebab-case.',
);
export const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use o formato AAAA-MM.');
const date = monthSchema.nullish();
const httpsUrl = z.url({ protocol: /^https$/, error: 'Use uma URL HTTPS.' });
const asset = text.refine(
  (value) =>
    /^\/(?!\/)[a-zA-Z0-9/_ .-]+$/.test(value) &&
    !value.split('/').includes('..'),
  'Use um caminho local absoluto, sem navegação para diretórios superiores.',
);
const image = z.object({ src: asset, alt: text });
const base = {
  id,
  visible: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
};
const strings = z.array(text).default([]);

export const profileSchema = z.object({
  id,
  name: text,
  brand: text,
  role: text,
  location: text.nullish(),
  languages: strings,
  intro: text,
  about: z.array(text).min(1),
  photo: image
    .extend({
      zoom: z.number().min(1).max(3).default(1),
      originY: z.number().min(0).max(100).default(0),
    })
    .nullish(),
  contactHeadline: text,
  contactText: text,
  githubUrl: httpsUrl.nullish(),
  linkedinUrl: httpsUrl.nullish(),
  email: z.email().nullish(),
  resumeUrl: z.union([httpsUrl, asset]).nullish(),
  siteUrl: httpsUrl,
});

export const experienceSchema = z
  .object({
    ...base,
    company: text,
    position: text,
    startDate: date,
    endDate: date,
    current: z.boolean().default(false),
    description: text.nullish(),
    technologies: strings,
  })
  .superRefine((record, ctx) => {
    if (record.current && record.endDate)
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Um vínculo atual não pode ter data de término.',
      });
    if (record.startDate && record.endDate && record.endDate < record.startDate)
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'O término deve ser posterior ao início.',
      });
  });
export const educationSchema = z
  .object({
    ...base,
    course: text,
    institution: text,
    startDate: date,
    endDate: date,
    status: z.enum(['completed', 'in-progress', 'paused']),
    description: text.nullish(),
  })
  .refine(
    (record) =>
      !record.startDate ||
      !record.endDate ||
      record.endDate >= record.startDate,
    { path: ['endDate'], message: 'O término deve ser posterior ao início.' },
  );
export const certificationSchema = z
  .object({
    ...base,
    kind: z.enum(['certification', 'course']).optional(),
    name: text,
    issuer: text,
    status: z.enum(['completed', 'in-progress']),
    completionDate: date,
    issueDate: date,
    expiryDate: date,
    credentialId: text.nullish(),
    verificationUrl: httpsUrl.nullish(),
  })
  .superRefine((record, ctx) => {
    if (
      record.status === 'in-progress' &&
      (record.completionDate ||
        record.issueDate ||
        record.expiryDate ||
        record.credentialId ||
        record.verificationUrl)
    )
      ctx.addIssue({
        code: 'custom',
        message:
          'Estudos em andamento não devem ter conclusão, emissão ou credenciais de conclusão.',
      });
    if (
      record.issueDate &&
      record.expiryDate &&
      record.expiryDate < record.issueDate
    )
      ctx.addIssue({
        code: 'custom',
        path: ['expiryDate'],
        message: 'A validade deve ser posterior à emissão.',
      });
  });
export const skillSchema = z.object({
  ...base,
  name: text,
  description: text.nullish(),
  items: z.array(text).min(1),
});
export const projectSchema = z.object({
  ...base,
  slug: id,
  name: text,
  category: text,
  summary: text,
  description: text,
  technologies: z.array(text).min(1),
  problem: text.nullish(),
  solution: text.nullish(),
  features: z.array(z.object({ title: text, description: text })).default([]),
  architecture: strings,
  challenges: strings,
  testing: strings,
  results: strings,
  gallery: z.array(image).default([]),
  image: image.nullish(),
  repositoryUrl: httpsUrl.nullish(),
  links: z.array(z.object({ label: text, url: httpsUrl })).default([]),
});

function uniqueList<T extends z.ZodType<{ id: string }>>(schema: T) {
  return z.array(schema).superRefine((records, ctx) => {
    const ids = new Set<string>();
    records.forEach((record, index) => {
      if (ids.has(record.id))
        ctx.addIssue({
          code: 'custom',
          path: [index, 'id'],
          message: 'Identificador duplicado.',
        });
      ids.add(record.id);
    });
  });
}

export const contentSchemas = {
  profile: profileSchema,
  experiences: uniqueList(experienceSchema),
  education: uniqueList(educationSchema),
  certifications: uniqueList(certificationSchema),
  skills: uniqueList(skillSchema),
  projects: uniqueList(projectSchema).superRefine((records, ctx) => {
    const slugs = new Set<string>();
    records.forEach((record, index) => {
      if (slugs.has(record.slug))
        ctx.addIssue({
          code: 'custom',
          path: [index, 'slug'],
          message: 'Slug duplicado.',
        });
      slugs.add(record.slug);
    });
  }),
};
