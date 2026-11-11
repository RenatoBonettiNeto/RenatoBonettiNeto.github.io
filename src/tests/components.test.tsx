import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { Home } from '../pages/Home';
import { Header } from '../components/layout/Header';
import {
  Certifications,
  Education,
  Experience,
} from '../components/home/ProfessionalSections';
import { portfolio, completePortfolio, experience } from './fixtures';

it('renderiza informações carregadas e oculta seções e links não configurados', () => {
  render(
    <MemoryRouter>
      <Home
        data={{
          ...portfolio,
          profile: {
            ...portfolio.profile,
            linkedinUrl: null,
            resumeUrl: null,
            email: null,
          },
        }}
      />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    portfolio.profile.name,
  );
  for (const id of ['about', 'skills', 'projects', 'contact'])
    expect(document.getElementById(id)).toBeInTheDocument();
  for (const id of ['education', 'experience', 'certifications'])
    expect(document.getElementById(id)).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: /currículo/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: /linkedin/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /conhecer o projeto/i }),
  ).toHaveAttribute('href', '/projects/qa-recorder');
});
it('renderiza experiência, formação e distinção entre estudo e certificação', () => {
  render(
    <MemoryRouter>
      <Experience experiences={[experience]} />
      <Education
        education={[
          {
            id: 'curso',
            course: 'Curso de exemplo',
            institution: 'Instituição de exemplo',
            status: 'completed',
            visible: true,
            order: 1,
          },
        ]}
      />
      <Certifications
        certifications={[
          {
            id: 'estudo',
            name: 'Estudo exemplo',
            issuer: 'Emissor exemplo',
            status: 'in-progress',
            visible: true,
            order: 1,
          },
          {
            id: 'certificado',
            name: 'Certificado exemplo',
            issuer: 'Emissor exemplo',
            status: 'completed',
            visible: true,
            order: 2,
            issueDate: '2025-01',
            credentialId: 'EXEMPLO',
            verificationUrl: 'https://example.com/verify',
          },
        ]}
      />
    </MemoryRouter>,
  );
  expect(screen.getByRole('heading', { name: 'QA' })).toBeInTheDocument();
  expect(screen.getByText('Vínculo atual')).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Curso de exemplo' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Estudo em andamento')).toBeInTheDocument();
  expect(screen.getByText('Concluída')).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /verificar credencial/i }),
  ).toHaveAttribute('rel', 'noopener noreferrer');
});
it('abre o menu, navega, fecha e devolve o foco ao pressionar Escape', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Header data={portfolio} />
    </MemoryRouter>,
  );
  await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
  expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await user.keyboard('{Escape}');
  expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus();
  await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
  await user.click(
    within(screen.getByRole('navigation')).getByRole('link', { name: 'Sobre' }),
  );
  expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

it('apresenta o currículo carregado com cursos, previsão de formação e contatos corretos', () => {
  render(
    <MemoryRouter>
      <Home data={completePortfolio} />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole('heading', {
      name: 'Analista de Qualidade de Software (QA)',
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: 'Bacharelado em Sistemas de Informação',
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText('out. de 2026 — abr. de 2028 (previsão)'),
  ).toBeInTheDocument();
  expect(screen.getAllByText('Curso concluído')).toHaveLength(
    completePortfolio.certifications.length,
  );
  expect(
    screen.queryByText('Concluída', { exact: true }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: /verificar credencial/i }),
  ).not.toBeInTheDocument();
  for (const link of screen.getAllByRole('link', { name: /LinkedIn/ }))
    expect(link).toHaveAttribute('href', completePortfolio.profile.linkedinUrl);
  for (const link of screen.getAllByRole('link', { name: /Enviar e-mail/ }))
    expect(link).toHaveAttribute(
      'href',
      `mailto:${completePortfolio.profile.email}`,
    );
});
