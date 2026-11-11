import { test, expect, type Page } from '@playwright/test';
import projectData from '../public/data/projects.json' with { type: 'json' };
import educationData from '../public/data/education.json' with { type: 'json' };
import { published } from '../src/utils/content';
import experienceExamples from '../docs/examples/experiences.json' with { type: 'json' };
import educationExamples from '../docs/examples/education.json' with { type: 'json' };
import certificationExamples from '../docs/examples/certifications.json' with { type: 'json' };

async function openMenu(page: Page) {
  const toggle = page.getByRole('button', { name: 'Abrir menu' });
  if (await toggle.isVisible()) await toggle.click();
}

test('header acompanha a seção durante o scroll sem alterar a URL', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#about')).toBeAttached();
  const current = page.locator('#main-navigation a[aria-current="location"]');
  const url = page.url();
  await expect(current).toHaveCount(0);
  const sections = await page
    .locator('#main-navigation a[href^="#/#"]')
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')!.split('#').at(-1)!),
    );
  expect(sections).toContain('experience');
  for (const id of sections) {
    await page
      .locator(`#${id}`)
      .evaluate((element) => element.scrollIntoView({ behavior: 'instant' }));
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('href', `#/#${id}`);
    await expect(page).toHaveURL(url);
  }
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  await expect(current).toHaveAttribute('href', '#/#contact');
  await openMenu(page);
  await expect(current).toBeVisible();
  await expect(current).toHaveCSS('text-decoration-line', 'underline');
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Sobre', exact: true })
    .click();
  await expect(current).toHaveAttribute('href', '#/#about');
  await expect(page).toHaveURL(/#\/#about$/);
  await page
    .locator('#experience')
    .evaluate((element) => element.scrollIntoView({ behavior: 'instant' }));
  await expect(current).toHaveAttribute('href', '#/#experience');
  await expect(page).toHaveURL(/#\/#about$/);
  for (const id of [...sections].reverse()) {
    await page
      .locator(`#${id}`)
      .evaluate((element) => element.scrollIntoView({ behavior: 'instant' }));
    await expect(current).toHaveAttribute('href', `#/#${id}`);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(current).toHaveCount(0);
  await page.goto('/#/projects/qa-recorder');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'QA-Recorder.',
  );
  await expect(current).toHaveCount(0);
  await page.getByRole('link', { name: 'Voltar aos projetos' }).click();
  await expect(current).toHaveAttribute('href', '#/#projects');
  await page.goto('/#/#experience');
  await expect(current).toHaveAttribute('href', '#/#experience');
  await page.reload();
  await expect(current).toHaveAttribute('href', '#/#experience');
  await page.goto('/#/caminho-inexistente');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'fora do roteiro',
  );
  await expect(current).toHaveCount(0);
});

test('home, âncoras, detalhes, atualização e retorno sem erros críticos', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Renato Bonetti Neto.',
  );
  await expect(
    page.getByRole('link', { name: 'Explorar projetos' }),
  ).toBeVisible();
  await expect(page.locator('#education')).toHaveCount(
    published(educationData).length ? 1 : 0,
  );
  await openMenu(page);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Competências' })
    .click();
  await expect(page).toHaveURL(/#\/#skills$/);
  await expect(page.locator('#skills')).toBeInViewport();
  await openMenu(page);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Projetos' })
    .click();
  await expect(page.locator('#projects')).toBeInViewport();
  await page.getByRole('link', { name: 'Conhecer o projeto' }).click();
  await expect(page).toHaveURL(/#\/projects\/qa-recorder$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'QA-Recorder.',
  );
  await expect(page).toHaveTitle(/QA-Recorder/);
  await expect(
    page.getByRole('heading', { name: 'Funcionalidades principais' }),
  ).toBeVisible();
  const project = projectData.find((item) => item.slug === 'qa-recorder')!;
  for (const [title, items] of [
    ['Arquitetura e decisões técnicas', project.architecture],
    ['Desafios técnicos', project.challenges],
    ['Estratégia de testes e qualidade', project.testing],
    ['Resultados e benefícios', project.results],
  ] as const) {
    const heading = page.getByRole('heading', { name: title, exact: true });
    await expect(heading).toHaveCount(items.length ? 1 : 0);
    if (items.length) {
      const entries = heading.locator('..').getByRole('listitem');
      await expect(entries).toHaveText(items);
    }
  }
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'QA-Recorder.',
  );
  await page.getByRole('link', { name: 'Voltar aos projetos' }).click();
  await expect(page.locator('#projects')).toBeInViewport();
  await openMenu(page);
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Contato' })
    .click();
  await expect(page.locator('#contact')).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test('projeto sem conteúdo opcional oculta seções vazias e links privados', async ({
  page,
}) => {
  const project = {
    ...projectData[0],
    problem: null,
    solution: null,
    features: [],
    architecture: [],
    challenges: [],
    testing: [],
    results: [],
    gallery: [],
    repositoryUrl: null,
    links: [],
  };
  await page.route('**/data/projects.json', (route) =>
    route.fulfill({ json: [project] }),
  );
  await page.goto(`/#/projects/${project.slug}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    `${project.name}.`,
  );
  for (const title of [
    'O problema',
    'A solução',
    'Funcionalidades principais',
    'Arquitetura e decisões técnicas',
    'Desafios técnicos',
    'Estratégia de testes e qualidade',
    'Resultados e benefícios',
    'Galeria',
    'Explore o projeto',
  ])
    await expect(
      page.getByRole('heading', { name: title, exact: true }),
    ).toHaveCount(0);
  await expect(page.getByRole('link', { name: /repositório/i })).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'Voltar aos projetos' }),
  ).toBeVisible();
});

test('links internos da home têm destinos válidos e não há overflow', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#about')).toBeAttached();
  const targets = await page
    .locator('a[href^="#/#"]')
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')!.split('#').at(-1)!),
    );
  expect(targets.length).toBeGreaterThan(0);
  for (const id of targets)
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow em ${width}px`,
    ).toBe(true);
  }
});

