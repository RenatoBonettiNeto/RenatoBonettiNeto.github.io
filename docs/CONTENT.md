# Guia de conteúdo

Edite os arquivos em `public/data/`. Nenhuma alteração em componentes é necessária para adicionar registros ou projetos. Os arquivos em [examples](./examples/) são modelos ilustrativos, **não são dados profissionais de Renato** e não são carregados pelo site. Todos começam com `visible: false`.

## Regras comuns

- As listas usam `[]` quando não há registros.
- Cada registro tem um `id` estável em `kebab-case`, sem acentos, espaços ou duplicatas.
- `visible: false` oculta o registro; `visible: true` publica. A validação também verifica os registros ocultos.
- `order` é um inteiro não negativo: valores menores aparecem primeiro. Empates mantêm a ordem do JSON. Não há ordenação implícita por data.
- Datas têm precisão mensal, no formato `AAAA-MM`, como `2025-03`. Dados desconhecidos ficam `null` ou são omitidos quando opcionais; nunca estime datas.
- Campos de texto não aceitam strings vazias. Para campos opcionais, use `null` ou omita o campo.
- URLs externas precisam de `https://`. Não há suporte a HTML nos textos: eles são renderizados como texto simples.
- Após editar, execute `npm run validate:data`, `npm run format` e `npm run check`.
- Arquivos em `public/` são públicos, inclusive registros invisíveis. **Não armazene informações confidenciais nem mesmo com `visible: false`.**

## Perfil e links profissionais

Em `profile.json`, edite `name`, `brand`, `role`, `intro`, os parágrafos de `about`, `contactHeadline` e `contactText`. Use apenas experiências e competências confirmadas.

`location` é opcional e apresenta a cidade/UF no resumo. `languages` é uma lista opcional de idiomas com seus níveis declarados, como `["Inglês — básico"]`. Esses campos ficam ocultos quando vazios.

Configure `githubUrl` e `linkedinUrl` com os endereços completos. Para e-mail, informe apenas o endereço em `email`, sem `mailto:`. Os links não configurados (`null` ou ausentes) não são exibidos. Os contatos atuais foram configurados com os endereços fornecidos pelo titular.

Para disponibilizar o currículo:

1. Coloque um PDF público, sem informações sensíveis, em `public/assets/curriculo.pdf`.
2. Defina `"resumeUrl": "/assets/curriculo.pdf"` em `profile.json`. Uma URL HTTPS também é aceita.
3. O botão aparecerá automaticamente na Hero e abrirá o documento em outra aba.

`siteUrl` é a URL completa da hospedagem, inicialmente `https://renatobonettineto.github.io/`. O build atualiza os metadados HTML, sitemap e robots a partir desse campo. A imagem social está em `public/social-card.png`; substitua-a também se alterar a identidade profissional.

### Foto na seção Sobre mim

O campo opcional `photo` configura o retrato ao lado do texto no desktop e acima do texto no celular:

```json
"photo": {
  "src": "/assets/renato-bonetti.jpg",
  "alt": "Renato Bonetti Neto em sua formatura",
  "zoom": 1.75,
  "originY": 10
}
```

Salve a imagem em `public/assets/` e use um caminho local absoluto. Prefira um retrato vertical na proporção 4:5, enquadrando rosto e parte do tronco. Informe um texto alternativo descritivo. A validação confere se o arquivo existe. Para remover a foto sem alterar componentes, defina `"photo": null` ou omita o campo; o layout se adapta automaticamente. A foto usa carregamento adiado e espaço reservado para evitar deslocamentos do texto durante a carga.

O enquadramento é aplicado pelo CSS, sem modificar o arquivo: `zoom` vai de 1 a 3 (padrão 1) e `originY` vai de 0 a 100 (padrão 0), definindo a origem vertical do zoom. A foto atual usa um arquivo redimensionado da fotografia original, sem alterações no rosto ou no fundo. O original completo fica em `assets/originals/`, fora de `public/` e ignorado pelo Git.

## Experiências

