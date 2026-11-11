# Decisões arquiteturais

## Aplicação estática

React e TypeScript com Vite, Tailwind CSS e CSS para composição visual. A aplicação não usa backend, autenticação, banco de dados ou analytics. Inter e JetBrains Mono são distribuídas localmente pelo Fontsource, sem requisições a provedores de fontes em execução. Ícones são do Lucide React.

Os componentes recebem dados já validados. `schemas/content.ts` define os esquemas Zod, e as tipagens são inferidas deles. O serviço carrega os seis JSONs em paralelo, valida, filtra `visible: false` e ordena por `order` sem alterar a entrada. Dados opcionais vazios não geram seções ou links.

A carga é atômica: se um arquivo falhar, a página apresenta erro e permite tentar novamente. Isso evita publicar um perfil parcialmente carregado sem indicar a falha. Requests são cancelados quando o componente é desmontado.

## Roteamento no GitHub Pages

O [HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter) mantém a rota no fragmento da URL, que não é enviado ao servidor. Assim, o Pages precisa servir apenas `index.html`. Não há redirecionamento por 404 ou configuração remota de fallback.

| Destino             | URL pública               |
| ------------------- | ------------------------- |
| Home                | `/` ou `/#/`              |
| Projeto             | `/#/projects/qa-recorder` |
| Seção da Home       | `/#/#about`               |
| Página desconhecida | `/#/qualquer-rota`        |

As âncoras simples do escopo, como `/#about`, são normalizadas na entrada para `/#/#about`. Os links gerados já usam o formato canônico do roteador. O primeiro `#` separa o fragmento HTTP; o segundo é a âncora interna interpretada pelo React Router. `ScrollManager` posiciona a seção abaixo do cabeçalho fixo e move o foco para manter a navegação por teclado previsível.

O endereço `/projects/qa-recorder` sem `#` não é uma rota publicada. URLs desconhecidas dentro do roteador mostram a página 404 personalizada; caminhos HTTP desconhecidos continuam sujeitos à página 404 do GitHub Pages.

`base: '/'` no Vite é adequado ao repositório de usuário `RenatoBonettiNeto.github.io`. Para hospedar em um subdiretório, seria necessário revisar base, caminhos dos assets e URLs públicas.

## SEO e compartilhamento

O HTML inicial contém título, descrição, canonical e Open Graph. O script de build atualiza esses valores a partir do perfil, além de gerar sitemap (apenas a URL raiz) e robots. `public/social-card.png` é uma imagem PNG 1200 × 630 para compartilhamento. O browser atualiza o título e a descrição ao abrir um projeto.

Os crawlers de redes sociais normalmente não executam JavaScript nem consideram fragmentos como páginas independentes. Portanto, os detalhes dos projetos compartilham os metadados estáticos da Home; não há promessa de previews individuais ou SEO equivalente a SSR. O sitemap não lista fragmentos. Para SEO independente por projeto no futuro, adotar geração estática de HTML por rota ou SSR em hospedagem compatível.

## Qualidade e entrega

Vitest cobre schemas, datas, ordenação, visibilidade, carregamento e falhas. React Testing Library cobre seções e menu. Playwright verifica o build de produção em Chromium desktop e mobile, rotas, refresh, links, teclado e ausência de erros críticos; traces e screenshots são preservados em falhas. Isso cobre requisitos fundamentais, mas não substitui uma auditoria completa de acessibilidade nem testes em todos os navegadores.

O workflow valida o código e o conteúdo, gera o build e testa esse mesmo artefato com Playwright antes de disponibilizá-lo ao deploy. Somente `main` pode publicar. Pull requests apenas validam. O job de validação tem leitura do repositório; somente o deploy recebe `pages: write` e `id-token: write`. Não há branch `gh-pages`.

O override de `minimatch` para `11.0.8` corrige o advisory GHSA-g3hv-75wg-m249 nas dependências de desenvolvimento do ESLint/TypeScript ESLint. A versão é fixada no lockfile; lint, tipos e testes verificam a compatibilidade. Reavaliar o override quando as dependências atualizarem seus próprios intervalos.
