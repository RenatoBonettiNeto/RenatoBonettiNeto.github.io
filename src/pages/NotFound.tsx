import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMetadata } from '../hooks/useMetadata';

export function NotFound() {
  useMetadata(
    'Página não encontrada | Portfólio',
    'Esta página não foi encontrada. Volte ao portfólio.',
  );
  return (
    <section className="container status-page">
      <span className="eyebrow">ERRO / 404</span>
      <h1>
        Um caminho
        <br />
        fora do roteiro<span className="accent">.</span>
      </h1>
      <p>
        A página que você procura não está disponível. Vamos voltar ao início?
      </p>
      <Link to="/" className="button button-primary">
        <ArrowLeft size={17} /> Voltar ao portfólio
      </Link>
    </section>
  );
}
