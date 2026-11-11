import { afterEach, expect, it, vi } from 'vitest';
import { loadPortfolio } from '../services/content';
import { experience, portfolio } from './fixtures';

afterEach(() => vi.unstubAllGlobals());

it('carrega todos os arquivos, valida e publica apenas os registros visíveis em ordem', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      const key = url
        .split('/')
        .at(-1)!
        .replace('.json', '') as keyof typeof portfolio;
      const data =
        key === 'experiences'
          ? [
              { ...experience, id: 'late', order: 3 },
              { ...experience, id: 'hidden', visible: false },
              experience,
            ]
          : portfolio[key];
      return { ok: true, json: async () => data };
    }),
  );
  expect((await loadPortfolio()).experiences.map((item) => item.id)).toEqual([
    'empresa-exemplo',
    'late',
  ]);
});
it('reporta erros HTTP e conteúdo inválido', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: false, status: 404 })),
  );
  await expect(loadPortfolio()).rejects.toThrow('HTTP 404');
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, json: async () => ({}) })),
  );
  await expect(loadPortfolio()).rejects.toThrow('Conteúdo inválido');
});