test('âncora direta, página desconhecida e projeto inexistente', async ({
  page,
}) => {
  await page.goto('/#about');
  await expect(page.locator('#about')).toBeInViewport();
  await page.goto('/#/projects/nao-existe');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'fora do roteiro',
  );
  await page.goto('/#/caminho-inexistente');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'fora do roteiro',
  );
  await page.getByRole('link', { name: 'Voltar ao portfólio' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Renato Bonetti',
  );
});

test('navegação por teclado e acessibilidade do menu', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#about')).toBeAttached();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const toggle = page.getByRole('button', { name: 'Abrir menu' });
  if (await toggle.isVisible()) {
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('button', { name: 'Fechar menu' }),
    ).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Sobre' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  }
});

test('falha de conteúdo permite recuperação sem tela vazia', async ({
  page,
}) => {
  await page.route('**/data/projects.json', (route) =>
    route.fulfill({ status: 503, body: 'Indisponível' }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Não foi possível');
  await page.unroute('**/data/projects.json');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Renato Bonetti',
  );
});

test('novos registros e projetos funcionam apenas com alterações nos JSONs', async ({
  page,
}) => {
  const newProject = {
    ...projectData[0],
    id: 'projeto-teste',
    slug: 'projeto-teste',
    name: 'Projeto de teste',
    order: 0,
  };
  const hiddenProject = {
    ...newProject,
    id: 'projeto-oculto',
    slug: 'projeto-oculto',
    name: 'Projeto oculto',
    visible: false,
  };
  const files = {
    experiences: experienceExamples.map((item) => ({ ...item, visible: true })),
    education: educationExamples.map((item) => ({ ...item, visible: true })),
    certifications: certificationExamples.map((item) => ({
      ...item,
      visible: true,
    })),
    projects: [...projectData, hiddenProject, newProject],
  };
  for (const [name, records] of Object.entries(files)) {
    await page.route(`**/data/${name}.json`, (route) =>
      route.fulfill({ json: records }),
    );
  }
  await page.goto('/');
  for (const id of ['experience', 'education', 'certifications'])
    await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(
    page.getByText('Estudo em andamento', { exact: true }),
  ).toBeAttached();
  await expect(page.locator('.project-card h3').first()).toHaveText(
    'Projeto de teste',
  );
  await expect(
    page.getByRole('heading', { name: 'Projeto oculto' }),
  ).toHaveCount(0);
  await openMenu(page);
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Formação' }),
  ).toBeVisible();
  await page
    .getByRole('navigation')
    .getByRole('link', { name: 'Projetos' })
    .click();
  await page
    .getByRole('link', { name: 'Projeto de teste', exact: true })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Projeto de teste.',
  );
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Projeto de teste.',
  );
  await page.goto('/#/projects/projeto-oculto');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'fora do roteiro',
  );
});
