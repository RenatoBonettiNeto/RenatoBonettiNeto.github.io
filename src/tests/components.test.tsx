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
import { formatMonth } from '../utils/content';

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
          {
            id: 'curso-concluido',
            name: 'Curso concluído exemplo',
            issuer: 'Emissor exemplo',
            kind: 'course',
            status: 'completed',
            visible: true,
            order: 3,
            completionDate: '2025-02',
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
    screen.getByText('Curso concluído', { exact: true }),
  ).toBeInTheDocument();
  expect(screen.getByText('Conclusão: fev. de 2025')).toBeInTheDocument();
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
  const learning = within(
    screen.getByRole('region', { name: 'Aprender. Aplicar. Evoluir.' }),
  );
  const cards = learning.getAllByRole('article');
  expect(cards).toHaveLength(completePortfolio.certifications.length);
  completePortfolio.certifications.forEach((item, index) => {
    const card = within(cards[index]);
    expect(card.getByRole('heading', { name: item.name })).toBeInTheDocument();
    expect(card.getByText(item.issuer)).toBeInTheDocument();
    expect(
      card.getByText(
        item.status !== 'completed'
          ? 'Estudo em andamento'
          : item.kind === 'course'
            ? 'Curso concluído'
            : 'Concluída',
        { exact: true },
      ),
    ).toBeInTheDocument();
    for (const [label, date] of [
      ['Conclusão', item.completionDate],
      ['Emissão', item.issueDate],
      ['Validade', item.expiryDate],
    ]) {
      if (date)
        expect(
          card.getByText(`${label}: ${formatMonth(date)}`),
        ).toBeInTheDocument();
      else
        expect(
          card.queryByText(new RegExp(`^${label}:`)),
        ).not.toBeInTheDocument();
    }
    if (item.credentialId)
      expect(
        card.getByText(`Credencial: ${item.credentialId}`),
      ).toBeInTheDocument();
    const verification = card.queryByRole('link', {
      name: /verificar credencial/i,
    });
    if (item.verificationUrl) {
      expect(verification).toHaveAttribute('href', item.verificationUrl);
      expect(verification).toHaveAttribute('rel', 'noopener noreferrer');
    } else expect(verification).not.toBeInTheDocument();
  });
  for (const link of screen.getAllByRole('link', { name: /LinkedIn/ }))
    expect(link).toHaveAttribute('href', completePortfolio.profile.linkedinUrl);
  for (const link of screen.getAllByRole('link', { name: /Enviar e-mail/ }))
    expect(link).toHaveAttribute(
      'href',
      `mailto:${completePortfolio.profile.email}`,
    );
});
