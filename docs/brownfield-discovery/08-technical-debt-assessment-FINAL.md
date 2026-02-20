# Technical Debt Assessment - FINAL

> Phase 8 - Brownfield Discovery | @architect (Aria)
> Data: 2026-02-20 | QA Gate: APPROVED

---

## Projeto: NoTox Label (ROTULIMPO)
**URL:** www.notoxlabel.com.br
**Stack:** React 18 + Vite 5 + Tailwind 3.4 + Supabase + Stripe + Vercel
**Repo:** github.com/brianreisss-star/notoxlabel

---

## Score de Saude Final

| Dimensao | Score | Status |
|----------|-------|--------|
| Seguranca | 3/10 | CRITICO |
| Database | 4/10 | ALTO |
| Performance | 5/10 | MEDIO |
| Arquitetura | 5/10 | MEDIO |
| UX/Design | 8/10 | BOM |
| Acessibilidade | 4/10 | ALTO |
| SEO | 3/10 | ALTO |
| Testes | 2/10 | CRITICO |
| **GERAL** | **4.3/10** | **REQUER ATENCAO IMEDIATA** |

---

## Catalogo Completo de Divida Tecnica (38 itens)

### CRITICO (5 itens) - Bloqueia producao segura

| ID | Categoria | Debito | Esforco |
|----|-----------|--------|---------|
| TD-01 | Seguranca | Credenciais commitadas no Git (.credentials.md, .env) | 2h |
| TD-02 | Seguranca | Admin bypass hardcoded (admin@notoxlabel.com.br / admin123) | 1h |
| TD-03 | Seguranca | /api/analyze sem autenticacao JWT | 4h |
| TD-04 | Seguranca | Supabase config override via localStorage | 1h |
| TD-05 | Seguranca | Sem sanitizacao de input (XSS em chat/community/blog) | 8h |

### ALTO (13 itens) - Impacta escalabilidade e compliance

| ID | Categoria | Debito | Esforco |
|----|-----------|--------|---------|
| TD-06 | Database | 6 indexes faltando | 2h |
| TD-07 | Database | Sem migration framework | 8h |
| TD-08 | Database | Schemas duplicados/conflitantes entre 6 arquivos SQL | 4h |
| TD-09 | Database | Colunas fantasma (usadas no codigo, ausentes no SQL) | 2h |
| TD-10 | Database | Sem tabela de transacoes (audit trail de pagamentos) | 4h |
| TD-11 | Performance | Chat polling 5s (deveria ser Supabase Realtime) | 8h |
| TD-12 | Performance | N+1 queries em getConversations() (21 req/10 conversas) | 4h |
| TD-13 | Performance | Sem paginacao em mensagens de chat | 4h |
| TD-14 | Frontend | Sem code splitting / lazy loading | 4h |
| TD-15 | UX | Resultado de scan via state (perde ao reload) | 4h |
| TD-20 | SEO | SPA sem SSR, sem sitemap, sem robots.txt | 8h |
| TD-21 | Acessibilidade | user-scalable=no, sem ARIA, sem focus indicators | 8h |
| TD-DB-01 | Database | deduct_credits nao valida credits >= amount | 2h |

### MEDIO (14 itens) - Impacta qualidade e manutencao

| ID | Categoria | Debito | Esforco |
|----|-----------|--------|---------|
| TD-16 | Arquitetura | UserContext monolitico (God Context) | 16h |
| TD-17 | UX | alert() para erros (deveria ser toast system) | 4h |
| TD-18 | UX | Comments UI existe mas nao funciona no backend | 4h |
| TD-19 | Database | likes_count sem trigger (drift de contadores) | 2h |
| TD-22 | Frontend | Sem validacao de formularios | 4h |
| TD-23 | Dados | Cupons hardcoded no codigo | 2h |
| TD-DB-02 | Database | Sem backup strategy documentada | 2h |
| TD-DB-03 | Database | JSONB em scan_history sem schema validation | 2h |
| TD-DB-04 | Database | Sem soft delete em nenhuma tabela | 4h |
| TD-DB-05 | Database | FK cascade policies nao auditadas | 2h |
| TD-UX-02 | Frontend | Imagens sem lazy loading nativo | 1h |
| TD-UX-03 | UX | Sem skeleton screens | 4h |
| TD-UX-05 | UX | Sem onboarding tour para novos usuarios | 8h |
| TD-UX-06 | Frontend | Recharts sem responsive container em mobile | 2h |

