# System Architecture - NoTox Label (ROTULIMPO)

> Phase 1 - Brownfield Discovery | @architect (Aria)
> Data: 2026-02-20

## 1. Visao Geral

**Projeto:** NoTox Label - Plataforma de analise de rotulos de alimentos/cosmeticos
**Stack:** React 18 + Vite 5 + Tailwind CSS 3.4 + Supabase + Stripe + Vercel
**URL:** www.notoxlabel.com.br
**Repo:** github.com/brianreisss-star/notoxlabel

## 2. Arquitetura do Sistema

```
[Browser / PWA]
    |
    |--- React SPA (Vite) ---------> Vercel CDN (Static)
    |
    |--- /api/analyze.js ----------> Vercel Edge Function
    |       |--- Claude 3.5 Sonnet (Anthropic API)
    |       |--- GPT-4o (OpenAI API) [fallback]
    |
    |--- /api/checkout.js ---------> Vercel Serverless (Node.js)
    |       |--- Stripe Checkout Session
    |
    |--- /api/webhook.js ----------> Vercel Serverless (Node.js)
    |       |--- Stripe Webhook --> Supabase (Service Role Key)
    |
    |--- supabase.js (client) -----> Supabase REST API
            |--- Auth (email/password, Google OAuth)
            |--- PostgREST (CRUD)
            |--- RPC (deduct_credits, add_xp)
```

## 3. Estrutura de Diretorios

```
ROTULIMPO/
├── api/                    # Vercel serverless functions (3 files)
│   ├── analyze.js          # Edge: proxy para Claude/OpenAI
│   ├── checkout.js         # Node: cria sessao Stripe
│   └── webhook.js          # Node: processa webhooks Stripe
├── src/
│   ├── components/         # 25+ componentes React
│   │   ├── AdminDashboard.jsx
│   │   ├── BlogPage.jsx
│   │   ├── ChatSystem.jsx
│   │   ├── CommunityPage.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── GamificationHub.jsx
│   │   ├── Header.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── OnboardingModal.jsx
│   │   ├── PlansPage.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ReferralProgram.jsx
│   │   ├── ResultPage.jsx
│   │   ├── ScanHistoryPage.jsx
│   │   ├── ScanPage.jsx
│   │   ├── TermsOfUse.jsx
│   │   └── ...
│   ├── context/
│   │   └── UserContext.jsx  # Estado global (auth + perfil + creditos)
│   ├── services/
│   │   └── supabase.js      # Camada de acesso ao banco
│   ├── App.jsx              # Router principal
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globais + Tailwind
├── public/                  # Assets estaticos, manifest PWA
├── docs/                    # Documentacao
├── *.sql                    # 6 arquivos SQL (schema)
├── vite.config.js           # Build config
├── vercel.json              # Deploy config
└── package.json
```

## 4. Roteamento (18+ rotas)

| Rota | Componente | Protegida |
|------|-----------|-----------|
| `/` | LandingPage | Nao |
| `/login` | LoginPage | Nao |
| `/privacidade` | PrivacyPolicy | Nao |
| `/termos` | TermsOfUse | Nao |
| `/scan` | ScanPage | Sim |
| `/resultado` | ResultPage | Sim |
| `/perfil` | ProfilePage | Sim |
| `/historico` | ScanHistoryPage | Sim |
| `/planos` | PlansPage | Sim |
| `/comunidade` | CommunityPage | Sim |
| `/chat` | ChatSystem | Sim |
| `/blog` | BlogPage | Sim |
| `/gamificacao` | GamificationHub | Sim |
| `/indicacao` | ReferralProgram | Sim |
| `/admin` | AdminDashboard | Sim (admin) |
| `/pagamento/sucesso` | PaymentSuccess | Sim |
| `/pagamento/cancelado` | PaymentCancelled | Sim |

## 5. Gerenciamento de Estado

- **Unico Context:** `UserContext` gerencia tudo (auth, perfil, creditos, gamificacao, historico)
- **Persistencia:** localStorage para cache de usuario
- **Sem state management lib** (Redux, Zustand, etc.)

## 6. Integracao com APIs Externas

| Servico | Uso | Runtime |
|---------|-----|---------|
| Anthropic Claude 3.5 | Analise principal de rotulos | Edge Function |
| OpenAI GPT-4o | Fallback de analise | Edge Function |
| Stripe | Pagamentos (3 planos) | Serverless |
| Supabase | Auth + DB + Storage | Client-side |
| Vercel | Hosting + Functions | - |

## 7. Variaveis de Ambiente

| Variavel | Onde | Tipo |
|----------|------|------|
| `VITE_SUPABASE_URL` | Frontend | Publica |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Publica |
| `ANTHROPIC_API_KEY` | Backend (Edge) | Secreta |
| `OPENAI_API_KEY` | Backend (Edge) | Secreta |
| `STRIPE_SECRET_KEY` | Backend (Node) | Secreta |
| `STRIPE_WEBHOOK_SECRET` | Backend (Node) | Secreta |
| `SUPABASE_URL` | Backend (Node) | Secreta |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend (Node) | Secreta |
| `NEXT_PUBLIC_URL` | Backend | Config |

## 8. Padroes Identificados

- **Optimistic UI:** Updates no client antes de confirmar no servidor
- **Image caching:** Cache de analises no localStorage
- **Provider switching:** Claude como primario, GPT-4o como fallback
- **Gamificacao:** XP, niveis, badges, streak system
- **PWA:** Service worker registrado, manifest completo

## 9. Problemas Arquiteturais

| # | Severidade | Problema |
|---|-----------|----------|
| 1 | CRITICO | Credenciais (.credentials.md) commitadas no repositorio |
| 2 | CRITICO | Admin bypass hardcoded (admin@notoxlabel.com.br / admin123) |
| 3 | CRITICO | /api/analyze sem autenticacao JWT |
| 4 | CRITICO | Supabase URL/Key overridable via localStorage |
| 5 | ALTO | .env com chaves commitado no git |
| 6 | ALTO | Sem input sanitization (XSS risk) |
| 7 | ALTO | Chat polling 5s em vez de Realtime |
| 8 | ALTO | N+1 queries em getConversations() |
| 9 | MEDIO | Sem code splitting / lazy loading |
| 10 | MEDIO | UserContext monolitico (God Context) |
| 11 | MEDIO | Sem migration framework para DB |
| 12 | BAIXO | Recharts bundled desnecessariamente em todas as paginas |
