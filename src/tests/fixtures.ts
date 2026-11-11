import profile from '../../public/data/profile.json';
import skills from '../../public/data/skills.json';
import projects from '../../public/data/projects.json';
import experiences from '../../public/data/experiences.json';
import education from '../../public/data/education.json';
import certifications from '../../public/data/certifications.json';
import { contentSchemas } from '../schemas/content';
import type { PortfolioData } from '../types/content';

export const portfolio: PortfolioData = {
  profile: contentSchemas.profile.parse(profile),
  skills: contentSchemas.skills.parse(skills),
  projects: contentSchemas.projects.parse(projects),
  experiences: [],
  education: [],
  certifications: [],
};
export const completePortfolio: PortfolioData = {
  ...portfolio,
  experiences: contentSchemas.experiences.parse(experiences),
  education: contentSchemas.education.parse(education),
  certifications: contentSchemas.certifications.parse(certifications),
};

// Synthetic data for tests only. Never published in public/data.
export const experience = {
  id: 'empresa-exemplo',
  company: 'Empresa de exemplo',
  position: 'QA',
  startDate: '2024-01',
  endDate: null,
  current: true,
  description: 'Descrição de exemplo.',
  technologies: ['Playwright'],
  visible: true,
  order: 1,
};
