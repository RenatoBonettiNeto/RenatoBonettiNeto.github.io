import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { usePortfolio } from './hooks/usePortfolio';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollManager } from './components/layout/ScrollManager';
import { Home } from './pages/Home';
import { Project } from './pages/Project';
import { NotFound } from './pages/NotFound';

export default function App() {
  const [attempt, setAttempt] = useState(0);
  const state = usePortfolio(attempt);
  if (state.status === 'loading')
    return (
      <main className="loading-screen" role="status">
        <span className="loading-mark" aria-hidden="true">
          /
        </span>
        <p>Carregando portfólio…</p>
      </main>
    );
  if (state.status === 'error')
    return (
      <main className="container status-page" role="alert">
        <p className="eyebrow">Conexão / Conteúdo</p>
        <h1>
          Não foi possível
          <br />
          carregar o portfólio.
        </h1>
        <p>Verifique sua conexão e tente novamente.</p>
        <button
          className="button button-primary"
          onClick={() => {
            setAttempt(attempt + 1);
          }}
        >
          Tentar novamente
        </button>
      </main>
    );
  return (
    <HashRouter>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <Header data={state.data} />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home data={state.data} />} />
          <Route
            path="/projects/:slug"
            element={<Project data={state.data} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer profile={state.data.profile} />
      <ScrollManager />
    </HashRouter>
  );
}
