import type { z } from 'zod';
import type {
  contentSchemas,
  projectSchema,
  profileSchema,
} from '../schemas/content';

export type PortfolioData = {
  [K in keyof typeof contentSchemas]: z.infer<(typeof contentSchemas)[K]>;
};
export type Project = z.infer<typeof projectSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type SectionLink = { id: string; label: string };
