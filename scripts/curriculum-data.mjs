/** Full hierarchical curriculum for Aprendizz (pt-BR). */
export const curriculumData = {
  subject: {
    slug: 'backend-node-ts',
    title: 'Backend Empregável',
    sort_order: 1,
    description_md: `## O que você vai construir

Esta matéria transforma o que você já sabe (TypeScript, web, APIs) em **base de Backend júnior**: HTTP, Node, SQL, autenticação, testes, Git, Docker e deploy.

O foco não é acumular definições. É sair de cada aula **conseguindo explicar e defender** decisões — o que entrevistas e o primeiro emprego cobram de verdade.

### Como o caminho funciona

1. **Curso** — o programa completo (esta página)
2. **Módulo** — um bloco coerente de estudo
3. **Aula** — explicação com trade-offs + exercícios de fixação
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

Você não precisa “aprender o mundo” antes da primeira vaga. Precisa de uma **base profunda o suficiente** para construir, explicar, testar e publicar uma API — e defender essas escolhas numa entrevista.

## A escolha da stack

| Peça | Papel |
|---|---|
| TypeScript | Tipagem e clareza no servidor |
| Node.js | Runtime JavaScript no Backend |
| PostgreSQL | Dados relacionais com SQL real |
| Express (ou similar) | API HTTP |
| Git, testes, Docker, deploy | Prática de time real |

\`\`\`mermaid
flowchart LR
  hoje[Seu contexto atual] --> stack[Node + TS + Postgres]
  stack --> meta[API completa]
  meta -.-> depois[K8s e cloud avancada depois]
\`\`\`

## Por que isso importa

No mercado brasileiro de vagas júnior, **Node + TypeScript + PostgreSQL** aparece com frequência em startups e times de produto web. Recrutadores querem ver no GitHub: uma API com rotas claras, SQL (mesmo simples), auth, testes e README que explique decisões — não uma coleção de tutoriais incompletos.

Comparações mentais úteis:

- **Só Express + Mongo**: sobe rápido, mas você adia modelagem relacional e SQL — e muitas entrevistas cobram JOIN, índice e transação.
- **Só Nest “no automático”**: o framework organiza, mas se você não entende HTTP, camadas e o banco, vira decorators sem discurso.

## O que fica de fora (por enquanto) — e por quê

Microsserviços, Kubernetes e “toda a AWS” não são o teto da casa — são o telhado. Sem fundação, você só repete buzzwords.

## O que quebra se fizer errado

- Trocar de stack a cada duas semanas → portfólio raso e zero profundidade para entrevista.
- Pular SQL “porque o ORM resolve” → trava em bug de produção e na pergunta de JOIN.
- Estudar só vídeo sem publicar API → você “conhece os nomes”, mas não defende decisões.

## Exemplo um pouco mais rico — definição de pronto

Uma feature só está pronta quando você consegue:

1. Descrever o endpoint, o status code e o contrato JSON
2. Mostrar a query ou a regra de negócio (mesmo que ainda em memória)
3. Dizer como testaria o **caso de erro** (400/401/404/500)
4. Explicar em 30 segundos *por que* fez assim (e o que deixou de fora)`,
          free_text_prompt:
            'Explique para um tech lead: por que Node + TypeScript + PostgreSQL é uma boa aposta para vaga júnior no seu contexto? Compare mentalmente com “só Express + Mongo” ou “só Nest”. O que você deliberadamente NÃO vai estudar nesta fase — e por quê?',
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

## Status codes com significado

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
  participant B as Browser
  participant S as Servidor
  B->>S: OPTIONS preflight (CORS)
  S-->>B: 204 + headers CORS
  B->>S: GET /items?limit=10
  S-->>B: 200 application/json
\`\`\`

## Por que isso importa

Em produção e em entrevista, status code **semântico** comunica o contrato: o cliente sabe se deve retry, pedir login, ou mostrar “não encontrado”. “Sempre 200 com \`{ ok: false }\` no body” esconde falhas, quebra monitoramento e confunde o frontend.

## Ciclo real (além do GET feliz)

1. Browser resolve DNS e abre conexão TLS (HTTPS)
2. Se for cross-origin “não simples”, pode haver **preflight** OPTIONS
3. Request chega com método, headers e body
4. Servidor valida, executa regra, responde status + body
5. Browser aplica CORS; se headers CORS falharem, o JS nem lê a resposta

## O que quebra se fizer errado

- Devolver 200 para erro de validação → frontend e logs mentem.
- Ignorar CORS → “funciona no Postman, quebra no browser” (clássico de quem veio do frontend).
- Confundir 401 com 403 → o time de produto trata login e permissão do mesmo jeito.

## Exemplo um pouco mais rico

\`\`\`http
OPTIONS /api/businesses HTTP/1.1
Origin: https://app.exemplo.com
Access-Control-Request-Method: POST
\`\`\`

\`\`\`http
POST /api/businesses HTTP/1.1
Host: api.exemplo.com
Origin: https://app.exemplo.com
Content-Type: application/json

{"name":""}
\`\`\`

Resposta correta (pedido inválido), não “200 com erro escondido”:

\`\`\`http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{"error":"name_required"}
\`\`\``,
          free_text_prompt:
            'Explique para um entrevistador o caminho de uma requisição do navegador até o servidor e de volta, citando preflight/CORS quando fizer sentido. Por que “sempre devolver 200” é uma má ideia? Dê um exemplo com método, status e JSON.',
          code_prompt:
            'Implemente `isSuccessStatus(code)` (2xx) e `describeStatus(code)` com 200→ok, 201→created, 400→bad_request, 401→unauthorized, 403→forbidden, 404→not_found, 500→server_error, outros→unknown. Trate apenas números; o contrato importa tanto quanto a função.',
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

No AondeTem, o usuário clica numa loja. Quase todo Backend júnior gira em torno desse tipo de fluxo — e das **falhas** no meio do caminho.

## Passo a passo (caminho feliz)

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

## Por que isso importa

Quem veio do frontend tende a pensar “chamei a API e veio o JSON”. Em Backend, o valor está em **mapear falhas** para status e mensagens estáveis — e em nunca confiar no client.

## Pontos de falha (o que o frontend recebe)

| Falha | Resposta típica |
|---|---|
| id inválido / UUID malformado | 400 + \`{ error: "invalid_id" }\` |
| loja não existe | 404 + \`{ error: "business_not_found" }\` |
| timeout / banco fora | 503 ou 500 + erro genérico (sem vazar SQL) |
| JSON do body quebrado no POST | 400 + \`invalid_json\` |
| credencial de banco no client | **incidente de segurança** |

## Regra de confiança + ataque simples

Se o frontend tivesse a connection string admin, qualquer usuário abre o DevTools, copia o segredo e lê/apaga dados. O Backend é a **fronteira de confiança**: valida identidade, aplica autorização e fala com o banco.

## O que quebra se fizer errado

- Devolver 500 para “não encontrado” → monitoramento grita sem necessidade e o UX fica genérico.
- Espelhar erro de SQL no JSON → vaza schema e ajuda atacante.
- Colocar service role / senha do banco no Vite → vazamento permanente no bundle.

## Exemplo um pouco mais rico — contrato

\`\`\`ts
type Business = { id: string; name: string; address: string }

// 200
{ "id": "b1", "name": "Café Norte", "address": "Rua A, 10" }

// 404
{ "error": "business_not_found" }

// 400
{ "error": "invalid_id" }
\`\`\``,
          free_text_prompt: `Explique para um tech lead por que você NÃO deixaria o frontend acessar o banco com credenciais privilegiadas. Inclua:
1. Função do Frontend vs Backend neste fluxo
2. O que é a requisição HTTP neste cenário
3. Um exemplo simples de abuso se o segredo vazar no client
4. O que o frontend deve receber se o comércio não existir (status + body)`,
          code_prompt:
            'Implemente `notFoundResponse()` → `{ status: 404, body: { error: "business_not_found" } }` e `okBusiness(name)` → status 200 com `{ name }`. O contrato (status + body) é o que o frontend consome.',
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
| Re-render | Throughput, latência, estabilidade |

## Por que isso importa

No servidor, um erro não tratado pode derrubar o processo (ou deixar request pendurada). Tipagem forte e env vars importam **mais** no Backend: um typo em \`DATABASE_URL\` ou um \`undefined\` em query explode em produção para todos os usuários, não só na sua tela.

## Event loop e async/await (sem mágica)

Node é ótimo em I/O concorrente: enquanto espera o banco, o event loop atende outras requests. \`async/await\` não cria threads novas por si só — ele organiza Promises. Bloquear CPU pesada no handler (loop gigante síncrono) atrasa **todo mundo**.

\`\`\`mermaid
flowchart LR
  req[Request] --> handler[Handler async]
  handler --> io[DB / HTTP externo]
  io --> res[Response]
  handler -.-> err[catch → 4xx/5xx + log]
\`\`\`

## O que quebra se fizer errado

- Promise rejeitada sem \`catch\` / sem handler de \`unhandledRejection\` → processo instável.
- Commitar \`.env\` com senha → vazamento + rotação urgente.
- Tratar async como “açúcar de sintaxe” e esquecer timeout de I/O → request eternas.

## Exemplo um pouco mais rico

\`\`\`ts
import { createServer } from 'node:http'

const port = Number(process.env.PORT ?? 3000)
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing')
  process.exit(1)
}

createServer(async (req, res) => {
  try {
    // await db.query(...)
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, path: req.url }))
  } catch (err) {
    console.error(err)
    res.writeHead(500, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'internal_error' }))
  }
}).listen(port)
\`\`\`

Organize cedo: \`routes\`, \`services\`, \`db\`, \`config\` — não porque “é bonito”, mas porque entrevista e time pedem onde mora a regra de negócio.`,
          free_text_prompt:
            'Em entrevista: qual a diferença prática entre TypeScript no frontend e no backend? Explique event loop/I/O em termos simples, o risco de erro async não tratado, e por que variáveis de ambiente + tipagem importam mais no servidor.',
          code_prompt:
            'Implemente `async function fetchUserName(id: number): Promise<string>` que rejeita se id <= 0 e resolve para `user-${id}`. Trate o contrato de erro: rejeição é esperada para input inválido.',
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

Foque em explicar o “porquê”, não só memorizar nomes.`,
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
            {
              id: 'q9',
              prompt:
                'Usuário logado tenta GET /businesses/:id de uma loja que não existe. Status mais adequado:',
              options: [
                { id: 'a', label: '401 — porque qualquer erro de auth/recurso vira 401' },
                { id: 'b', label: '404 — autenticado, mas o recurso não existe' },
                { id: 'c', label: '200 com body vazio — para não assustar o frontend' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'q10',
              prompt:
                'API “funciona no Insomnia” mas o browser bloqueia a resposta. Causa mais provável entre as opções:',
              options: [
                { id: 'a', label: 'CORS / preflight mal configurado no servidor' },
                { id: 'b', label: 'PostgreSQL não aceita JSON' },
                { id: 'c', label: 'TypeScript não roda no Backend' },
              ],
              correctOptionId: 'a',
            },
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

## Camadas — responsabilidade real

| Camada | Faz | Não faz |
|---|---|---|
| Rota | Mapeia URL/método → handler | Regra de negócio |
| Controller | Orquestra HTTP (status, body) | SQL direto / regra pesada |
| Service | Regra de negócio | Detalhe de driver do banco |
| Repository | Isola SQL/queries | Decidir status HTTP |

\`\`\`mermaid
flowchart TB
  req[Request] --> routes[Rotas]
  routes --> ctrl[Controllers]
  ctrl --> svc[Services]
  svc --> repo[Repository]
  repo --> res[JSON Response]
\`\`\`

## Por que isso importa

Em entrevista: “onde fica a validação?”. Se a validação só existe no frontend, a API aceita lixo via curl. Se o SQL mora no controller, você não consegue reutilizar nem testar a regra sem HTTP.

## O que quebra se fizer errado

- Validação só no React → burla fácil; dados corrompidos.
- Service devolvendo \`res.status\` → camadas grudadas; testes difíceis.
- Um “god controller” de 400 linhas → PR impossível de revisar.

## Exemplo um pouco mais rico — API de tarefas

\`\`\`http
POST /tasks          → 201 { id, title } | 400 { error: "title_required" }
GET /tasks           → 200 { data: Task[] }
GET /tasks/:id       → 200 Task | 404
PATCH /tasks/:id     → 200 Task | 400 | 404
DELETE /tasks/:id    → 204 | 404
\`\`\`

\`\`\`ts
// service: regra + validação de domínio
function createTask(title: string) {
  const t = title.trim()
  if (!t) throw Object.assign(new Error('title_required'), { status: 400 })
  return repo.insert({ title: t })
}

// controller: traduz erro → HTTP
\`\`\``,
          free_text_prompt:
            'Explique para um tech lead a diferença entre rota, controller, service e repository numa API de tarefas. O que acontece de ruim se a validação do título ficar só no frontend ou só no repository?',
          code_prompt:
            'Store em memória: createTask(title), listTasks(), updateTask(id, title), deleteTask(id). IDs a partir de 1. Contrato extra: createTask com título vazio/só espaços deve lançar Error (validação antes de persistir).',
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
            {
              name: 'validate empty',
              assert: `(function(){ try { createTask('   '); return false } catch { return true } })()`,
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

ORMs ajudam, mas escondem joins, índices e transações. Em entrevista e produção, SQL aparece — “o Prisma gera” não basta se a query está lenta ou inconsistente.

## Relacionamentos

1:1, 1:N, N:N — sempre pergunte “quem depende de quem?”.

\`\`\`mermaid
erDiagram
  ALUNO ||--o{ MATRICULA : tem
  PLANO ||--o{ MATRICULA : cobre
  ALUNO ||--o{ PAGAMENTO : paga
\`\`\`

## Por que isso importa

Modelagem errada vira gambiarra eterna: relatório impossível, FK faltando, duplicata de matrícula. Índice certo transforma timeout em milissegundos; índice errado só atrasa escrita.

## Índices, JOINs e transações (o que a entrevista cobra)

- **JOIN**: combina tabelas relacionadas — não é “magia do ORM”.
- **Índice**: acelera filtro/ordenação em colunas quentes (\`aluno_id\`, email único). Não indexe tudo.
- **Transação**: matrícula + cobrança inicial = tudo-ou-nada. Sem isso, aluno matriculado sem pagamento (ou o contrário).

O que o ORM esconde e você precisa saber nomear: N+1 queries, migrate vs schema drift, isolation level básico.

## O que quebra se fizer errado

- Sem FK → órfãos no banco.
- Sem transação em operação composta → estado pela metade.
- SELECT * em tabela enorme sem índice → API “aleatoriamente lenta”.

## Exemplo um pouco mais rico

\`\`\`sql
BEGIN;
INSERT INTO matriculas (aluno_id, plano_id) VALUES ($1, $2);
INSERT INTO pagamentos (aluno_id, valor_centavos) VALUES ($1, 9900);
COMMIT;

-- leitura com JOIN
SELECT a.nome, p.nome AS plano
FROM matriculas m
JOIN alunos a ON a.id = m.aluno_id
JOIN planos p ON p.id = m.plano_id
WHERE a.id = $1;

-- índice típico
CREATE INDEX matriculas_aluno_id_idx ON matriculas (aluno_id);
\`\`\``,
          free_text_prompt:
            'Modele academia (alunos, planos, matrículas, pagamentos) e justifique as FKs. Em entrevista: quando você usaria índice e quando usaria transação? O que um ORM esconde que você ainda precisa entender?',
          code_prompt:
            'Implemente countEnrollmentsByPlan(enrollments) → Record<planId, number>. Pense como um GROUP BY em memória.',
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

Use **pool** de conexões. Abrir conexão TCP + auth a cada request é caro; o pool reutiliza.

\`\`\`mermaid
flowchart LR
  api[API] --> pool[Pool]
  pool --> pg[(Postgres)]
  api --> repo[Repositorio]
\`\`\`

## Por que isso importa

SQL Injection ainda derruba sistemas reais. Em entrevista, “eu concateno a string” é sinal vermelho. Em produção, pool mal dimensionado = timeout sob carga.

## Ruim vs bom (lado a lado)

\`\`\`ts
// RUIM — concatenação (SQL Injection)
await client.query("SELECT * FROM users WHERE email = '" + email + "'")
// email = "' OR '1'='1" → vaza a tabela

// BOM — parametrizado: o driver envia query e valores separados
await pool.query('SELECT * FROM users WHERE email = $1', [email])
\`\`\`

O \`$1\` não é “só estilo”: o protocolo do Postgres trata o valor como **dado**, não como código SQL.

## Paginação: offset vs cursor (menção)

- \`OFFSET/LIMIT\` (page/pageSize): simples; fica lento em páginas profundas.
- **Cursor** (\`WHERE id > $1 LIMIT n\`): melhor em feeds grandes.

## O que quebra se fizer errado

- Concatenar input → dump ou destruição de dados.
- Sem pool → esgota conexões do Postgres.
- Migrar schema só “na mão no prod” → drift entre ambientes.

## Exemplo um pouco mais rico

\`\`\`ts
export async function listBusinesses(page: number, pageSize: number) {
  const limit = Math.min(Math.max(pageSize, 1), 50)
  const offset = (Math.max(page, 1) - 1) * limit
  const { rows } = await pool.query(
    'SELECT id, name FROM businesses ORDER BY id LIMIT $1 OFFSET $2',
    [limit, offset],
  )
  const total = await pool.query('SELECT count(*)::int AS n FROM businesses')
  return { data: rows, total: total.rows[0].n, page, pageSize: limit }
}
\`\`\``,
          free_text_prompt:
            'Mostre um exemplo de SQL Injection (input malicioso) e como a parametrização ($1) impede. Explique para um tech lead por que pool existe (custo de conexão) e cite a diferença conceitual entre paginação offset e cursor.',
          code_prompt:
            'Implemente buildPage(items, page, pageSize) → { data, total, page, pageSize } (page começa em 1). Contrato: page/pageSize inválidos (<=0) devem se comportar como page=1 e pageSize=1 no mínimo.',
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
            {
              name: 'clamp',
              assert:
                'JSON.stringify(buildPage([1,2,3],0,0).data)===JSON.stringify([1]) && buildPage([1,2,3],0,0).page===1',
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
            {
              id: 'q9',
              prompt:
                'POST /tasks com title vazio. Onde a validação deve barrar e qual status típico?',
              options: [
                { id: 'a', label: 'Só no CSS do formulário; API retorna 200' },
                { id: 'b', label: 'Na API (service/controller), tipicamente 400' },
                { id: 'c', label: 'No DNS; tipicamente 301' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'q10',
              prompt:
                'Matricular aluno e registrar pagamento inicial: por que transação + queries parametrizadas?',
              options: [
                { id: 'a', label: 'Tudo-ou-nada no estado + evitar SQL Injection nos valores' },
                { id: 'b', label: 'Para o frontend poder concatenar SQL com segurança' },
                { id: 'c', label: 'Porque índice substitui JOIN' },
              ],
              correctOptionId: 'a',
            },
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

- **Autenticação (AuthN)**: quem é você (login)
- **Autorização (AuthZ)**: o que você pode fazer (perfil/permissão)

\`\`\`mermaid
flowchart TB
  login[Login] --> authN[Autenticacao]
  authN --> token[JWT ou sessao]
  token --> mw[Middleware]
  mw --> authZ{Autorizacao}
  authZ -->|ok| recurso[Recurso]
  authZ -->|sem token| unauth[401]
  authZ -->|sem permissao| deny[403]
\`\`\`

## Por que isso importa

Misturar 401 e 403 é erro clássico de quem veio do frontend. Produto, mobile e logs dependem dessa distinção. Em entrevista, “hash a senha” sem fluxo completo não convence.

## Fluxo JWT (visão prática)

1. Login valida email/senha (senha **hasheada** com bcrypt/argon2 — nunca texto puro)
2. Servidor emite JWT com claims mínimos: \`sub\` (user id), \`role\`, \`exp\`
3. Cliente envia \`Authorization: Bearer ...\`
4. Middleware verifica assinatura/expiração e anexa \`user\` no request
5. Handler checa AuthZ (admin vs member)

**Não coloque** no token: senha, dados sensíveis grandes, PII desnecessária — JWT costuma ser legível em base64 (só a assinatura protege integridade).

## O que quebra se fizer errado

- Senha em texto puro / hash fraco → vazamento catastrófico.
- Claims sensíveis no JWT → qualquer um lê no DevTools.
- Só AuthN sem AuthZ → membro acessa rota de admin.
- 401 quando o usuário está autenticado mas sem permissão → app manda “fazer login” em loop.

## Exemplo um pouco mais rico

\`\`\`ts
// middleware
function requireAuth(req, res, next) {
  const user = verifyBearer(req.headers.authorization)
  if (!user) return res.status(401).json({ error: 'unauthenticated' })
  req.user = user
  next()
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' })
  }
  next()
}
\`\`\``,
          free_text_prompt:
            'Explique autenticação vs autorização com exemplo aluno vs admin numa academia. No fluxo JWT: o que vai no token, o que NÃO deve ir, e quando usar 401 vs 403?',
          code_prompt:
            'canAccess(role, resource): admin acessa tudo; member só "self". Pense como a checagem que o middleware/service faria após AuthN.',
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

Teste é rede de segurança para refatorar e demonstrar qualidade em portfólio. Em Backend, **caminho de erro** importa mais que o feliz: produção é feita de input estranho, timeout e permissão negada.

\`\`\`mermaid
flowchart TB
  e2e[E2E poucos]
  integ[Integracao]
  unit[Unitarios muitos]
  e2e --> integ --> unit
\`\`\`

## Por que isso importa

Entrevista e PR de júnior: “você testou o 400/401/404?”. Um teste de endpoint valida status + body + efeito colateral mínimo — não só \`expect(true)\`.

## Quando mockar (e quando não)

| Mockar | Preferir real / integração |
|---|---|
| Gateway de e-mail, Stripe, HTTP externo | Regra de negócio pura |
| Relógio / UUID se flakiness | SQL crítico (com DB de teste) |
| Dependência lenta/instável | Contrato do seu repository com Postgres |

Mock demais = falso positivo. Zero mock em tudo = suite lenta e frágil.

## O que quebra se fizer errado

- Só testar sucesso → regressão em validação passa despercebida.
- Mockar o próprio código sob teste → teste inútil.
- E2E para tudo → CI lento e flaky; ninguém confia.

## Exemplo um pouco mais rico

\`\`\`ts
it('rejects empty title with 400', async () => {
  const res = await request(app).post('/tasks').send({ title: '  ' })
  expect(res.status).toBe(400)
  expect(res.body.error).toBe('title_required')
})

it('creates task with 201', async () => {
  const res = await request(app).post('/tasks').send({ title: 'Estudar SQL' })
  expect(res.status).toBe(201)
  expect(res.body.id).toBeGreaterThan(0)
})
\`\`\``,
          free_text_prompt:
            'Quando mockar e quando preferir integração real? Por que, em Backend, testar o caminho de erro costuma valer mais que só o caminho feliz? O que um teste de endpoint realmente valida?',
          code_prompt: 'sumPositive(nums) soma apenas números > 0. Pense neste exercício como a unidade que um teste unitário cobriria antes do endpoint.',
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

## Por que isso importa

Em time real (e em entrevista), ninguém lê “update” e “fix”. O PR é o seu cartão de visita: mensagem, tamanho e descrição mostram se você pensa como colega de time.

## O que um revisor espera num PR de júnior

1. **Commits** claros (\`feat(api): add reviews endpoint\`), não \`asdf\`
2. **PR pequeno** o suficiente para revisar em uma sentada
3. **Descrição**: o que mudou, por que, como testar (curl/testes)
4. Sem segredo, sem arquivo \`.env\`, sem 2000 linhas de formatação grátis

## O que quebra se fizer errado

- PR monstro → review superficial ou rejeição.
- Commit que mistura feature + refactor + lint → bisect impossível.
- Zero contexto na descrição → revisor assume o pior.

## Exemplo um pouco mais rico — descrição de PR

\`\`\`md
## O que
Adiciona POST /businesses/:id/reviews com auth obrigatória.

## Por quê
Usuários autenticados precisam avaliar comércios.

## Como testar
- npm test
- curl -H "Authorization: Bearer ..." -d '{"rating":5}' ...

## Notas
Retorna 401 sem token, 404 se business não existe, 400 se rating fora de 1–5.
\`\`\``,
          free_text_prompt:
            'Escreva um commit bom e um ruim para a mesma mudança. Depois, liste o que um revisor espera ver na descrição de um PR de júnior (tamanho, testes, contexto).',
          code_prompt:
            'parseConventionalCommit(msg) → { type, scope, breaking }. Útil para entender o padrão que times esperam nas mensagens.',
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
            {
              id: 'q9',
              prompt:
                'Usuário autenticado (JWT válido) acessa rota admin sem perfil. Status correto:',
              options: [
                { id: 'a', label: '401 — pedir login de novo' },
                { id: 'b', label: '403 — autenticado, sem permissão' },
                { id: 'c', label: '201 — criado com sucesso' },
              ],
              correctOptionId: 'b',
            },
            {
              id: 'q10',
              prompt:
                'PR de júnior com 40 arquivos misturando feature, formatação e .env. Principal problema?',
              options: [
                { id: 'a', label: 'Difícil de revisar, risco de segredo e histórico sujo' },
                { id: 'b', label: 'Falta de Kubernetes no Diff' },
                { id: 'c', label: 'Commits convencionais são proibidos' },
              ],
              correctOptionId: 'a',
            },
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

Mesmo ambiente na sua máquina e no servidor — o clássico **“funciona na minha máquina”** some quando API + Postgres sobem iguais via Compose.

\`\`\`mermaid
flowchart LR
  compose[Compose] --> api[Container API]
  compose --> db[Container DB]
\`\`\`

## Por que isso importa

Imagem = receita empacotada. Container = processo em execução a partir da imagem. Compose resolve a orquestração local: rede, env, dependência \`api\` espera \`db\`, volumes.

## Dockerfile mínimo decente (Node)

\`\`\`dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

## O que quebra se fizer errado

- Copiar \`.env\` com segredo para a imagem → vazamento no registry.
- \`npm install\` em prod sem lock → builds não reproduzíveis.
- API sobe antes do Postgres sem healthcheck → crash loop.

## Exemplo um pouco mais rico — Compose (ideia)

\`\`\`yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://postgres:example@db:5432/app
    depends_on: [db]
\`\`\``,
          free_text_prompt:
            'Explique imagem vs container e por que Compose importa no dia a dia (“funciona na minha máquina”). O que um Dockerfile decente de Node precisa evitar (segredos, dependências)?',
          code_prompt: 'parseEnvLine(line): KEY=VALUE ou null para vazio/#. Útil ao pensar em env de container sem commit de segredo.',
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
          content_md: `## Checklist mínimo — e o que quebra se esquecer

| Item | Se esquecer |
|---|---|
| Build/artefato | Sobe código quebrado ou desatualizado |
| Env / secrets | App sobe sem DB ou com chave errada |
| CORS | “Funciona no curl, morre no browser” |
| Healthcheck | Orquestrador manda tráfego para morto |
| Migrations | Schema drift; 500 em toda query nova |
| Logs | Incidente sem pista |
| HTTPS / domínio | Dados e tokens em claro ou URL errada |

\`\`\`mermaid
flowchart TB
  build[Build] --> env[Env]
  env --> migrate[Migrations]
  migrate --> health[Health]
  health --> live[Producao]
\`\`\`

## Por que isso importa

Deploy não é “botão verde”. É reduzir a chance do primeiro usuário achar o bug que você não testou. Em entrevista, saber o *porquê* de cada item do checklist pesa mais que citar ferramentas.

## O que quebra se fizer errado

- Migration destrutiva sem backup → perda de dados.
- Log com PII/senha → vazamento em ferramenta de log.
- Health que só retorna 200 sem checar DB → “saudável” mentiroso.

## Exemplo um pouco mais rico

\`\`\`ts
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', version: process.env.APP_VERSION ?? 'dev' })
  } catch {
    res.status(503).json({ status: 'degraded', version: process.env.APP_VERSION ?? 'dev' })
  }
})
\`\`\``,
          free_text_prompt:
            'Monte um checklist de go-live com pelo menos 6 itens. Para cada item, diga em uma frase o que quebra em produção se você esquecer.',
          code_prompt: 'healthPayload(ok, version) → status ok|degraded + version. Espelha o contrato que o orquestrador / monitor consome.',
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

API inspirada no AondeTem: businesses + reviews + auth. O portfólio vale pelo que você **explica**, não só pela lista de endpoints.

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

## Por que isso importa

Em entrevista de Backend júnior, vão perguntar: modelagem (por que reviews N:1 com business?), auth (hash, 401/403), erros (404 vs 400), testes e como sobe. Supabase pode hospedar Postgres — você ainda precisa entender as operações.

## O que você deve conseguir explicar (roteiro de entrevista)

1. Por que \`reviews.business_id\` é FK e não texto solto
2. O que acontece no POST review sem token / com business inexistente / rating inválido
3. Onde está a regra de negócio vs o SQL
4. Um teste de erro que você escreveu
5. Como rodar local (Compose) e o que é o healthcheck

## O que quebra se fizer errado

- CRUD sem auth em reviews → spam e abuso.
- Esconder tudo atrás de “magia Supabase” sem saber SQL → trava na entrevista.
- README só com prints → recrutador não vê Backend.

## Exemplo um pouco mais rico — POST review

\`\`\`http
POST /businesses/b1/reviews
Authorization: Bearer <jwt>
{ "rating": 5, "comment": "Ótimo atendimento" }

→ 201 { "id": "...", "rating": 5 }
→ 401 sem token
→ 404 business inexistente
→ 400 rating fora de 1–5
\`\`\``,
          free_text_prompt:
            'Desenhe o fluxo de POST /businesses/:id/reviews (auth, validação, persistência, status codes). Liste 4 decisões do projeto que você saberia defender numa entrevista de Backend júnior.',
          code_prompt: 'normalizeSlug(name): lowercase, espaços→-, remove não alfanuméricos. Contrato típico de campo derivado na API de comércios.',
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

## Por que isso importa

Entrevistas de Backend júnior cobram, de forma recorrente: **HTTP/status**, **SQL (JOIN/índice/transação)**, **auth (401 vs 403, hash)**, **Git/PR**. O ciclo 40min de exercício é onde isso vira músculo — vídeo sozinho não.

## O que quebra se fizer errado

- Só consumir conteúdo → falsa confiança.
- Evitar entrevistas até “100% pronto” → atrasa o diagnóstico das lacunas reais.
- Revisar zero → esquece o que estudou ontem.

## Exemplo um pouco mais rico — amarrando ao mercado

| Fatia | Exemplo alinhado a entrevista |
|---|---|
| 20 conceito | Ler sobre índices / anotar trade-offs |
| 20 exemplos | Reescrever query ruim → boa |
| 40 exercício | Implementar endpoint + teste de 400 |
| 10 revisão | Explicar em voz alta 401 vs 403 |

Candidate-se antes de se sentir 100% pronto. Cada entrevista revela o próximo tópico de estudo.`,
          free_text_prompt:
            'Adapte o ciclo 20/20/40/10 a um dia real seu, conectando cada fatia ao que aparece em entrevistas de Backend júnior (SQL, HTTP, auth, Git). Quais lacunas você atacaria após uma entrevista ruim?',
          code_prompt: 'groupBy(items, keyFn) agrupa em Record<string, T[]>. Útil como exercício de dados — o tipo de manipulação que aparece em services.',
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
            {
              id: 'q9',
              prompt:
                'Você esquece CORS e migrations no go-live. Sintomas mais prováveis?',
              options: [
                { id: 'a', label: 'Browser bloqueia a API; queries novas quebram por schema drift' },
                { id: 'b', label: 'Docker deixa de existir' },
                { id: 'c', label: 'Git rejeita commits convencionais' },
              ],
              correctOptionId: 'a',
            },
            {
              id: 'q10',
              prompt:
                'Na entrevista, pedem para explicar POST /businesses/:id/reviews. O que mais demonstra Seniority júnior sólida?',
              options: [
                { id: 'a', label: 'Listar só os nomes dos endpoints sem status codes' },
                {
                  id: 'b',
                  label: 'Explicar auth, validação, FK, 401/404/400 e um teste de erro',
                },
                { id: 'c', label: 'Dizer que o Supabase elimina a necessidade de Backend' },
              ],
              correctOptionId: 'b',
            },
          ],
          tests: [],
        },
      ],
    },
  ],
}