### BAIXO (6 itens) - Nice-to-have

| ID | Categoria | Debito | Esforco |
|----|-----------|--------|---------|
| TD-24 | Performance | Recharts bundled globalmente | 2h |
| TD-25 | PWA | Offline nao funcional | 16h |
| TD-26 | PWA | Sem push notifications | 16h |
| TD-27 | UX | Sem loading skeletons avancados | 4h |
| TD-UX-01 | UX | Sem dark/light mode toggle | 4h |
| TD-UX-04 | UX | Bottom nav sem feedback haptico | 2h |

---

## Resumo de Esforco

| Prioridade | Itens | Esforco | % do Total |
|-----------|-------|---------|-----------|
| CRITICO | 5 | ~16h | 8.6% |
| ALTO | 13 | ~62h | 33.5% |
| MEDIO | 14 | ~56h | 30.3% |
| BAIXO | 6 | ~44h | 23.8% |
| **TOTAL** | **38** | **~185h** | **100%** |

---

## Plano de Execucao em Sprints

### Sprint 1: SEGURANCA (URGENTE) — 2 dias
**Objetivo:** Eliminar todas as vulnerabilidades criticas

1. Remover `.credentials.md` do repositorio
2. Adicionar `.credentials.md` e `.env` ao `.gitignore`
3. Rotate TODAS as keys (Supabase, Stripe, Anthropic, OpenAI)
4. Remover admin bypass hardcoded em `supabase.js`
5. Remover localStorage override de Supabase config
6. Adicionar JWT verification no `/api/analyze`
7. Implementar sanitizacao basica de inputs (DOMPurify)
8. Adicionar CSP headers no `vercel.json`

### Sprint 2: DATABASE FOUNDATION — 5 dias
**Objetivo:** Governanca de schema e performance

1. Instalar Supabase CLI e inicializar migrations
2. Consolidar 6 arquivos SQL em migration inicial
3. Adicionar colunas faltantes (subscription_plan, evolution, etc.)
4. Criar 6 indexes de performance
5. Criar tabela `transactions` para auditoria
6. Adicionar trigger para likes_count
7. Corrigir deduct_credits com validacao
8. Configurar backup strategy

### Sprint 3: PERFORMANCE & FRONTEND — 5 dias
**Objetivo:** Escalabilidade e experiencia do usuario

1. Implementar React.lazy + Suspense (code splitting)
2. Migrar chat para Supabase Realtime
3. Resolver N+1 em getConversations (JOIN/view)
4. Implementar paginacao em mensagens
5. Persistir resultado de scan (URL params ou DB)
6. Adicionar lazy loading de imagens
7. Implementar toast notification system

### Sprint 4: QUALIDADE & COMPLIANCE — 5 dias
**Objetivo:** Acessibilidade, SEO e robustez

1. Remover user-scalable=no
2. Adicionar ARIA labels e focus indicators
3. Gerar sitemap.xml e robots.txt
4. Adicionar meta tags dinamicas
5. Implementar ou remover Comments feature
6. Adicionar form validation
7. Mover cupons para o banco de dados
8. Refatorar UserContext (split em auth/profile/gamification)

### Sprint 5: POLISH (opcional) — 5 dias
**Objetivo:** Refinamento e features avancadas

1. Skeleton screens
2. Onboarding tour
3. Otimizar bundle Recharts
4. PWA offline support
5. Push notifications
6. Dark/light mode toggle
