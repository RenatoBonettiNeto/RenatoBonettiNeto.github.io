import { useEffect, useState } from 'react';
import { loadPortfolio } from '../services/content';
import type { PortfolioData } from '../types/content';

type ContentState =
  | { status: 'loading' }
  | { status: 'ready'; data: PortfolioData }
  | { status: 'error' };

export function usePortfolio(attempt: number) {
  const [state, setState] = useState<ContentState>({ status: 'loading' });
  useEffect(() => {
    const controller = new AbortController();
    loadPortfolio(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error('Falha ao carregar o portfólio.', error);
          setState({ status: 'error' });
        }
      });
    return () => controller.abort();
  }, [attempt]);
  return state;
}
