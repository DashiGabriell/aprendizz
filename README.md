# Aprendizz

LMS simples para estudar o plano de Backend (Node.js + TypeScript) da discussão em `ideia.md`, uma aula por vez, com exercício de fixação: **MCQ**, **texto livre (corrigido por IA)** e **código executável** quando a aula ensina programação.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Supabase Auth (herdado do projeto compartilhado)
- Tabelas prefixadas `aprendizz_*`

## Setup

1. Node 20+
2. Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
API_KEY_OPENROUTER=your-openrouter-key
```

Para seed/migrations locais, mantenha também `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_SECRET` e `SUPABASE_TOKEN`.

3. Instale e rode:

```bash
npm install
npm run dev
```

4. Schema em `supabase/migrations/`. Para reaplicar o conteúdo:

```bash
npm run seed
```

## Uso

1. Acesse `/login` com o usuário do Auth compartilhado
2. Siga o roadmap — só a primeira aula começa liberada
3. Em cada aula: estude o markdown e complete MCQ (100%) + texto (IA) + testes de código (se a aula ensinar código)
4. Ao concluir, a próxima aula destrava

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm test` | Vitest (grade/unlock) |
| `npm run seed` | Upsert das 17 aulas no Supabase |

## Deploy na Vercel (preparado, ainda não publicado)

O repo já inclui `vercel.json` com:

- Framework Vite / output `dist`
- Rewrite SPA (`/*` → `/index.html`) para React Router

### Quando for publicar

1. Importe o repositório `DashiGabriell/aprendizz` no dashboard da Vercel
2. Framework Preset: **Vite** (ou deixe auto-detect)
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Node.js: **20.x**
6. Environment Variables (Production + Preview):

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon/public key |
| `API_KEY_OPENROUTER` | chave OpenRouter (correção de texto) |

7. No Supabase → Authentication → URL Configuration, adicione as URLs da Vercel em **Site URL** e **Redirect URLs** (ex.: `https://aprendizz.vercel.app/**`)

Não rode `vercel deploy` até decidir publicar. O diretório `.vercel` está no `.gitignore`.

## Documentação de domínio

- `CONTEXT.md` — glossário
- `docs/adr/` — decisões
- `.agents/` — skills Matt Pocock
