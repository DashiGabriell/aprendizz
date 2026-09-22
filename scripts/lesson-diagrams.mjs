/**
 * Diagramas Mermaid por aula — conteúdo complementar (não substitui o texto).
 * Marcador: <!-- aprendizz-mermaid -->
 */
export const DIAGRAM_MARKER = '<!-- aprendizz-mermaid -->'

/** @type {Record<string, string>} */
export const lessonDiagrams = {
  'estrategia-node-ts': `## Mapa visual da estratégia

\`\`\`mermaid
flowchart LR
  base[Base atual: React TS APIs] --> foco[Foco Backend]
  foco --> stack[Node + TypeScript + PostgreSQL]
  stack --> meta[API completa: construir explicar testar publicar]
  meta -.-> skip[Fora agora: K8s microsserviços AWS ampla]
\`\`\`
`,

  'plano-12-semanas': `## Mapa visual das 12 semanas

\`\`\`mermaid
flowchart TB
  subgraph f1 [Fase 1 Web e Backend]
    s1[Semanas 1-2]
  end
  subgraph f2 [Fase 2 APIs e dados]
    s2[Semanas 3-5]
  end
  subgraph f3 [Fase 3 Segurança e qualidade]
    s3[Semanas 6-8]
  end
  subgraph f4 [Fase 4 Mercado]
    s4[Semanas 9-12]
  end
  f1 --> f2 --> f3 --> f4
\`\`\`
`,

  'semana-01': `## Diagrama: caminho de uma requisição HTTP

\`\`\`mermaid
sequenceDiagram
  participant U as Usuario
  participant B as Browser
  participant S as Servidor
  U->>B: Acessa URL / envia form
  B->>S: Request HTTP metodo headers body
  S-->>B: Response status headers body
  B-->>U: Renderiza pagina
\`\`\`
`,

  'semana-02': `## Diagrama: Node no servidor

\`\`\`mermaid
flowchart LR
  client[Cliente HTTP] --> node[Node.js runtime]
  node --> mods[Modulos e imports]
  mods --> async[Async await Promises]
  async --> env[Variaveis de ambiente]
  env --> out[Resposta / efeito]
\`\`\`
`,

  'semana-03': `## Diagrama: camadas de uma API REST

\`\`\`mermaid
flowchart TB
  req[Request] --> route[Rotas]
  route --> ctrl[Controllers]
  ctrl --> svc[Services]
  svc --> res[Response JSON]
  ctrl -.-> err[Erros centralizados]
  err --> res
\`\`\`
`,

  'semana-04': `## Diagrama: modelo academia (exemplo)

\`\`\`mermaid
erDiagram
  ALUNO ||--o{ MATRICULA : possui
  PLANO ||--o{ MATRICULA : cobre
  ALUNO ||--o{ PAGAMENTO : realiza
  PLANO ||--o{ PAGAMENTO : referencia
  ALUNO {
    uuid id PK
    string nome
  }
  PLANO {
    uuid id PK
    string nome
    number preco
  }
  MATRICULA {
    uuid id PK
    uuid aluno_id FK
    uuid plano_id FK
  }
  PAGAMENTO {
    uuid id PK
    uuid aluno_id FK
    number valor
  }
\`\`\`
`,

  'semana-05': `## Diagrama: API conectada ao banco

\`\`\`mermaid
flowchart LR
  api[API Node] --> pool[Pool de conexoes]
  pool --> pg[(PostgreSQL)]
  api --> repo[Repositorios]
  repo --> sql[Queries parametrizadas]
  sql --> pg
  mig[Migrations] --> pg
\`\`\`
`,

  'semana-06': `## Diagrama: autenticação vs autorização

\`\`\`mermaid
flowchart TB
  login[Login] --> authN[Autenticacao: quem e voce]
  authN --> token[Sessao ou JWT]
  token --> mid[Middleware]
  mid --> authZ{Autorizacao: o que pode?}
  authZ -->|admin| adminArea[Area admin]
  authZ -->|membro| selfArea[Area do aluno]
  authZ -->|negado| deny[403]
\`\`\`
`,

  'semana-07': `## Diagrama: pirâmide de testes

\`\`\`mermaid
flowchart TB
  e2e[Poucos: E2E / endpoints]
  integ[Alguns: integracao]
  unit[Muitos: unitarios]
  e2e --> integ --> unit
\`\`\`
`,

  'semana-08': `## Diagrama: fluxo Git profissional

\`\`\`mermaid
gitGraph
  commit id: "main"
  branch feature
  checkout feature
  commit id: "feat"
  commit id: "fix"
  checkout main
  merge feature id: "PR merge"
\`\`\`
`,

  'semana-09': `## Diagrama: containers com Compose

\`\`\`mermaid
flowchart LR
  dc[Docker Compose] --> apiC[Container API]
  dc --> dbC[Container Postgres]
  apiC --> imgA[Imagem Dockerfile]
  dbC --> imgP[Imagem Postgres]
  apiC -.->|rede interna| dbC
\`\`\`
`,

  'semana-10': `## Diagrama: checklist de produção

\`\`\`mermaid
flowchart TB
  build[Build producao] --> env[Env secrets]
  env --> health[Health check]
  health --> logs[Logs]
  logs --> cors[CORS]
  cors --> mig[Migrations]
  mig --> ci[CI/CD basico]
\`\`\`
`,

  'semana-11': `## Diagrama: escopo do portfólio academia

\`\`\`mermaid
flowchart LR
  auth[Auth] --> alunos[Alunos]
  alunos --> planos[Planos]
  planos --> mat[Matriculas]
  mat --> pag[Pagamentos]
  auth --> perfis[Perfis]
  pag --> qualidade[Testes Docker Deploy]
\`\`\`
`,

  'semana-12': `## Diagrama: ciclo entrevista → lacunas → estudo

\`\`\`mermaid
flowchart LR
  cand[Candidatar] --> ent[Entrevista]
  ent --> gaps[Lacunas identificadas]
  gaps --> estudo[Estudar e praticar]
  estudo --> cand
\`\`\`
`,

  'ciclo-diario': `## Diagrama: ciclo 20/20/40/10

\`\`\`mermaid
pie title Distribuicao do ciclo diario
  "Conceito 20min" : 20
  "Exemplos 20min" : 20
  "Exercicio 40min" : 40
  "Revisao 10min" : 10
\`\`\`
`,

  'projeto-aondetem': `## Diagrama: evolução do projeto

\`\`\`mermaid
flowchart LR
  mock[Dados simulados] --> pg[(PostgreSQL)]
  pg --> auth[Auth e autorizacao]
  auth --> tests[Testes]
  tests --> docker[Docker]
  docker --> deploy[Deploy]
\`\`\`

\`\`\`mermaid
flowchart TB
  client[Cliente] --> api[API comercios]
  api --> authR[/auth]
  api --> biz[/businesses]
  api --> rev[/reviews]
\`\`\`
`,

  'aula-01-requisicao': `## Diagrama: fluxo AondeTem (loja)

\`\`\`mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as Frontend
  participant API as Backend
  participant DB as Banco
  U->>FE: Clica na loja
  FE->>API: GET /businesses/:id
  API->>DB: Consulta
  DB-->>API: Dados ou vazio
  alt Existe
    API-->>FE: 200 JSON
    FE-->>U: Mostra ficha
  else Nao existe
    API-->>FE: 404
    FE-->>U: Nao encontrado
  end
\`\`\`
`,
}

/**
 * @param {string} slug
 * @param {string} contentMd
 */
export function withLessonDiagram(slug, contentMd) {
  const block = lessonDiagrams[slug]
  if (!block) return contentMd
  const markerIdx = contentMd.indexOf(DIAGRAM_MARKER)
  const base = (markerIdx >= 0 ? contentMd.slice(0, markerIdx) : contentMd).trimEnd()
  return `${base}\n\n${DIAGRAM_MARKER}\n\n${block.trim()}\n`
}
