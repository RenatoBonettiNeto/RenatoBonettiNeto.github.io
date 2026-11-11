import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import './styles/index.css';
import App from './App';

// Accept the brief's plain anchors as well as HashRouter's canonical /#/#section.
if (
  /^#(about|skills|experience|education|certifications|projects|contact)$/.test(
    window.location.hash,
  )
) {
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}#/${window.location.hash}`,
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
