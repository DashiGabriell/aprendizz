/**
 * Seeds all 17 Aprendizz lessons + exercises into the shared Supabase project.
 * Usage: node --env-file=.env scripts/seed-aprendizz.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or service role key in env')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function mcq(questions) {
  return questions
}

function tests(list) {
  return list
}

const curriculum = [
  {
    slug: 'estrategia-node-ts',
    sort_order: 1,
    title: 'Nossa estratégia: Node.js + TypeScript',
    phase: 'Fundação',
    unlocked_by_default: true,
    objectives: [
      'Entender por que Node.js + TypeScript + PostgreSQL é a stack deste plano',
      'Listar o que será estudado e o que fica de fora no início',
    ],
    content_md: `## Objetivo

Transformar o conhecimento que você já tem (React, TypeScript, Supabase, APIs) em base sólida de Backend júnior empregável.

## Stack escolhida

| Tecnologia | O que você vai aprender |
|---|---|
| JavaScript | Fundamentos no servidor |
| TypeScript | Tipagem, interfaces, organização |
| Node.js | Runtime no Backend |
| HTTP | Comunicação cliente/servidor |
| Express | APIs REST |
| PostgreSQL | Modelagem e SQL de verdade |
| Git/GitHub | Fluxo profissional |
| Vitest/Jest | Testes |
| Docker | Ambiente reproduzível |
| Deploy | Publicar e manter APIs |

## Fora do escopo agora

Não começamos com microsserviços, Kubernetes ou “toda a AWS”. O primeiro objetivo é **construir, explicar, testar e publicar uma API completa**.`,
    free_text_prompt:
      'Com suas palavras: por que Node.js + TypeScript faz sentido para o seu contexto atual? O que você NÃO vai estudar nesta fase e por quê?',
    code_prompt:
      'Implemente `pickStackReasons(experience: string[]): string[]` que retorna apenas os itens da lista que contenham "typescript" ou "node" (case-insensitive).',
    starter_code: `export function pickStackReasons(experience: string[]): string[] {
  // TODO
  return []
}
`,
    mcq: mcq([
      {
        id: 'q1',
        prompt: 'Qual é o primeiro objetivo deste plano?',
        options: [
          { id: 'a', label: 'Dominar Kubernetes antes de qualquer API' },
          { id: 'b', label: 'Construir, explicar, testar e publicar uma API completa' },
          { id: 'c', label: 'Trocar de linguagem a cada semana' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        prompt: 'O que fica de fora no início?',
        options: [
          { id: 'a', label: 'SQL e HTTP' },
          { id: 'b', label: 'Microsserviços e Kubernetes' },
          { id: 'c', label: 'TypeScript' },
        ],
        correctOptionId: 'b',
      },
    ]),
    tests: tests([
      {
        name: 'filtra typescript/node',
        assert:
          "JSON.stringify(pickStackReasons(['React', 'TypeScript', 'Figma', 'Node APIs'])) === JSON.stringify(['TypeScript', 'Node APIs'])",
      },
    ]),
  },
  {
    slug: 'plano-12-semanas',
    sort_order: 2,
    title: 'Visão do plano de 12 semanas',
    phase: 'Fundação',
    unlocked_by_default: false,
    objectives: [
      'Entender a cadência (seg–sex, ~1h30–2h/dia)',
      'Mapear as 4 fases do roadmap',
    ],
    content_md: `## Cadência

Estude de segunda a sexta, cerca de **1h30 a 2h por dia** (~90–120h em 12 semanas). É plano intensivo de base — não promessa de contratação em 90 dias.

## Quatro fases

1. **Entender a Web e o Backend** (semanas 1–2)
2. **APIs e bancos** (semanas 3–5)
3. **Segurança e qualidade** (semanas 6–8)
4. **Mercado** (semanas 9–12: Docker, deploy, portfólio, entrevistas)

Progresso depende do que você já domina e da prática real.`,
    free_text_prompt:
      'Escreva como você vai encaixar 1h30–2h/dia na sua rotina nas próximas duas semanas. Seja concreto (horários).',
    code_prompt:
      'Implemente `estimateHours(weeks: number, hoursPerDay: number, daysPerWeek: number): number` retornando o total de horas.',
    starter_code: `export function estimateHours(weeks: number, hoursPerDay: number, daysPerWeek: number): number {
  return 0
}
`,
    mcq: mcq([
      {
        id: 'q1',
        prompt: 'Quantas fases o plano tem?',
        options: [
          { id: 'a', label: '2' },
          { id: 'b', label: '4' },
          { id: 'c', label: '12' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        prompt: 'Docker entra em qual fase?',
        options: [
          { id: 'a', label: 'Fase 1' },
          { id: 'b', label: 'Fase 4 (preparação para o mercado)' },
          { id: 'c', label: 'Não entra no plano' },
        ],
        correctOptionId: 'b',
      },
    ]),
    tests: tests([
      { name: '12 semanas * 2h * 5 dias', assert: 'estimateHours(12, 2, 5) === 120' },
      { name: '12 * 1.5 * 5', assert: 'estimateHours(12, 1.5, 5) === 90' },
    ]),
  },
]

// Weeks 1-12 + cycle + project + aula 01 appended below via push for readability in generator
const weeks = [
  {
    n: 1,
    title: 'Semana 1: Como a Web funciona',
    phase: 'Fase 1 — Web e Backend',
    objectives: ['Explicar o caminho de uma requisição HTTP', 'Identificar métodos, headers, status e JSON'],
    topics: [
      'Cliente e servidor',
      'HTTP e HTTPS',
      'Requisições e respostas',
      'Métodos: GET, POST, PUT, PATCH, DELETE',
      'Headers, body e query parameters',
      'Status: 200, 201, 400, 401, 403, 404, 500',
      'JSON entre aplicações',
    ],
    practice:
      'Use o navegador e Postman/Insomnia para inspecionar uma API pública: métodos, headers, parâmetros e respostas.',
    free_text:
      'Explique o caminho de uma requisição do navegador até o servidor e de volta, usando um exemplo do AondeTem.',
    code_prompt:
      'Implemente `isSuccessStatus(code: number): boolean` (2xx) e `describeStatus(code: number): string` mapeando 200→"ok", 201→"created", 400→"bad_request", 401→"unauthorized", 403→"forbidden", 404→"not_found", 500→"server_error", outros→"unknown".',
    starter: `export function isSuccessStatus(code: number): boolean {
  return false
}
export function describeStatus(code: number): string {
  return 'unknown'
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Qual status indica recurso não encontrado?',
        options: [
          { id: 'a', label: '401' },
          { id: 'b', label: '404' },
          { id: 'c', label: '500' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        prompt: 'Query parameters ficam onde?',
        options: [
          { id: 'a', label: 'Na URL após ?' },
          { id: 'b', label: 'Somente no body' },
          { id: 'c', label: 'No certificado TLS' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      { name: '200 success', assert: 'isSuccessStatus(200) === true' },
      { name: '404 not success', assert: 'isSuccessStatus(404) === false' },
      { name: 'describe 401', assert: 'describeStatus(401) === "unauthorized"' },
      { name: 'describe 404', assert: 'describeStatus(404) === "not_found"' },
    ],
  },
  {
    n: 2,
    title: 'Semana 2: Node.js e TypeScript no Backend',
    phase: 'Fase 1 — Web e Backend',
    objectives: ['Usar TypeScript no servidor', 'Dominar módulos, async/await e env'],
    topics: [
      'O que é Node.js',
      'Diferenças Frontend vs Backend',
      'Módulos e imports',
      'NPM',
      'Async/await e Promises',
      'Tratamento de erros',
      'Variáveis de ambiente',
      'Organização de arquivos',
    ],
    practice:
      'Construa um programa Node que recebe dados, processa e retorna resultados; depois transforme em servidor HTTP simples.',
    free_text: 'Liste diferenças práticas entre TypeScript no frontend e no backend que você já sentiu ou espera sentir.',
    code_prompt: 'Implemente `async function fetchUserName(id: number): Promise<string>` que rejeita se id <= 0 e resolve para `user-${id}` após simular delay com Promise.',
    starter: `export async function fetchUserName(id: number): Promise<string> {
  return ''
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Node.js é principalmente:',
        options: [
          { id: 'a', label: 'Um banco de dados' },
          { id: 'b', label: 'Um runtime JavaScript no servidor' },
          { id: 'c', label: 'Um framework CSS' },
        ],
        correctOptionId: 'b',
      },
    ],
    tests: [
      {
        name: 'resolve positivo',
        assert: '(await fetchUserName(3)) === "user-3"',
      },
      {
        name: 'rejeita id inválido',
        assert:
          '(await fetchUserName(0).then(() => false).catch(() => true)) === true',
      },
    ],
  },
  {
    n: 3,
    title: 'Semana 3: Construção de APIs REST',
    phase: 'Fase 2 — APIs e dados',
    objectives: ['Modelar rotas e controllers', 'Validar input e centralizar erros'],
    topics: [
      'API REST',
      'Rotas e controllers',
      'Params e query',
      'Request/Response',
      'Validação',
      'Erros centralizados',
      'Separação de responsabilidades',
    ],
    practice: 'Crie uma API de tarefas com cadastro, consulta, atualização e exclusão.',
    free_text: 'Descreva a responsabilidade de rotas vs controllers vs services numa API de tarefas.',
    code_prompt:
      'Implemente um store em memória: `createTask(title)`, `listTasks()`, `updateTask(id, title)`, `deleteTask(id)`. IDs incrementais a partir de 1.',
    starter: `type Task = { id: number; title: string }
const tasks: Task[] = []
let seq = 1

export function createTask(title: string) {
  return { id: 0, title }
}
export function listTasks() { return tasks }
export function updateTask(id: number, title: string) { return null as Task | null }
export function deleteTask(id: number) { return false }
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'GET /tasks/:id tipicamente:',
        options: [
          { id: 'a', label: 'Cria uma task' },
          { id: 'b', label: 'Lê uma task' },
          { id: 'c', label: 'Apaga o banco' },
        ],
        correctOptionId: 'b',
      },
    ],
    tests: [
      {
        name: 'crud básico',
        assert: (() => {
          return `(function(){
            const t = createTask('a');
            if (!t || t.id < 1) return false;
            if (!listTasks().some(x => x.id === t.id)) return false;
            const u = updateTask(t.id, 'b');
            if (!u || u.title !== 'b') return false;
            return deleteTask(t.id) === true;
          })()`
        })(),
      },
    ],
  },
  {
    n: 4,
    title: 'Semana 4: PostgreSQL e SQL de verdade',
    phase: 'Fase 2 — APIs e dados',
    objectives: ['Modelar relacionamentos', 'Escrever SQL sem depender só de ORM'],
    topics: [
      'Tabelas, linhas, colunas',
      'PK/FK',
      '1:1, 1:N, N:N',
      'SELECT/INSERT/UPDATE/DELETE',
      'JOINs',
      'GROUP BY',
      'Índices',
      'Constraints',
      'Transações',
    ],
    practice: 'Modele academia: alunos, planos, pagamentos e matrículas — e explique o porquê.',
    free_text: 'Descreva o modelo da academia (entidades e relacionamentos) e justifique as chaves estrangeiras.',
    code_prompt:
      'Dado arrays de alunos e matrículas, implemente `countEnrollmentsByPlan(enrollments)` retornando Record<planId, number>.',
    starter: `export function countEnrollmentsByPlan(enrollments: Array<{ planId: string }>): Record<string, number> {
  return {}
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'JOIN serve para:',
        options: [
          { id: 'a', label: 'Combinar linhas de tabelas relacionadas' },
          { id: 'b', label: 'Criptografar senhas' },
          { id: 'c', label: 'Fazer deploy' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      {
        name: 'agrupa planos',
        assert:
          "JSON.stringify(countEnrollmentsByPlan([{planId:'a'},{planId:'a'},{planId:'b'}])) === JSON.stringify({a:2,b:1})",
      },
    ],
  },
  {
    n: 5,
    title: 'Semana 5: Integração API + Banco',
    phase: 'Fase 2 — APIs e dados',
    objectives: ['Conectar Node ao Postgres com segurança', 'Usar repositórios e migrations'],
    topics: [
      'Conexão e pool',
      'Queries parametrizadas',
      'SQL Injection',
      'Repositórios',
      'Paginação, filtros, ordenação',
      'Migrations',
    ],
    practice: 'Conecte a API ao PostgreSQL com persistência real.',
    free_text: 'Explique por que queries parametrizadas mitigam SQL Injection. Dê um exemplo ruim vs bom (conceitual).',
    code_prompt:
      'Implemente `buildPage(items: T[], page: number, pageSize: number)` retornando `{ data, total, page, pageSize }` (page começa em 1).',
    starter: `export function buildPage<T>(items: T[], page: number, pageSize: number) {
  return { data: [] as T[], total: 0, page, pageSize }
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'SQL Injection é mitigado principalmente por:',
        options: [
          { id: 'a', label: 'Concatenar strings com input do usuário' },
          { id: 'b', label: 'Queries parametrizadas / binds' },
          { id: 'c', label: 'Usar mais JOINs' },
        ],
        correctOptionId: 'b',
      },
    ],
    tests: [
      {
        name: 'página 2',
        assert:
          "JSON.stringify(buildPage([1,2,3,4,5], 2, 2).data) === JSON.stringify([3,4]) && buildPage([1,2,3,4,5], 2, 2).total === 5",
      },
    ],
  },
  {
    n: 6,
    title: 'Semana 6: Autenticação e autorização',
    phase: 'Fase 3 — Segurança e qualidade',
    objectives: ['Separar authN de authZ', 'Proteger rotas com middleware e perfis'],
    topics: [
      'Hash de senhas',
      'Login/cadastro',
      'Sessões e tokens / JWT',
      'Autenticação vs autorização',
      'Middleware',
      'Controle por perfil',
      'Proteção de rotas',
    ],
    practice: 'Implemente cadastro/login e área admin só para autorizados.',
    free_text: 'Explique a diferença entre autenticação e autorização com um exemplo de academia (aluno vs admin).',
    code_prompt:
      'Implemente `canAccess(role: string, resource: string): boolean` onde admin acessa tudo; member só "self".',
    starter: `export function canAccess(role: string, resource: string): boolean {
  return false
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Autenticação responde:',
        options: [
          { id: 'a', label: 'Quem você é' },
          { id: 'b', label: 'O que você pode fazer' },
          { id: 'c', label: 'Qual banco usar' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      { name: 'admin total', assert: 'canAccess("admin", "billing") === true' },
      { name: 'member self', assert: 'canAccess("member", "self") === true' },
      { name: 'member bloqueado', assert: 'canAccess("member", "billing") === false' },
    ],
  },
  {
    n: 7,
    title: 'Semana 7: Testes automatizados',
    phase: 'Fase 3 — Segurança e qualidade',
    objectives: ['Escrever testes unitários e de integração', 'Cobrir erros'],
    topics: [
      'Por que testar',
      'Unitários',
      'Integração',
      'Endpoints',
      'Mocks/stubs',
      'Cobertura',
      'Cenários de erro',
    ],
    practice: 'Teste cadastro, autenticação e operações de banco.',
    free_text: 'Quando você usaria mock e quando preferiria teste de integração real? Justifique.',
    code_prompt: 'Implemente `sumPositive(nums: number[]): number` somando só > 0. Escreva a função para passar nos asserts.',
    starter: `export function sumPositive(nums: number[]): number {
  return 0
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Teste de endpoint valida principalmente:',
        options: [
          { id: 'a', label: 'A camada HTTP da API' },
          { id: 'b', label: 'CSS do frontend' },
          { id: 'c', label: 'DNS' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      { name: 'soma positivos', assert: 'sumPositive([1,-2,3]) === 4' },
      { name: 'vazio', assert: 'sumPositive([]) === 0' },
    ],
  },
  {
    n: 8,
    title: 'Semana 8: Git e fluxo profissional',
    phase: 'Fase 3 — Segurança e qualidade',
    objectives: ['Usar branches, PRs e commits claros', 'Simular code review solo'],
    topics: [
      'Branches',
      'Commits bem escritos',
      'Pull Requests',
      'Merge e conflitos',
      'Code Review',
      'Issues',
      'README técnico',
    ],
    practice: 'Feature em branch, commits organizados e PR no GitHub (mesmo solo).',
    free_text: 'Escreva um exemplo de mensagem de commit boa e uma ruim para a mesma mudança. Explique a diferença.',
    code_prompt:
      'Implemente `parseConventionalCommit(msg: string)` retornando `{ type, scope, breaking }` onde type é antes de ":" / "("; scope entre (); breaking se houver ! ou BREAKING.',
    starter: `export function parseConventionalCommit(msg: string): { type: string; scope: string | null; breaking: boolean } {
  return { type: '', scope: null, breaking: false }
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Pull Request serve para:',
        options: [
          { id: 'a', label: 'Revisar e integrar mudanças com histórico' },
          { id: 'b', label: 'Apagar o repositório remoto' },
          { id: 'c', label: 'Substituir testes' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      {
        name: 'feat com scope',
        assert:
          'parseConventionalCommit("feat(api): add login").type === "feat" && parseConventionalCommit("feat(api): add login").scope === "api"',
      },
      {
        name: 'breaking',
        assert: 'parseConventionalCommit("feat!: drop field").breaking === true',
      },
    ],
  },
  {
    n: 9,
    title: 'Semana 9: Docker',
    phase: 'Fase 4 — Mercado',
    objectives: ['Containerizar API + Postgres', 'Usar Compose e env'],
    topics: [
      'Containerização',
      'Imagens e containers',
      'Dockerfile',
      'Docker Compose',
      'Env vars',
      'API + Postgres em containers',
    ],
    practice: 'Suba API e banco em ambiente Docker funcional.',
    free_text: 'Explique a diferença entre imagem e container e por que Compose ajuda no dia a dia.',
    code_prompt:
      'Implemente `parseEnvLine(line: string): [string, string] | null` para linhas KEY=VALUE (ignore vazios e #comentários).',
    starter: `export function parseEnvLine(line: string): [string, string] | null {
  return null
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Dockerfile define principalmente:',
        options: [
          { id: 'a', label: 'Como construir a imagem' },
          { id: 'b', label: 'Preço da VPS' },
          { id: 'c', label: 'Schema SQL automático' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      {
        name: 'parse ok',
        assert: 'JSON.stringify(parseEnvLine("PORT=3000")) === JSON.stringify(["PORT","3000"])',
      },
      { name: 'ignora comentário', assert: 'parseEnvLine("# hi") === null' },
    ],
  },
  {
    n: 10,
    title: 'Semana 10: Deploy e produção',
    phase: 'Fase 4 — Mercado',
    objectives: ['Publicar API com env, logs, CORS e healthcheck', 'Entender CI/CD básico'],
    topics: [
      'Build/execução produção',
      'Env',
      'Logs',
      'CORS',
      'Health checks',
      'Migrations em produção',
      'CI/CD básico',
    ],
    practice: 'Publique a API, conecte DB hospedado e documente o uso.',
    free_text: 'Monte um checklist de go-live mínimo para sua API (pelo menos 6 itens).',
    code_prompt:
      'Implemente `healthPayload(ok: boolean, version: string)` retornando `{ status: "ok"|"degraded", version }`.',
    starter: `export function healthPayload(ok: boolean, version: string) {
  return { status: 'degraded', version }
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Health check serve para:',
        options: [
          { id: 'a', label: 'Verificar se o serviço está saudável' },
          { id: 'b', label: 'Criptografar JWT' },
          { id: 'c', label: 'Criar indexes' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      {
        name: 'ok',
        assert: 'healthPayload(true, "1.0.0").status === "ok" && healthPayload(true, "1.0.0").version === "1.0.0"',
      },
      { name: 'degraded', assert: 'healthPayload(false, "1.0.0").status === "degraded"' },
    ],
  },
  {
    n: 11,
    title: 'Semana 11: Projeto de portfólio',
    phase: 'Fase 4 — Mercado',
    objectives: ['Fechar API de academia com qualidade técnica', 'Demonstrar auth, SQL, testes, Docker, deploy'],
    topics: [
      'Cadastro/auth',
      'Alunos, planos, matrículas, pagamentos',
      'Perfis',
      'PostgreSQL',
      'Testes',
      'Docker',
      'Deploy',
    ],
    practice: 'API de gestão de academia completa — qualidade > quantidade de features.',
    free_text: 'Liste o escopo MVP da academia e o que você cortaria se o tempo apertar. Justifique.',
    code_prompt:
      'Implemente `invoiceTotal(items: Array<{ amount: number; paid: boolean }>): { due: number; paid: number }`.',
    starter: `export function invoiceTotal(items: Array<{ amount: number; paid: boolean }>) {
  return { due: 0, paid: 0 }
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'O diferencial do portfólio neste plano é:',
        options: [
          { id: 'a', label: 'Qualidade técnica' },
          { id: 'b', label: 'Máximo de telas coloridas' },
          { id: 'c', label: 'Evitar README' },
        ],
        correctOptionId: 'a',
      },
    ],
    tests: [
      {
        name: 'totais',
        assert:
          'JSON.stringify(invoiceTotal([{amount:10,paid:true},{amount:5,paid:false}])) === JSON.stringify({due:5,paid:10})',
      },
    ],
  },
  {
    n: 12,
    title: 'Semana 12: Entrevistas e resolução de problemas',
    phase: 'Fase 4 — Mercado',
    objectives: ['Praticar debug, leitura de código alheio e perguntas de júnior', 'Começar a se candidatar'],
    topics: [
      'Leitura de código de terceiros',
      'Debugging',
      'Refatoração',
      'Problemas com arrays/objetos/strings/mapas',
      'Perguntas comuns de Backend Júnior',
      'Explicar decisões',
      'Mock interviews',
    ],
    practice: 'Candidates a vagas compatíveis mesmo com lacunas. Entrevistas revelam o que estudar.',
    free_text: 'Quais lacunas técnicas você já enxerga para entrevistas? Como vai atacá-las na próxima quinzena?',
    code_prompt:
      'Implemente `groupBy<T>(items: T[], keyFn: (i: T) => string): Record<string, T[]>`.',
    starter: `export function groupBy<T>(items: T[], keyFn: (i: T) => string): Record<string, T[]> {
  return {}
}
`,
    mcq: [
      {
        id: 'q1',
        prompt: 'Segundo o plano, você deve:',
        options: [
          { id: 'a', label: 'Esperar 100% pronto para se candidatar' },
          { id: 'b', label: 'Começar a se candidatar antes de se sentir 100% pronto' },
          { id: 'c', label: 'Evitar entrevistas' },
        ],
        correctOptionId: 'b',
      },
    ],
    tests: [
      {
        name: 'groupBy',
        assert:
          'JSON.stringify(groupBy([{t:"a"},{t:"b"},{t:"a"}], x => x.t)) === JSON.stringify({a:[{t:"a"},{t:"a"}],b:[{t:"b"}]})',
      },
    ],
  },
]

for (const w of weeks) {
  curriculum.push({
    slug: `semana-${String(w.n).padStart(2, '0')}`,
    sort_order: 2 + w.n,
    title: w.title,
    phase: w.phase,
    unlocked_by_default: false,
    objectives: w.objectives,
    content_md: `## Objetivo da semana

${w.objectives.map((o) => `- ${o}`).join('\n')}

## Estude

${w.topics.map((t) => `- ${t}`).join('\n')}

## Prática obrigatória

${w.practice}

## Critério de avanço

Você avançará quando conseguir **explicar** o que fez — não só fazer o código funcionar.`,
    free_text_prompt: w.free_text,
    code_prompt: w.code_prompt,
    starter_code: w.starter,
    mcq: mcq(w.mcq),
    tests: tests(w.tests),
  })
}

curriculum.push(
  {
    slug: 'ciclo-diario',
    sort_order: 15,
    title: 'Como vamos estudar / ciclo diário',
    phase: 'Método',
    unlocked_by_default: false,
    objectives: ['Aplicar o ciclo 20/20/40/10', 'Não avançar sem conseguir explicar'],
    content_md: `## Ciclo diário

| Tempo | Atividade |
|---|---|
| 20 min | Aprender um conceito |
| 20 min | Analisar exemplos de código |
| 40 min | Resolver exercício sem copiar |
| 10 min | Revisar e registrar dúvidas |

Com 2h, aprofunde os exercícios.

## Formato por assunto

1. Conceito didático
2. Exemplos práticos
3. Exercícios progressivos
4. Você resolve
5. Revisão de erros
6. Só então avança

**Regra:** não pule de assunto só porque o código rodou — explique o que fez.`,
    free_text_prompt:
      'Adapte o ciclo 20/20/40/10 para um dia real da sua semana (horários e tema). O que você fará se travar no exercício de 40 min?',
    code_prompt:
      'Implemente `cycleMinutes(): Record<string, number>` retornando learn:20, examples:20, exercise:40, review:10.',
    starter_code: `export function cycleMinutes(): Record<string, number> {
  return {}
}
`,
    mcq: mcq([
      {
        id: 'q1',
        prompt: 'A maior fatia do ciclo diário é:',
        options: [
          { id: 'a', label: 'Exercício (40 min)' },
          { id: 'b', label: 'Revisão (10 min)' },
          { id: 'c', label: 'Só assistir vídeo' },
        ],
        correctOptionId: 'a',
      },
    ]),
    tests: tests([
      {
        name: 'totais',
        assert:
          'const c=cycleMinutes(); c.learn===20 && c.examples===20 && c.exercise===40 && c.review===10',
      },
    ]),
  },
  {
    slug: 'projeto-aondetem',
    sort_order: 16,
    title: 'Projeto: API de comércios locais',
    phase: 'Projeto transversal',
    unlocked_by_default: false,
    objectives: [
      'Evoluir uma API real ao longo das semanas',
      'Usar Supabase como Postgres sem esconder o Backend',
    ],
    content_md: `## Ideia

Em vez de cinco projetos desconectados, construa o Backend de gestão de comércios locais (inspirado no AondeTem).

## Endpoints iniciais

\`\`\`
POST   /auth/register
POST   /auth/login
GET    /businesses
GET    /businesses/:id
POST   /businesses
PATCH  /businesses/:id
DELETE /businesses/:id
POST   /businesses/:id/reviews
GET    /businesses/:id/reviews
\`\`\`

Começa com dados simulados → Postgres → auth → testes → Docker → deploy.

**Atenção:** o objetivo é Backend independente. Supabase pode hospedar Postgres, mas você precisa entender o que acontece por trás.`,
    free_text_prompt:
      'Desenhe (texto) o fluxo de POST /businesses/:id/reviews: auth, validação, persistência e resposta. Quais status codes usaria?',
    code_prompt:
      'Implemente tipos e helpers: `normalizeSlug(name: string): string` (lowercase, espaços → -, remove chars não alfanuméricos/-).',
    starter_code: `export function normalizeSlug(name: string): string {
  return ''
}
`,
    mcq: mcq([
      {
        id: 'q1',
        prompt: 'Neste projeto de estudos, Supabase deve:',
        options: [
          { id: 'a', label: 'Resolver todo o Backend por você sem você entender' },
          { id: 'b', label: 'Pode ser infra Postgres, desde que você entenda as operações' },
          { id: 'c', label: 'Ser abandonado imediatamente' },
        ],
        correctOptionId: 'b',
      },
    ]),
    tests: tests([
      {
        name: 'slug',
        assert: 'normalizeSlug("Padaria do Bairro!") === "padaria-do-bairro"',
      },
    ]),
  },
  {
    slug: 'aula-01-requisicao',
    sort_order: 17,
    title: 'Aula 01 — O que acontece numa requisição',
    phase: 'Primeira aula',
    unlocked_by_default: false,
    objectives: [
      'Narrar o fluxo Frontend → API → DB → JSON → UI',
      'Responder as perguntas-base sem copiar',
    ],
    content_md: `## Cenário

Usuário no AondeTem clica numa loja.

Fluxo simplificado:

1. Frontend solicita dados da loja
2. Requisição HTTP chega à API
3. Backend interpreta
4. Backend consulta o banco
5. Banco retorna dados
6. Backend responde JSON
7. Frontend apresenta

Esse fluxo é a base do trabalho Backend.

## Seu exercício mental

Imagine a ficha de um comércio. Responda com suas palavras (na parte de texto do exercício).`,
    free_text_prompt: `Responda:
1. Qual a função do Frontend?
2. O que é uma requisição HTTP?
3. Por que o Frontend não deve acessar o banco com credenciais administrativas?
4. Qual a responsabilidade do Backend?
5. O que acontece se o comércio não existir?`,
    code_prompt:
      'Implemente `notFoundResponse()` retornando `{ status: 404, body: { error: "business_not_found" } }` e `okBusiness(name: string)` com status 200 e body `{ name }`.',
    starter_code: `export function notFoundResponse() {
  return { status: 0, body: { error: '' } }
}
export function okBusiness(name: string) {
  return { status: 0, body: { name: '' } }
}
`,
    mcq: mcq([
      {
        id: 'q1',
        prompt: 'Quem deve falar com o banco com credenciais privilegiadas?',
        options: [
          { id: 'a', label: 'O Frontend no browser' },
          { id: 'b', label: 'O Backend / API' },
          { id: 'c', label: 'O CSS' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        prompt: 'Comércio inexistente tipicamente resulta em:',
        options: [
          { id: 'a', label: '200 com lista completa' },
          { id: 'b', label: '404 (ou equivalente de domínio)' },
          { id: 'c', label: '301 para o Google' },
        ],
        correctOptionId: 'b',
      },
    ]),
    tests: tests([
      {
        name: '404',
        assert:
          'notFoundResponse().status === 404 && notFoundResponse().body.error === "business_not_found"',
      },
      {
        name: '200',
        assert: 'okBusiness("X").status === 200 && okBusiness("X").body.name === "X"',
      },
    ]),
  },
)

// Fix sort_order for weeks: strategy=1, plan=2, weeks 1-12 => sort 3..14
for (const lesson of curriculum) {
  if (lesson.slug.startsWith('semana-')) {
    const n = Number(lesson.slug.split('-')[1])
    lesson.sort_order = 2 + n
  }
}

async function main() {
  console.log(`Seeding ${curriculum.length} lessons...`)

  for (const lesson of curriculum) {
    const { data: upserted, error } = await supabase
      .from('aprendizz_lessons')
      .upsert(
        {
          slug: lesson.slug,
          sort_order: lesson.sort_order,
          title: lesson.title,
          phase: lesson.phase,
          objectives: lesson.objectives,
          content_md: lesson.content_md,
          unlocked_by_default: lesson.unlocked_by_default,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single()

    if (error) {
      console.error('Lesson failed', lesson.slug, error.message)
      process.exit(1)
    }

    const { error: exErr } = await supabase.from('aprendizz_exercises').upsert(
      {
        lesson_id: upserted.id,
        mcq: lesson.mcq,
        free_text_prompt: lesson.free_text_prompt,
        code_prompt: lesson.code_prompt,
        starter_code: lesson.starter_code,
        tests: lesson.tests,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'lesson_id' },
    )

    if (exErr) {
      console.error('Exercise failed', lesson.slug, exErr.message)
      process.exit(1)
    }

    console.log('✓', lesson.sort_order, lesson.slug)
  }

  console.log('Done.')
}

main()
