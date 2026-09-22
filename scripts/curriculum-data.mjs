/** Full hierarchical curriculum for Aprendizz (pt-BR). */
export const curriculumData = {
  subject: {
    slug: 'backend-node-ts',
    title: 'Backend Empregável',
    sort_order: 1,
    description_md: `## O que você vai construir

Esta matéria transforma o que você já sabe (TypeScript, web, APIs) em **base de Backend júnior**: HTTP, Node, SQL, autenticação, testes, Git, Docker e deploy.

### Como o caminho funciona

1. **Matéria** — o tema amplo (esta página)
2. **Módulo** — um bloco coerente de estudo
3. **Aula** — explicação completa + exercícios de fixação
4. **Avaliação** — 10 questões cobrindo o módulo inteiro

O roadmap só explica a rota. Prática e notas ficam nas aulas e nas avaliações.`,
  },
  modules: [
    {
      slug: 'fundacao-web',
      title: 'Fundação e a Web',
      sort_order: 1,
      description_md:
        'Estratégia da stack, HTTP de verdade, o fluxo de uma requisição e Node.js + TypeScript no servidor.',
      lessons: [
        {
          slug: 'estrategia-stack',
          title: 'Estratégia: Node.js + TypeScript + PostgreSQL',
          kind: 'lesson',
          sort_order: 1,
          unlocked_by_default: true,
          objectives: [
            'Explicar por que esta stack faz sentido para empregabilidade júnior',
            'Separar o que entra agora do que fica para depois',
          ],
          content_md: `## Por que esta matéria existe

Você não precisa “aprender o mundo” antes da primeira vaga. Precisa de uma **base profunda o suficiente** para construir, explicar, testar e publicar uma API.

## A escolha da stack

| Peça | Papel |
|---|---|
| TypeScript | Tipagem e clareza no servidor |
| Node.js | Runtime JavaScript no Backend |
| PostgreSQL | Dados relacionais com SQL real |
| Express (ou similar) | API HTTP |
| Git, testes, Docker, deploy | Prática de time real |

## O que fica de fora (por enquanto)

Microsserviços, Kubernetes e “toda a AWS” não são o teto da casa — são o telhado. Primeiro vem a fundação.

\`\`\`mermaid
flowchart LR
  hoje[Seu contexto atual] --> stack[Node + TS + Postgres]
  stack --> meta[API completa]
  meta -.-> depois[K8s e cloud avancada depois]
\`\`\`

## Exemplo de mentalidade

Em vez de cinco tutoriais desconectados, você evolui **um Backend** ao longo dos módulos: auth, persistência, testes e publicação.

### Mini exemplo de “definição de pronto”

Uma feature só está pronta quando você consegue:

1. Descrever o endpoint e o status code
2. Mostrar a query ou a regra de negócio
3. Dizer como testaria o caso de erro`,
          free_text_prompt:
            'Com suas palavras: por que Node + TypeScript + PostgreSQL é uma boa aposta para o seu momento? O que você deliberadamente NÃO vai estudar nesta fase?',
          code_prompt: '',
          starter_code: '',
          mcq: [
            {
              id: 'q1',
              prompt: 'Qual é o objetivo principal desta matéria?',
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
            {
              id: 'q3',
              prompt: 'PostgreSQL entra nesta fase principalmente para:',
              options: [
                { id: 'a', label: 'Substituir Git' },
                { id: 'b', label: 'Modelar e consultar dados com SQL real' },
                { id: 'c', label: 'Renderizar CSS' },
              ],
              correctOptionId: 'b',
            },
          ],
          tests: [],
        },
        {
          slug: 'http-fundamentos',
          title: 'Como a Web funciona: HTTP na prática',
          kind: 'lesson',
          sort_order: 2,
          unlocked_by_default: false,
          objectives: [
            'Explicar cliente, servidor, request e response',
            'Reconhecer métodos, headers, status e JSON',
          ],
          content_md: `## Cliente e servidor

O **cliente** (browser, app, Insomnia) inicia a conversa. O **servidor** escuta, processa e responde. HTTP é o idioma dessa conversa.

## Anatomia de uma requisição

- **Método**: GET, POST, PUT, PATCH, DELETE
- **URL + query**: caminho e filtros (\`?page=1\`)
- **Headers**: metadados (Content-Type, Authorization)
- **Body**: carga útil (geralmente JSON em APIs)

## Status codes que você precisa decorar com significado

| Código | Ideia |
|---|---|
| 200 | OK |
| 201 | Criado |
| 400 | Pedido inválido |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 500 | Erro no servidor |

\`\`\`mermaid
sequenceDiagram
  participant C as Cliente
  participant S as Servidor
  C->>S: GET /items?limit=10
  S-->>C: 200 application/json
\`\`\`

## Exemplo de uso (inspecione de verdade)

No DevTools → Network, abra qualquer site e filtre por Fetch/XHR. Anote método, status e se a resposta é JSON.

\`\`\`http
GET /api/businesses/42 HTTP/1.1
Host: api.exemplo.com
Accept: application/json
\`\`\`

Resposta típica de sucesso:

\`\`\`json
{ "id": 42, "name": "Padaria Central" }
\`\`\``,
          free_text_prompt:
            'Explique o caminho de uma requisição do navegador até o servidor e de volta, citando método, status e JSON com um exemplo seu.',
          code_prompt:
            'Implemente `isSuccessStatus(code)` (2xx) e `describeStatus(code)` com 200→ok, 201→created, 400→bad_request, 401→unauthorized, 403→forbidden, 404→not_found, 500→server_error, outros→unknown.',
          starter_code: `export function isSuccessStatus(code: number): boolean {
  return false
}
export function describeStatus(code: number): string {
  return 'unknown'
}
`,
          mcq: [
            {
              id: 'q1',
              prompt: '404 indica principalmente:',
              options: [
                { id: 'a', label: 'Não autenticado' },
                { id: 'b', label: 'Recurso não encontrado' },
                { id: 'c', label: 'Erro interno genérico' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'q2',
              prompt: 'Query parameters ficam:',
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
            { name: '404 fail', assert: 'isSuccessStatus(404) === false' },
            { name: 'describe 401', assert: 'describeStatus(401) === "unauthorized"' },
          ],
        },
        {
          slug: 'fluxo-requisicao',
          title: 'O que acontece numa requisição (AondeTem)',
          kind: 'lesson',
          sort_order: 3,
          unlocked_by_default: false,
          objectives: [
            'Narrar Frontend → API → Banco → JSON → UI',
            'Explicar por que o browser não fala com o banco com credenciais admin',
          ],
          content_md: `## Cenário

No AondeTem, o usuário clica numa loja. Quase todo Backend júnior gira em torno desse tipo de fluxo.

## Passo a passo

1. Frontend pede os dados da loja
2. HTTP chega na API
3. Backend valida e interpreta
4. Backend consulta o banco
5. Banco devolve linhas
6. Backend responde JSON
7. Frontend renderiza

\`\`\`mermaid
sequenceDiagram
  participant U as Usuario
  participant FE as Frontend
  participant API as Backend
  participant DB as Banco
  U->>FE: Clica na loja
  FE->>API: GET /businesses/:id
  API->>DB: SELECT
  alt Existe
    DB-->>API: linha
    API-->>FE: 200 JSON
  else Nao existe
    DB-->>API: vazio
    API-->>FE: 404
  end
\`\`\`

## Exemplo de contrato

\`\`\`ts
type Business = { id: string; name: string; address: string }

// sucesso
{ "id": "b1", "name": "Café Norte", "address": "Rua A, 10" }

// erro
{ "error": "business_not_found" }
\`\`\`

## Regra de ouro

Credenciais privilegiadas do banco **não** vão para o frontend. O Backend é a fronteira de confiança.`,
          free_text_prompt: `Responda:
1. Função do Frontend
2. O que é uma requisição HTTP
3. Por que o Frontend não acessa o banco com credenciais admin
4. Responsabilidade do Backend
5. O que acontece se o comércio não existir`,
          code_prompt:
            'Implemente `notFoundResponse()` → `{ status: 404, body: { error: "business_not_found" } }` e `okBusiness(name)` → status 200 com `{ name }`.',
          starter_code: `export function notFoundResponse() {
  return { status: 0, body: { error: '' } }
}
export function okBusiness(name: string) {
  return { status: 0, body: { name: '' } }
}
`,
          mcq: [
            {
              id: 'q1',
              prompt: 'Quem deve usar credenciais privilegiadas do banco?',
              options: [
                { id: 'a', label: 'O Frontend' },
                { id: 'b', label: 'O Backend / API' },
                { id: 'c', label: 'O CSS' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'q2',
              prompt: 'Comércio inexistente tipicamente retorna:',
              options: [
                { id: 'a', label: '200 com lista completa' },
                { id: 'b', label: '404' },
                { id: 'c', label: '301 para o Google' },
              ],
              correctOptionId: 'b',
            },
          ],
          tests: [
            {
              name: '404',
              assert:
                'notFoundResponse().status === 404 && notFoundResponse().body.error === "business_not_found"',
            },
            {
              name: '200',
              assert: 'okBusiness("X").status === 200 && okBusiness("X").body.name === "X"',
            },
          ],
        },
        {
          slug: 'node-typescript-backend',
          title: 'Node.js e TypeScript no Backend',
          kind: 'lesson',
          sort_order: 4,
          unlocked_by_default: false,
          objectives: [
            'Diferenciar frontend e backend em TypeScript',
            'Usar módulos, async/await e variáveis de ambiente',
          ],
          content_md: `## Node.js em uma frase

É o **runtime** que executa JavaScript/TypeScript fora do browser — ideal para APIs, workers e scripts.

## Diferenças práticas FE vs BE

| Frontend | Backend |
|---|---|
| DOM, UI, UX | I/O, banco, regras de negócio |
| Segredos nunca no bundle | Secrets em env no servidor |
| Falha visível ao usuário | Falha vira log + status HTTP |

## Async de verdade

APIs esperam rede e disco. \`async/await\` + tratamento de erro evitam callbacks infinitos.

\`\`\`mermaid
flowchart LR
  req[Request] --> handler[Handler async]
  handler --> io[DB / HTTP externo]
  io --> res[Response]
  handler -.-> err[catch → 500/4xx]
\`\`\`

## Exemplo de uso

\`\`\`ts
import { createServer } from 'node:http'

const port = Number(process.env.PORT ?? 3000)

createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ ok: true, path: req.url }))
}).listen(port)
\`\`\`

Organize por pastas cedo: \`routes\`, \`services\`, \`db\`, \`config\`.`,
          free_text_prompt:
            'Liste diferenças práticas entre TypeScript no frontend e no backend que você já sente (ou espera sentir) no dia a dia.',
          code_prompt:
            'Implemente `async function fetchUserName(id: number): Promise<string>` que rejeita se id <= 0 e resolve para `user-${id}`.',
          starter_code: `export async function fetchUserName(id: number): Promise<string> {
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
            {
              id: 'q2',
              prompt: 'Segredos de produção devem ficar:',
              options: [
                { id: 'a', label: 'Commitados no frontend' },
                { id: 'b', label: 'Em variáveis de ambiente no servidor' },
                { id: 'c', label: 'No CSS' },
              ],
              correctOptionId: 'b',
            },
          ],
          tests: [
            { name: 'resolve', assert: '(await fetchUserName(3)) === "user-3"' },
            {
              name: 'reject',
              assert: '(await fetchUserName(0).then(() => false).catch(() => true)) === true',
            },
          ],
        },
        {
          slug: 'avaliacao-mod-1',
          title: 'Avaliação — Fundação e a Web',
          kind: 'assessment',
          sort_order: 5,
          unlocked_by_default: false,
          objectives: [
            'Validar HTTP, stack e fluxo de requisição do módulo',
            'Acertar as 10 questões para liberar o próximo módulo',
          ],
          content_md: `## Como funciona esta avaliação

São **10 questões** cobrindo tudo o que foi tratado neste módulo: estratégia da stack, HTTP, fluxo Frontend→API→DB e Node no Backend.

- Não há exercício de texto nem código aqui
- Você precisa de **100%** de acerto no MCQ
- Pode revisar as aulas pela sidebar antes de enviar

Boa prova — foque em explicar o “porquê”, não só memorizar nomes.`,
          free_text_prompt: '',
          code_prompt: '',
          starter_code: '',
          mcq: [
            { id: 'q1', prompt: 'O primeiro objetivo do plano é:', options: [{ id: 'a', label: 'Só assistir vídeos' }, { id: 'b', label: 'Construir/explicar/testar/publicar uma API' }, { id: 'c', label: 'Evitar SQL' }], correctOptionId: 'b' },
            { id: 'q2', prompt: '401 significa tipicamente:', options: [{ id: 'a', label: 'Não autenticado' }, { id: 'b', label: 'Criado' }, { id: 'c', label: 'OK' }], correctOptionId: 'a' },
            { id: 'q3', prompt: '403 significa tipicamente:', options: [{ id: 'a', label: 'OK' }, { id: 'b', label: 'Autenticado sem permissão' }, { id: 'c', label: 'Redirect' }], correctOptionId: 'b' },
            { id: 'q4', prompt: 'JSON em APIs serve para:', options: [{ id: 'a', label: 'Trocar dados estruturados' }, { id: 'b', label: 'Estilizar botões' }, { id: 'c', label: 'Compilar CSS' }], correctOptionId: 'a' },
            { id: 'q5', prompt: 'Quem consulta o banco com privilégio:', options: [{ id: 'a', label: 'Frontend' }, { id: 'b', label: 'Backend' }, { id: 'c', label: 'CDN de fontes' }], correctOptionId: 'b' },
            { id: 'q6', prompt: 'GET costuma ser usado para:', options: [{ id: 'a', label: 'Ler recursos' }, { id: 'b', label: 'Apagar disco' }, { id: 'c', label: 'Criar containers' }], correctOptionId: 'a' },
            { id: 'q7', prompt: 'Node.js executa JS principalmente:', options: [{ id: 'a', label: 'No servidor' }, { id: 'b', label: 'Só no Photoshop' }, { id: 'c', label: 'No DNS' }], correctOptionId: 'a' },
            { id: 'q8', prompt: 'Fora do escopo inicial:', options: [{ id: 'a', label: 'HTTP' }, { id: 'b', label: 'Kubernetes' }, { id: 'c', label: 'TypeScript' }], correctOptionId: 'b' },
            { id: 'q9', prompt: '404 no AondeTem ao buscar loja:', options: [{ id: 'a', label: 'Loja não encontrada' }, { id: 'b', label: 'Login ok' }, { id: 'c', label: 'CSS inválido' }], correctOptionId: 'a' },
            { id: 'q10', prompt: 'Variáveis de ambiente no Backend servem para:', options: [{ id: 'a', label: 'Guardar config/secrets fora do código' }, { id: 'b', label: 'Desenhar layouts' }, { id: 'c', label: 'Substituir HTTP' }], correctOptionId: 'a' },
          ],
          tests: [],
        },
      ],
    },
    {
      slug: 'apis-dados',
      title: 'APIs e Bancos de Dados',
      sort_order: 2,
      description_md: 'REST, SQL de verdade e integração API ↔ PostgreSQL com segurança básica.',
      lessons: [
        {
          slug: 'apis-rest',
          title: 'Construção de APIs REST',
          kind: 'lesson',
          sort_order: 1,
          unlocked_by_default: false,
          objectives: ['Modelar rotas e responsabilidades', 'Validar entrada e responder erros com clareza'],
          content_md: `## O que é REST na prática

Recursos nomeados por URLs, verbos HTTP com significado, respostas previsíveis.

## Camadas

\`\`\`mermaid
flowchart TB
  req[Request] --> routes[Rotas]
  routes --> ctrl[Controllers]
  ctrl --> svc[Services]
  svc --> res[JSON Response]
\`\`\`

## Exemplo de API de tarefas

\`\`\`http
POST /tasks
GET /tasks
GET /tasks/:id
PATCH /tasks/:id
DELETE /tasks/:id
\`\`\`

Valide body cedo (título vazio → 400). Erros centralizados evitam \`try/catch\` copiado em toda rota.`,
          free_text_prompt: 'Descreva rotas vs controllers vs services numa API de tarefas.',
          code_prompt:
            'Store em memória: createTask(title), listTasks(), updateTask(id, title), deleteTask(id). IDs a partir de 1.',
          starter_code: `type Task = { id: number; title: string }
const tasks: Task[] = []
let seq = 1
export function createTask(title: string) { return { id: 0, title } }
export function listTasks() { return tasks }
export function updateTask(id: number, title: string) { return null as Task | null }
export function deleteTask(id: number) { return false }
`,
          mcq: [
            { id: 'q1', prompt: 'GET /tasks/:id tipicamente:', options: [{ id: 'a', label: 'Cria' }, { id: 'b', label: 'Lê' }, { id: 'c', label: 'Formata CSS' }], correctOptionId: 'b' },
            { id: 'q2', prompt: 'Validação de input costuma ocorrer:', options: [{ id: 'a', label: 'Antes da regra de negócio pesada' }, { id: 'b', label: 'Só no DNS' }, { id: 'c', label: 'Nunca' }], correctOptionId: 'a' },
          ],
          tests: [
            {
              name: 'crud',
              assert: `(function(){ const t=createTask('a'); if(!t||t.id<1)return false; if(!listTasks().some(x=>x.id===t.id))return false; const u=updateTask(t.id,'b'); if(!u||u.title!=='b')return false; return deleteTask(t.id)===true; })()`,
            },
          ],
        },
        {
          slug: 'postgresql-sql',
          title: 'PostgreSQL e SQL de verdade',
          kind: 'lesson',
          sort_order: 2,
          unlocked_by_default: false,
          objectives: ['Modelar relacionamentos', 'Escrever SQL além do CRUD cego'],
          content_md: `## Por que SQL puro importa

ORMs ajudam, mas escondem joins, índices e transações. Em entrevista e produção, SQL aparece.

## Relacionamentos

1:1, 1:N, N:N — sempre pergunte “quem depende de quem?”.

\`\`\`mermaid
erDiagram
  ALUNO ||--o{ MATRICULA : tem
  PLANO ||--o{ MATRICULA : cobre
\`\`\`

## Exemplo

\`\`\`sql
SELECT a.nome, p.nome AS plano
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
JOIN planos p ON p.id = m.plano_id;
\`\`\``,
          free_text_prompt: 'Modele mentalmente academia (alunos, planos, matrículas, pagamentos) e justifique as FKs.',
          code_prompt:
            'Implemente countEnrollmentsByPlan(enrollments) → Record<planId, number>.',
          starter_code: `export function countEnrollmentsByPlan(enrollments: Array<{ planId: string }>): Record<string, number> {
  return {}
}
`,
          mcq: [
            { id: 'q1', prompt: 'JOIN serve para:', options: [{ id: 'a', label: 'Combinar tabelas relacionadas' }, { id: 'b', label: 'Criptografar senhas' }, { id: 'c', label: 'Fazer deploy' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'Transações ajudam a:', options: [{ id: 'a', label: 'Garantir tudo-ou-nada' }, { id: 'b', label: 'Escolher cor do botão' }, { id: 'c', label: 'Trocar DNS' }], correctOptionId: 'a' },
          ],
          tests: [
            {
              name: 'group',
              assert:
                "JSON.stringify(countEnrollmentsByPlan([{planId:'a'},{planId:'a'},{planId:'b'}]))===JSON.stringify({a:2,b:1})",
            },
          ],
        },
        {
          slug: 'api-banco-integracao',
          title: 'Integração API + PostgreSQL',
          kind: 'lesson',
          sort_order: 3,
          unlocked_by_default: false,
          objectives: ['Usar pool e queries parametrizadas', 'Evitar SQL Injection'],
          content_md: `## Conexão

Use **pool** de conexões. Nunca monte SQL concatenando input do usuário.

\`\`\`mermaid
flowchart LR
  api[API] --> pool[Pool]
  pool --> pg[(Postgres)]
  api --> repo[Repositorio]
\`\`\`

## Exemplo seguro

\`\`\`ts
await pool.query('SELECT * FROM businesses WHERE id = $1', [id])
\`\`\`

## Paginação

\`page\` + \`pageSize\` no service; total no metadata da resposta.`,
          free_text_prompt: 'Explique SQL Injection e por que binds/parametrização mitigam o risco (exemplo ruim vs bom).',
          code_prompt:
            'Implemente buildPage(items, page, pageSize) → { data, total, page, pageSize } (page começa em 1).',
          starter_code: `export function buildPage<T>(items: T[], page: number, pageSize: number) {
  return { data: [] as T[], total: 0, page, pageSize }
}
`,
          mcq: [
            { id: 'q1', prompt: 'SQL Injection mitiga-se com:', options: [{ id: 'a', label: 'Concatenar input' }, { id: 'b', label: 'Queries parametrizadas' }, { id: 'c', label: 'Mais CSS' }], correctOptionId: 'b' },
            { id: 'q2', prompt: 'Migrations servem para:', options: [{ id: 'a', label: 'Versionar schema do banco' }, { id: 'b', label: 'Minificar JS' }, { id: 'c', label: 'Gerar QR code' }], correctOptionId: 'a' },
          ],
          tests: [
            {
              name: 'page2',
              assert:
                'JSON.stringify(buildPage([1,2,3,4,5],2,2).data)===JSON.stringify([3,4]) && buildPage([1,2,3,4,5],2,2).total===5',
            },
          ],
        },
        {
          slug: 'avaliacao-mod-2',
          title: 'Avaliação — APIs e Bancos',
          kind: 'assessment',
          sort_order: 4,
          unlocked_by_default: false,
          objectives: ['Cobrir REST, SQL e integração segura API↔banco'],
          content_md: `## Avaliação do módulo 2

10 questões sobre APIs REST, modelagem SQL e integração com PostgreSQL (incluindo SQL Injection e migrations).

Precisa de 100% de acerto para avançar.`,
          free_text_prompt: '',
          code_prompt: '',
          starter_code: '',
          mcq: [
            { id: 'q1', prompt: 'POST em REST costuma:', options: [{ id: 'a', label: 'Criar recurso' }, { id: 'b', label: 'Só ler' }, { id: 'c', label: 'Apagar DNS' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'Controller idealmente:', options: [{ id: 'a', label: 'Orquestra HTTP e delega regra' }, { id: 'b', label: 'Guarda senha em texto puro' }, { id: 'c', label: 'Renderiza Photoshop' }], correctOptionId: 'a' },
            { id: 'q3', prompt: 'PK significa:', options: [{ id: 'a', label: 'Chave primária' }, { id: 'b', label: 'Protocolo Kafka' }, { id: 'c', label: 'Patch Kubernetes' }], correctOptionId: 'a' },
            { id: 'q4', prompt: 'FK liga:', options: [{ id: 'a', label: 'Tabelas relacionadas' }, { id: 'b', label: 'Cores hex' }, { id: 'c', label: 'Fonts Google' }], correctOptionId: 'a' },
            { id: 'q5', prompt: 'N:N tipicamente usa:', options: [{ id: 'a', label: 'Tabela intermediária' }, { id: 'b', label: 'Apenas um boolean' }, { id: 'c', label: 'CSS Grid' }], correctOptionId: 'a' },
            { id: 'q6', prompt: 'Pool de conexões:', options: [{ id: 'a', label: 'Reutiliza conexões com o banco' }, { id: 'b', label: 'Serve HTML estático' }, { id: 'c', label: 'Assina JWT no browser' }], correctOptionId: 'a' },
            { id: 'q7', prompt: 'Parametrizar query evita:', options: [{ id: 'a', label: 'SQL Injection' }, { id: 'b', label: 'HTTP' }, { id: 'c', label: 'Git' }], correctOptionId: 'a' },
            { id: 'q8', prompt: 'Índice no banco ajuda a:', options: [{ id: 'a', label: 'Acelerar buscas' }, { id: 'b', label: 'Colorir botões' }, { id: 'c', label: 'Trocar tipografia' }], correctOptionId: 'a' },
            { id: 'q9', prompt: '400 em API indica:', options: [{ id: 'a', label: 'Pedido inválido do cliente' }, { id: 'b', label: 'Sucesso' }, { id: 'c', label: 'Created' }], correctOptionId: 'a' },
            { id: 'q10', prompt: 'Repositório na API:', options: [{ id: 'a', label: 'Isola acesso a dados' }, { id: 'b', label: 'Substitui HTTPS' }, { id: 'c', label: 'É um framework CSS' }], correctOptionId: 'a' },
          ],
          tests: [],
        },
      ],
    },
    {
      slug: 'seguranca-qualidade',
      title: 'Segurança e Qualidade',
      sort_order: 3,
      description_md: 'Autenticação/autorização, testes automatizados e fluxo Git profissional.',
      lessons: [
        {
          slug: 'auth-autorizacao',
          title: 'Autenticação e autorização',
          kind: 'lesson',
          sort_order: 1,
          unlocked_by_default: false,
          objectives: ['Separar authN e authZ', 'Proteger rotas com perfis'],
          content_md: `## AuthN vs AuthZ

- **Autenticação**: quem é você (login)
- **Autorização**: o que você pode fazer (perfil)

\`\`\`mermaid
flowchart TB
  login[Login] --> authN[Autenticacao]
  authN --> token[JWT ou sessao]
  token --> authZ{Autorizacao}
  authZ -->|ok| recurso[Recurso]
  authZ -->|nao| deny[403]
\`\`\`

## Exemplo

Hash de senha (bcrypt/argon2), nunca texto puro. Middleware lê o token e anexa \`user\` no request.`,
          free_text_prompt: 'Explique autenticação vs autorização com exemplo aluno vs admin numa academia.',
          code_prompt:
            'canAccess(role, resource): admin acessa tudo; member só "self".',
          starter_code: `export function canAccess(role: string, resource: string): boolean {
  return false
}
`,
          mcq: [
            { id: 'q1', prompt: 'Autenticação responde:', options: [{ id: 'a', label: 'Quem você é' }, { id: 'b', label: 'Cor do tema' }, { id: 'c', label: 'Qual fonte usar' }], correctOptionId: 'a' },
            { id: 'q2', prompt: '403 após login indica:', options: [{ id: 'a', label: 'Falta de permissão' }, { id: 'b', label: 'Sucesso' }, { id: 'c', label: 'Created' }], correctOptionId: 'a' },
          ],
          tests: [
            { name: 'admin', assert: 'canAccess("admin","billing")===true' },
            { name: 'member self', assert: 'canAccess("member","self")===true' },
            { name: 'member deny', assert: 'canAccess("member","billing")===false' },
          ],
        },
        {
          slug: 'testes-automatizados',
          title: 'Testes automatizados',
          kind: 'lesson',
          sort_order: 2,
          unlocked_by_default: false,
          objectives: ['Escrever testes unitários e de endpoint', 'Cobrir erros'],
          content_md: `## Por que testar

Teste é rede de segurança para refatorar e demonstrar qualidade em portfólio.

\`\`\`mermaid
flowchart TB
  e2e[E2E poucos]
  integ[Integracao]
  unit[Unitarios muitos]
  e2e --> integ --> unit
\`\`\`

## Exemplo

Teste o cadastro: sucesso, email inválido, senha fraca.`,
          free_text_prompt: 'Quando usar mock e quando preferir integração real? Justifique.',
          code_prompt: 'sumPositive(nums) soma apenas números > 0.',
          starter_code: `export function sumPositive(nums: number[]): number {
  return 0
}
`,
          mcq: [
            { id: 'q1', prompt: 'Teste de endpoint valida:', options: [{ id: 'a', label: 'Camada HTTP da API' }, { id: 'b', label: 'Somente CSS' }, { id: 'c', label: 'Somente DNS' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'Cobrir erro importa porque:', options: [{ id: 'a', label: 'Produção falha de formas reais' }, { id: 'b', label: 'Aumenta cor do botão' }, { id: 'c', label: 'Troca tipografia' }], correctOptionId: 'a' },
          ],
          tests: [
            { name: 'sum', assert: 'sumPositive([1,-2,3])===4' },
            { name: 'empty', assert: 'sumPositive([])===0' },
          ],
        },
        {
          slug: 'git-fluxo-profissional',
          title: 'Git e fluxo profissional',
          kind: 'lesson',
          sort_order: 3,
          unlocked_by_default: false,
          objectives: ['Usar branches, commits claros e PRs', 'Simular review mesmo solo'],
          content_md: `## Fluxo mínimo profissional

branch → commits → PR → review → merge.

\`\`\`mermaid
gitGraph
  commit id: "main"
  branch feature
  checkout feature
  commit id: "feat"
  checkout main
  merge feature
\`\`\`

## Exemplo de commit

\`feat(api): add business reviews endpoint\``,
          free_text_prompt: 'Escreva um commit bom e um ruim para a mesma mudança e explique a diferença.',
          code_prompt:
            'parseConventionalCommit(msg) → { type, scope, breaking }.',
          starter_code: `export function parseConventionalCommit(msg: string): { type: string; scope: string | null; breaking: boolean } {
  return { type: '', scope: null, breaking: false }
}
`,
          mcq: [
            { id: 'q1', prompt: 'PR serve para:', options: [{ id: 'a', label: 'Revisar e integrar mudanças' }, { id: 'b', label: 'Apagar o remoto' }, { id: 'c', label: 'Substituir testes' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'Branch feature isola:', options: [{ id: 'a', label: 'Trabalho em progresso' }, { id: 'b', label: 'O banco de produção' }, { id: 'c', label: 'O DNS' }], correctOptionId: 'a' },
          ],
          tests: [
            {
              name: 'scope',
              assert:
                'parseConventionalCommit("feat(api): add login").type==="feat" && parseConventionalCommit("feat(api): add login").scope==="api"',
            },
            { name: 'breaking', assert: 'parseConventionalCommit("feat!: drop").breaking===true' },
          ],
        },
        {
          slug: 'avaliacao-mod-3',
          title: 'Avaliação — Segurança e Qualidade',
          kind: 'assessment',
          sort_order: 4,
          unlocked_by_default: false,
          objectives: ['Cobrir auth, testes e Git do módulo'],
          content_md: `## Avaliação do módulo 3

10 questões sobre autenticação/autorização, testes e fluxo Git. 100% para avançar.`,
          free_text_prompt: '',
          code_prompt: '',
          starter_code: '',
          mcq: [
            { id: 'q1', prompt: 'AuthN responde:', options: [{ id: 'a', label: 'Quem é você' }, { id: 'b', label: 'Qual cor usar' }, { id: 'c', label: 'Qual fonte' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'AuthZ responde:', options: [{ id: 'a', label: 'O que pode fazer' }, { id: 'b', label: 'Qual emoji' }, { id: 'c', label: 'Qual CDN' }], correctOptionId: 'a' },
            { id: 'q3', prompt: 'Senha deve ser:', options: [{ id: 'a', label: 'Hasheada' }, { id: 'b', label: 'Texto puro no repo' }, { id: 'c', label: 'Enviada no CSS' }], correctOptionId: 'a' },
            { id: 'q4', prompt: 'JWT tipicamente carrega:', options: [{ id: 'a', label: 'Claims do usuário' }, { id: 'b', label: 'Arquivos MP4' }, { id: 'c', label: 'Binários do SO' }], correctOptionId: 'a' },
            { id: 'q5', prompt: 'Middleware de auth age:', options: [{ id: 'a', label: 'Antes do handler protegido' }, { id: 'b', label: 'Depois do deploy físico' }, { id: 'c', label: 'No Photoshop' }], correctOptionId: 'a' },
            { id: 'q6', prompt: 'Teste unitário foca:', options: [{ id: 'a', label: 'Unidade isolada' }, { id: 'b', label: 'Datacenter inteiro' }, { id: 'c', label: 'Somente tipografia' }], correctOptionId: 'a' },
            { id: 'q7', prompt: 'Mock serve para:', options: [{ id: 'a', label: 'Simular dependência' }, { id: 'b', label: 'Apagar banco' }, { id: 'c', label: 'Gerar CSS' }], correctOptionId: 'a' },
            { id: 'q8', prompt: 'PR facilita:', options: [{ id: 'a', label: 'Code review' }, { id: 'b', label: 'Esconder histórico' }, { id: 'c', label: 'Remover HTTPS' }], correctOptionId: 'a' },
            { id: 'q9', prompt: 'Conflito de merge ocorre quando:', options: [{ id: 'a', label: 'Alterações competem no mesmo trecho' }, { id: 'b', label: 'O DNS muda' }, { id: 'c', label: 'A fonte carrega' }], correctOptionId: 'a' },
            { id: 'q10', prompt: 'Commit claro ajuda a:', options: [{ id: 'a', label: 'Entender histórico' }, { id: 'b', label: 'Minificar imagens' }, { id: 'c', label: 'Trocar thema CSS' }], correctOptionId: 'a' },
          ],
          tests: [],
        },
      ],
    },
    {
      slug: 'mercado-portfolio',
      title: 'Mercado e Portfólio',
      sort_order: 4,
      description_md: 'Docker, deploy, projeto de comércios locais, ciclo de estudos e entrevistas.',
      lessons: [
        {
          slug: 'docker-containers',
          title: 'Docker na prática',
          kind: 'lesson',
          sort_order: 1,
          unlocked_by_default: false,
          objectives: ['Diferenciar imagem e container', 'Subir API + Postgres com Compose'],
          content_md: `## Ideia

Mesmo ambiente na sua máquina e no servidor.

\`\`\`mermaid
flowchart LR
  compose[Compose] --> api[Container API]
  compose --> db[Container DB]
\`\`\`

## Exemplo

\`Dockerfile\` para build da API; \`docker-compose.yml\` com serviço \`db\` e \`api\`.`,
          free_text_prompt: 'Explique imagem vs container e por que Compose ajuda no dia a dia.',
          code_prompt: 'parseEnvLine(line): KEY=VALUE ou null para vazio/#.',
          starter_code: `export function parseEnvLine(line: string): [string, string] | null {
  return null
}
`,
          mcq: [
            { id: 'q1', prompt: 'Dockerfile define:', options: [{ id: 'a', label: 'Como construir a imagem' }, { id: 'b', label: 'Preço da VPS' }, { id: 'c', label: 'Cor do botão' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'Compose orquestra:', options: [{ id: 'a', label: 'Vários serviços juntos' }, { id: 'b', label: 'Somente fontes' }, { id: 'c', label: 'Somente CSS' }], correctOptionId: 'a' },
          ],
          tests: [
            { name: 'ok', assert: 'JSON.stringify(parseEnvLine("PORT=3000"))===JSON.stringify(["PORT","3000"])' },
            { name: 'comment', assert: 'parseEnvLine("# hi")===null' },
          ],
        },
        {
          slug: 'deploy-producao',
          title: 'Deploy e produção',
          kind: 'lesson',
          sort_order: 2,
          unlocked_by_default: false,
          objectives: ['Publicar API com healthcheck e env', 'Entender CORS e migrations em prod'],
          content_md: `## Checklist mínimo

Build → env → logs → CORS → health → migrations → documentação.

\`\`\`mermaid
flowchart TB
  build[Build] --> env[Env]
  env --> health[Health]
  health --> live[Producao]
\`\`\`

## Exemplo

\`GET /health\` → \`{ "status": "ok", "version": "1.0.0" }\`.`,
          free_text_prompt: 'Monte um checklist de go-live com pelo menos 6 itens para sua API.',
          code_prompt: 'healthPayload(ok, version) → status ok|degraded + version.',
          starter_code: `export function healthPayload(ok: boolean, version: string) {
  return { status: 'degraded', version }
}
`,
          mcq: [
            { id: 'q1', prompt: 'Health check serve para:', options: [{ id: 'a', label: 'Ver se o serviço está saudável' }, { id: 'b', label: 'Criptografar imagens' }, { id: 'c', label: 'Escolher fonte' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'CORS controla:', options: [{ id: 'a', label: 'Quem no browser pode chamar a API' }, { id: 'b', label: 'O preço do domínio' }, { id: 'c', label: 'A tipografia' }], correctOptionId: 'a' },
          ],
          tests: [
            { name: 'ok', assert: 'healthPayload(true,"1.0.0").status==="ok"' },
            { name: 'deg', assert: 'healthPayload(false,"1.0.0").status==="degraded"' },
          ],
        },
        {
          slug: 'projeto-api-comercios',
          title: 'Projeto: API de comércios locais',
          kind: 'lesson',
          sort_order: 3,
          unlocked_by_default: false,
          objectives: ['Evoluir uma API real ao longo do curso', 'Usar Postgres sem esconder o Backend'],
          content_md: `## Ideia transversal

API inspirada no AondeTem: businesses + reviews + auth.

\`\`\`mermaid
flowchart LR
  mock[Mock] --> pg[(Postgres)]
  pg --> auth[Auth]
  auth --> tests[Testes]
  tests --> docker[Docker]
  docker --> deploy[Deploy]
\`\`\`

## Endpoints

\`\`\`
POST /auth/register
POST /auth/login
GET/POST/PATCH/DELETE /businesses
GET/POST /businesses/:id/reviews
\`\`\`

Supabase pode hospedar Postgres — você ainda precisa entender as operações.`,
          free_text_prompt:
            'Desenhe o fluxo de POST /businesses/:id/reviews (auth, validação, persistência, status codes).',
          code_prompt: 'normalizeSlug(name): lowercase, espaços→-, remove não alfanuméricos.',
          starter_code: `export function normalizeSlug(name: string): string {
  return ''
}
`,
          mcq: [
            { id: 'q1', prompt: 'Neste projeto, Supabase deve:', options: [{ id: 'a', label: 'Esconder todo o Backend' }, { id: 'b', label: 'Pode ser Postgres desde que você entenda' }, { id: 'c', label: 'Ser proibido' }], correctOptionId: 'b' },
            { id: 'q2', prompt: 'Qualidade do portfólio prioriza:', options: [{ id: 'a', label: 'Qualidade técnica' }, { id: 'b', label: 'Só quantidade de telas' }, { id: 'c', label: 'Evitar README' }], correctOptionId: 'a' },
          ],
          tests: [
            { name: 'slug', assert: 'normalizeSlug("Padaria do Bairro!")==="padaria-do-bairro"' },
          ],
        },
        {
          slug: 'ciclo-estudo-entrevistas',
          title: 'Ciclo de estudos e entrevistas',
          kind: 'lesson',
          sort_order: 4,
          unlocked_by_default: false,
          objectives: ['Aplicar ciclo 20/20/40/10', 'Usar entrevistas para achar lacunas'],
          content_md: `## Ciclo diário

20 conceito · 20 exemplos · 40 exercício · 10 revisão.

\`\`\`mermaid
pie title Ciclo diario
  "Conceito" : 20
  "Exemplos" : 20
  "Exercicio" : 40
  "Revisao" : 10
\`\`\`

## Entrevistas

Candidate-se antes de se sentir 100% pronto. Cada entrevista revela o próximo tópico de estudo.`,
          free_text_prompt:
            'Adapte o ciclo 20/20/40/10 a um dia real seu. Quais lacunas você atacaria após uma entrevista?',
          code_prompt: 'groupBy(items, keyFn) agrupa em Record<string, T[]>.',
          starter_code: `export function groupBy<T>(items: T[], keyFn: (i: T) => string): Record<string, T[]> {
  return {}
}
`,
          mcq: [
            { id: 'q1', prompt: 'Maior fatia do ciclo:', options: [{ id: 'a', label: 'Exercício 40min' }, { id: 'b', label: 'Revisão 10min' }, { id: 'c', label: 'Só vídeo' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'Sobre candidatar-se:', options: [{ id: 'a', label: 'Esperar 100% pronto' }, { id: 'b', label: 'Começar antes de se sentir 100% pronto' }, { id: 'c', label: 'Evitar entrevistas' }], correctOptionId: 'b' },
          ],
          tests: [
            {
              name: 'group',
              assert:
                'JSON.stringify(groupBy([{t:"a"},{t:"b"},{t:"a"}],x=>x.t))===JSON.stringify({a:[{t:"a"},{t:"a"}],b:[{t:"b"}]})',
            },
          ],
        },
        {
          slug: 'avaliacao-mod-4',
          title: 'Avaliação — Mercado e Portfólio',
          kind: 'assessment',
          sort_order: 5,
          unlocked_by_default: false,
          objectives: ['Cobrir Docker, deploy, projeto e método de estudos/entrevistas'],
          content_md: `## Avaliação final do módulo 4

10 questões sobre Docker, produção, o projeto de comércios e o ciclo de estudos/entrevistas. 100% para concluir o módulo.`,
          free_text_prompt: '',
          code_prompt: '',
          starter_code: '',
          mcq: [
            { id: 'q1', prompt: 'Container é:', options: [{ id: 'a', label: 'Instância em execução de uma imagem' }, { id: 'b', label: 'Um arquivo CSS' }, { id: 'c', label: 'Um registro DNS' }], correctOptionId: 'a' },
            { id: 'q2', prompt: 'Compose ajuda a:', options: [{ id: 'a', label: 'Subir vários serviços juntos' }, { id: 'b', label: 'Escolher tipografia' }, { id: 'c', label: 'Gerar QR' }], correctOptionId: 'a' },
            { id: 'q3', prompt: 'Healthcheck em produção:', options: [{ id: 'a', label: 'Indica saúde do serviço' }, { id: 'b', label: 'Minifica HTML' }, { id: 'c', label: 'Troca tema' }], correctOptionId: 'a' },
            { id: 'q4', prompt: 'Migration em prod deve ser:', options: [{ id: 'a', label: 'Planejada e versionada' }, { id: 'b', label: 'Feita no CSS' }, { id: 'c', label: 'Ignorada sempre' }], correctOptionId: 'a' },
            { id: 'q5', prompt: 'CORS protege principalmente:', options: [{ id: 'a', label: 'Chamadas cross-origin no browser' }, { id: 'b', label: 'O cabo de rede' }, { id: 'c', label: 'A tipografia' }], correctOptionId: 'a' },
            { id: 'q6', prompt: 'Projeto AondeTem-like prioriza:', options: [{ id: 'a', label: 'Evolução Backend real' }, { id: 'b', label: 'Só mock eterno' }, { id: 'c', label: 'Evitar SQL' }], correctOptionId: 'a' },
            { id: 'q7', prompt: 'Reviews de comércio ficam em:', options: [{ id: 'a', label: 'Endpoints dedicados na API' }, { id: 'b', label: 'Somente no CSS' }, { id: 'c', label: 'No favicon' }], correctOptionId: 'a' },
            { id: 'q8', prompt: 'Ciclo 40min é para:', options: [{ id: 'a', label: 'Exercício sem copiar' }, { id: 'b', label: 'Só scroll infinito' }, { id: 'c', label: 'Deploy automático de tipografia' }], correctOptionId: 'a' },
            { id: 'q9', prompt: 'Entrevistas ajudam a:', options: [{ id: 'a', label: 'Revelar lacunas de estudo' }, { id: 'b', label: 'Evitar praticar' }, { id: 'c', label: 'Apagar o Git' }], correctOptionId: 'a' },
            { id: 'q10', prompt: ' candidatar-se cedo:', options: [{ id: 'a', label: 'Faz parte do aprendizado' }, { id: 'b', label: 'É proibido pelo plano' }, { id: 'c', label: 'Substitui Docker' }], correctOptionId: 'a' },
          ],
          tests: [],
        },
      ],
    },
  ],
}