Copie o objeto de [experiences.json](./examples/experiences.json) para a lista em `public/data/experiences.json`. Substitua empresa, cargo, descrição e tecnologias; preencha as datas conhecidas. Só então altere `visible` para `true`.

Para um vínculo atual, use `current: true` e `endDate: null`. Para um vínculo encerrado, use `current: false` e informe o término somente se confirmado. Quando não há datas, nenhum período fictício aparece. O indicador de vínculo atual independe da data de início.

Quando as atividades de um cargo não forem informadas pela fonte, `description` pode ser `null` ou omitida; nenhum texto substituto é criado.

## Formação

Use [education.json](./examples/education.json) como modelo de `public/data/education.json`. Preencha `course`, `institution`, `startDate`, `endDate` e `status`:

| Valor         | Apresentação |
| ------------- | ------------ |
| `completed`   | Concluído    |
| `in-progress` | Em andamento |
| `paused`      | Interrompido |

`description` é opcional. A seção e o link de navegação só aparecem se houver pelo menos um registro visível.

## Cursos, certificações e estudos

Use [certifications.json](./examples/certifications.json). `status: "completed"` indica uma certificação concluída. `status: "in-progress"` aparece explicitamente como **Estudo em andamento**.

Use `kind: "course"` para um curso complementar e `kind: "certification"` para uma certificação. Na ausência de `kind`, o comportamento existente de certificação é preservado. Cursos concluídos aparecem como **Curso concluído**, com `completionDate` para a data de conclusão, sem se tornarem certificações profissionais. O rótulo do menu e da seção acompanha os tipos publicados: **Cursos**, **Certificações** ou **Cursos e certificações**.

Para uma certificação concluída, `issueDate`, `expiryDate`, `credentialId` e `verificationUrl` são opcionais. Use somente credenciais verificadas e links públicos autorizados. O esquema impede credenciais de conclusão e datas de conclusão/emissão/validade em estudos em andamento.

## Competências

Em `skills.json`, cada categoria tem `id`, `name`, `description` opcional e uma lista `items` com pelo menos um item. Categorias adicionais aparecem automaticamente. Não são usados percentuais de domínio ou níveis artificiais.

## Projetos

Use [projects.json](./examples/projects.json). Adicione um objeto à lista em `public/data/projects.json`:

- `id` e `slug` são estáveis e únicos. O slug define a URL `/#/projects/seu-slug`.
- `name`, `category`, `summary`, `description` e `technologies` são obrigatórios.
- `problem` e `solution` são textos opcionais.
- `features` usa objetos com `title` e `description`.
- `architecture`, `challenges`, `testing` e `results` são listas de parágrafos. Listas vazias não geram seções.
- `repositoryUrl` só deve apontar para repositórios públicos e autorizados. `null` oculta o link.
- `links` é uma lista de `{ "label": "Documentação", "url": "https://example.com" }`.
- `image` é opcional. Sem imagem, o card usa uma ilustração conceitual ou um placeholder gráfico.
- `gallery` é opcional. Cada imagem tem `src` e `alt` obrigatório e descritivo.

Para inserir imagens, salve-as em `public/assets/` e use, por exemplo, `"image": { "src": "/assets/meu-projeto.webp", "alt": "Descrição objetiva da imagem" }`. O caminho deve ser local e absoluto; a validação confere se o arquivo existe. Prefira imagens otimizadas, sem dados pessoais ou sistemas corporativos.

A ilustração do QA-Recorder é identificada como **visão conceitual**, não é uma captura do aplicativo. Desafios, estratégia de testes e resultados inicialmente vazios podem ser preenchidos após confirmação. Não cadastre métricas estimadas como resultados observados.

## Erros e publicação

`npm run validate:data` indica o arquivo e o campo inválido. O build e a CI não avançam com erros. Em execução, falhas HTTP, JSON malformado ou conteúdo inválido mostram uma mensagem recuperável com o botão **Tentar novamente**. Os detalhes ficam no console para diagnóstico.

As mudanças ficam visíveis em produção depois de um novo deploy aprovado pela CI. Não existe painel administrativo nem persistência de edições no navegador.
