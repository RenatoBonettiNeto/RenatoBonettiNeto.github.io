# Portfólio profissional · v1.0.0

Portfólio de Renato Bonetti Neto, com foco em Quality Assurance e automação de testes. Interface Minimal Dark Tech, Hero tipográfica, conteúdo em JSON e páginas individuais de projetos. Preparado para `https://renatobonettineto.github.io/`.

Sem backend, banco de dados, login ou formulário de contato. Perfil, experiências, formações, cursos e competências foram preenchidos com base no currículo fornecido. LinkedIn e e-mail estão configurados; o botão de currículo permanece oculto enquanto não houver um arquivo autorizado para acesso público. O QA-Recorder é o projeto inicial, com conteúdo limitado às funcionalidades confirmadas, repositório privado sem link público e uma ilustração conceitual. A origem e os limites da conferência estão registrados em [CONTENT-SOURCES.md](docs/CONTENT-SOURCES.md).

## Stack

React · TypeScript · Vite · Tailwind CSS · React Router · Lucide React · Zod · Vitest · React Testing Library · Playwright · GitHub Actions. Fontes Inter e JetBrains Mono hospedadas junto ao site. Dependências estáveis com versões resolvidas no `package-lock.json`.

## Executar localmente

Requer Node.js 24 ou superior compatível e npm. No PowerShell, use `npm.cmd`/`npx.cmd` se a política de execução impedir os scripts `.ps1`.

```sh
npm ci
npm run dev
```

Acesse a URL local mostrada pelo Vite (normalmente `http://127.0.0.1:5173`). Para verificar a versão de produção:

```sh
npm run build
npm run preview
```

## Comandos de qualidade

| Comando                 | Finalidade                                                          |
| ----------------------- | ------------------------------------------------------------------- |
| `npm run format`        | Formatar código, dados e documentação                               |
| `npm run format:check`  | Verificar formatação                                                |
| `npm run lint`          | Análise estática                                                    |
| `npm run typecheck`     | Verificar tipos                                                     |
| `npm run validate:data` | Validar os seis JSONs e arquivos de assets referenciados            |
| `npm test`              | Testes unitários e de componentes                                   |
| `npm run test:watch`    | Vitest interativo                                                   |
| `npm run build`         | Validar dados, atualizar metadados, verificar tipos e gerar `dist/` |
| `npm run test:e2e`      | Testar o build em desktop e mobile                                  |
| `npm run check`         | Executar todas as verificações, build e E2E                         |

Antes do primeiro E2E, instale o navegador:

```sh
npx playwright install chromium
npm run check
```

No Linux da CI, o workflow instala também as dependências do sistema com `npx playwright install --with-deps chromium`. Para investigar falhas, consulte `test-results/` e, na CI, o artefato `playwright-diagnostics`. Os testes não usam retries automáticos.

## Estrutura

```text
public/
  data/                 # Perfil, experiências, formação, certificados, skills, projetos
  favicon.svg
  social-card.png
  robots.txt
  sitemap.xml
src/
  components/
    common/             # Seções, tags, links e redes sociais
    home/               # Hero e seções profissionais
    layout/             # Cabeçalho, rodapé e navegação de foco/scroll
    projects/           # Ilustração conceitual do projeto
  pages/                # Home, projeto e 404
  hooks/                # Carregamento e metadados
  services/             # Fetch e validação dos dados
  schemas/              # Esquemas Zod
  types/                # Tipagens inferidas
  utils/                # Visibilidade, ordenação, datas e links
  styles/               # Tailwind e identidade visual
  tests/                # Unidades e componentes
e2e/                    # Fluxos Playwright
scripts/                # Validação de conteúdo e geração de metadados
docs/
  CONTENT.md            # Guia de cadastro
  ARCHITECTURE.md        # Decisões e limitações
  examples/             # Modelos JSON não publicados
.github/workflows/      # Validação e deploy
```

## Preencher o conteúdo

Consulte o [guia de conteúdo](docs/CONTENT.md) para todos os campos e os [modelos JSON](docs/examples/). Eles são ilustrativos, ficam fora de `public/` e não aparecem no site.

| Informação                             | Arquivo a editar                  | Modelo / orientação                                                    |
| -------------------------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| Perfil, foto, redes, e-mail, currículo | `public/data/profile.json`        | [Configuração de perfil](docs/CONTENT.md#perfil-e-links-profissionais) |
| Experiências                           | `public/data/experiences.json`    | [Modelo](docs/examples/experiences.json)                               |
| Formação                               | `public/data/education.json`      | [Modelo](docs/examples/education.json)                                 |
| Certificações e estudos                | `public/data/certifications.json` | [Modelo](docs/examples/certifications.json)                            |
| Competências                           | `public/data/skills.json`         | Categorias com `name` e lista `items`                                  |
| Projetos                               | `public/data/projects.json`       | [Modelo](docs/examples/projects.json)                                  |

Registros usam `id`, `visible` e `order`. Datas desconhecidas permanecem nulas; datas conhecidas usam `AAAA-MM`. Listas sem registros visíveis não geram seções ou links no menu. Para publicar um modelo, substitua seu conteúdo e altere `visible` para `true`. Tudo dentro de `public/` é acessível publicamente, inclusive os JSONs com registros ocultos.

## Navegação

- Home: `/`
- Seção: `/#/#about` (o atalho `/#about` também é aceito na entrada)
- Projeto: `/#/projects/qa-recorder`
- 404 da aplicação: qualquer rota hash desconhecida

O [HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter) permite atualizar diretamente uma página de projeto no Pages sem fallback de SPA. Rotas sem `#`, como `/projects/qa-recorder`, não são URLs publicadas. Leia as [decisões arquiteturais](docs/ARCHITECTURE.md) para a estratégia de âncoras e as limitações de SEO e previews sociais. Os títulos dos projetos mudam no navegador; o compartilhamento usa os metadados estáticos da Home.

## Publicar no GitHub Pages

O workflow está preparado, mas criar os arquivos localmente não publica o site. Não é necessário criar `gh-pages` nem alterar o remoto.

1. Revise os dados que deseja tornar públicos e execute `npm run check`.
2. Versione os arquivos na branch `main` e envie ao repositório `RenatoBonettiNeto/RenatoBonettiNeto.github.io`.
3. No GitHub, em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**, conforme a [documentação do GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
4. Acompanhe **Actions → Qualidade e GitHub Pages**. O deploy depende de todas as verificações e só é executado na `main`; PRs apenas validam. Se configurar a origem depois do primeiro push, execute o workflow manualmente pela `main`.
5. Confirme a conclusão do deploy e o endereço `https://renatobonettineto.github.io/`.

Se aparecer também o workflow automático **pages build and deployment** com **Build with Jekyll**, confira a origem do Pages: ela precisa estar em **GitHub Actions**. A opção **Deploy from a branch** publica os fontes deste projeto sem o build Vite e pode indicar sucesso mesmo quando o workflow de qualidade falha. No site publicado, o HTML deve carregar JavaScript compilado em `/assets/`, e `/data/profile.json` deve responder com JSON; referências a `/src/main.tsx` indicam publicação incorreta. Após ajustar a origem, execute novamente **Qualidade e GitHub Pages** na `main`.

O Vite usa `base: '/'`, apropriado ao repositório de usuário. O job de deploy tem somente as permissões de Pages/OIDC necessárias; nenhum token pessoal é exigido. O build é gerado antes do E2E para que os testes aprovem exatamente os arquivos publicados. O conteúdo profissional pode ser atualizado por JSON, sempre seguido de novo build/deploy.
