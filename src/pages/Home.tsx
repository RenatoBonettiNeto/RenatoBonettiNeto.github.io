import type { PortfolioData } from '../types/content';
import { useMetadata } from '../hooks/useMetadata';
import { Hero } from '../components/home/Hero';
import {
  About,
  Certifications,
  Education,
  Experience,
  Skills,
} from '../components/home/ProfessionalSections';
import { Projects } from '../components/home/Projects';
import { Contact } from '../components/home/Contact';

export function Home({ data }: { data: PortfolioData }) {
  useMetadata(
    `${data.profile.name} | QA & Test Automation`,
    data.profile.intro,
  );
  return (
    <div className="container">
      <Hero profile={data.profile} hasProjects={data.projects.length > 0} />
      <About data={data} />
      <Skills skills={data.skills} />
      <Experience experiences={data.experiences} />
      <Education education={data.education} />
      <Certifications certifications={data.certifications} />
      <Projects projects={data.projects} />
      <Contact profile={data.profile} />
    </div>
  );
}
