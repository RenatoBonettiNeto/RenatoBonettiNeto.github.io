import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../App';
import { portfolio } from './fixtures';

afterEach(() => {
  vi.unstubAllGlobals();
  window.location.hash = '';
});
it('mostra erro recuperável e permite tentar novamente', async () => {
  let fail = true;
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (fail) return { ok: false, status: 503 };
      const key = url
        .split('/')
        .at(-1)!
        .replace('.json', '') as keyof typeof portfolio;
      return { ok: true, json: async () => portfolio[key] };
    }),
  );
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Não foi possível',
  );
  fail = false;
  await userEvent.click(
    screen.getByRole('button', { name: 'Tentar novamente' }),
  );
  expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(
    portfolio.profile.name,
  );
});
