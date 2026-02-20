# Epic: Remediacao de Divida Tecnica - NoTox Label

> Phase 10 - Brownfield Discovery | @pm (Morgan)
> Data: 2026-02-20

---

## Epic ID: NOTOX-EPIC-001
## Titulo: Remediacao de Divida Tecnica e Hardening do NoTox Label
## Status: Ready for Execution

---

## Contexto

Brownfield Discovery completado com 38 debitos tecnicos identificados em 10 fases de analise por 5 agentes especializados. Este epic organiza a remediacao em stories executaveis, priorizadas por risco e impacto.

---

## Stories

### Story 1.1: Remover Credenciais Expostas e Rotate Keys
**Prioridade:** CRITICA | **Esforco:** 2h | **Sprint:** 1

**Descricao:** Credenciais de producao (Supabase Service Role Key, Google OAuth Secret, API keys) estao commitadas no repositorio Git. Remover os arquivos, adicionar ao .gitignore, e rotacionar todas as chaves comprometidas.

**Acceptance Criteria:**
- [ ] `.credentials.md` removido do tracking do Git
- [ ] `.env` removido do tracking do Git
- [ ] Ambos adicionados ao `.gitignore`
- [ ] Historico do Git limpo com BFG/git-filter-repo
- [ ] TODAS as keys rotacionadas: Supabase, Stripe, Anthropic, OpenAI
- [ ] Novas keys configuradas nas env vars da Vercel
- [ ] App funcionando normalmente apos rotacao

**Debitos resolvidos:** TD-01

---

### Story 1.2: Remover Admin Bypass e Corrigir Autenticacao
**Prioridade:** CRITICA | **Esforco:** 3h | **Sprint:** 1

**Descricao:** Existe um bypass hardcoded que permite login de admin com senha "admin123" sem autenticacao Supabase. Remover completamente e implementar role-based access via Supabase.

**Acceptance Criteria:**
- [ ] Admin bypass removido de `supabase.js`
- [ ] Coluna `role` adicionada a tabela `profiles` (default: 'user')
- [ ] Admin check via query ao banco (nao hardcoded)
- [ ] AdminDashboard protegido por role check real
- [ ] localStorage override de Supabase config removido

**Debitos resolvidos:** TD-02, TD-04

---

### Story 1.3: Proteger API de Analise com JWT
**Prioridade:** CRITICA | **Esforco:** 4h | **Sprint:** 1

**Descricao:** O endpoint `/api/analyze` aceita requests de qualquer origem sem autenticacao. Qualquer pessoa pode consumir creditos Claude/OpenAI. Adicionar verificacao de JWT do Supabase.

**Acceptance Criteria:**
- [ ] `/api/analyze` valida JWT do Supabase no header Authorization
- [ ] Requests sem token valido retornam 401
- [ ] Frontend envia access_token nas requests
- [ ] Rate limiting basico implementado (ex: 10 req/min por usuario)
- [ ] Endpoint `/api/checkout` tambem protegido

**Debitos resolvidos:** TD-03

---

### Story 1.4: Implementar Sanitizacao de Input (XSS)
**Prioridade:** CRITICA | **Esforco:** 8h | **Sprint:** 1

**Descricao:** Inputs de usuarios (chat, posts, comments) sao armazenados sem sanitizacao, criando vetores de XSS. Implementar sanitizacao com DOMPurify e CSP headers.

**Acceptance Criteria:**
- [ ] DOMPurify instalado e aplicado em todos os inputs de usuario
- [ ] Posts da comunidade sanitizados antes de salvar
- [ ] Mensagens de chat sanitizadas antes de salvar
- [ ] Blog content sanitizado na renderizacao
- [ ] CSP headers adicionados no `vercel.json`
- [ ] Nenhum uso de `dangerouslySetInnerHTML` sem sanitizacao

**Debitos resolvidos:** TD-05

---

### Story 2.1: Implementar Migration Framework
**Prioridade:** ALTA | **Esforco:** 8h | **Sprint:** 2

**Descricao:** Os 6 arquivos SQL sao standalone e conflitantes. Consolidar em Supabase migrations versionadas.

**Acceptance Criteria:**
- [ ] Supabase CLI configurado no projeto
- [ ] Migration inicial criada com schema consolidado
- [ ] Todas as tabelas, RLS policies, indexes e functions em migrations
- [ ] Colunas fantasma adicionadas (subscription_plan, evolution, clean_habit_score)
- [ ] Arquivos SQL antigos movidos para `docs/legacy-sql/`
- [ ] README com instrucoes de setup do banco

**Debitos resolvidos:** TD-07, TD-08, TD-09

---

### Story 2.2: Otimizar Performance do Banco
**Prioridade:** ALTA | **Esforco:** 8h | **Sprint:** 2

**Descricao:** Adicionar indexes faltantes, criar tabela de transacoes, e corrigir integridade de dados.

**Acceptance Criteria:**
- [ ] 6 indexes criados via migration
- [ ] Tabela `transactions` criada (Stripe payment audit trail)
- [ ] Webhook atualizado para logar transacoes
- [ ] Trigger para `likes_count` sincronizado com `post_likes`
- [ ] `deduct_credits` validando credits >= amount
- [ ] Backup strategy documentada

**Debitos resolvidos:** TD-06, TD-10, TD-19, TD-DB-01, TD-DB-02

---

### Story 3.1: Otimizar Performance Frontend
**Prioridade:** ALTA | **Esforco:** 8h | **Sprint:** 3

**Descricao:** Implementar code splitting, lazy loading e otimizar bundle.

**Acceptance Criteria:**
- [ ] React.lazy + Suspense em todas as rotas
- [ ] Recharts carregado sob demanda (apenas onde usado)
- [ ] Imagens com loading="lazy"
- [ ] Bundle size reduzido em pelo menos 40%
- [ ] Lighthouse Performance score >= 70

**Debitos resolvidos:** TD-14, TD-24, TD-UX-02

---

### Story 3.2: Migrar Chat para Tempo Real
**Prioridade:** ALTA | **Esforco:** 12h | **Sprint:** 3

**Descricao:** Substituir polling de 5s por Supabase Realtime subscriptions. Resolver N+1 e adicionar paginacao.

**Acceptance Criteria:**
- [ ] Chat usa Supabase Realtime (subscribe on INSERT)
- [ ] Polling de 5s removido
- [ ] getConversations usa JOIN (1 query em vez de 21)
- [ ] Mensagens paginadas (50 por pagina, cursor-based)
- [ ] Indicador de "digitando..." (opcional)

**Debitos resolvidos:** TD-11, TD-12, TD-13

---

### Story 3.3: Corrigir Persistencia de Resultado
**Prioridade:** ALTA | **Esforco:** 4h | **Sprint:** 3

**Descricao:** Resultado de scan e passado via React state e perdido ao recarregar a pagina. Persistir no banco ou URL.

**Acceptance Criteria:**
- [ ] Resultado salvo em scan_history antes de navegar
- [ ] ResultPage carrega via scan_history_id da URL
- [ ] Funciona ao recarregar a pagina
- [ ] Link compartilhavel para resultados

**Debitos resolvidos:** TD-15

---

### Story 4.1: Implementar Acessibilidade Basica
**Prioridade:** ALTA | **Esforco:** 8h | **Sprint:** 4

**Descricao:** Conformidade basica com Lei 13.146/2015 (Lei Brasileira de Inclusao).

**Acceptance Criteria:**
- [ ] `user-scalable=no` removido do viewport
- [ ] ARIA labels em todos os botoes e links de acao
- [ ] Focus indicators visiveis em todos os elementos interativos
- [ ] Semantic HTML (section, article, nav, main, aside)
- [ ] Alt text em todas as imagens
- [ ] Lighthouse Accessibility score >= 80

**Debitos resolvidos:** TD-21

---

### Story 4.2: Implementar SEO Basico
**Prioridade:** ALTA | **Esforco:** 8h | **Sprint:** 4

**Descricao:** O SPA e invisivel para busca organica. Implementar SEO basico.

**Acceptance Criteria:**
- [ ] sitemap.xml gerado e acessivel
- [ ] robots.txt configurado
- [ ] Meta tags dinamicas por rota (react-helmet ou similar)
- [ ] Open Graph tags dinamicas
- [ ] Structured data (JSON-LD) para a landing page
- [ ] Pre-rendering ou SSG para paginas publicas (opcional)

**Debitos resolvidos:** TD-20

---

### Story 4.3: Melhorar UX (Toast, Forms, Comments)
**Prioridade:** MEDIA | **Esforco:** 12h | **Sprint:** 4

**Descricao:** Substituir alert() por toast system, adicionar form validation, e resolver feature de comments.

**Acceptance Criteria:**
- [ ] Toast notification system implementado (react-hot-toast ou similar)
- [ ] Todos os alert() substituidos por toasts
- [ ] Form validation inline em login, scan, profile
- [ ] Comments feature implementada no backend OU UI removida
- [ ] Cupons movidos para tabela no banco de dados

**Debitos resolvidos:** TD-17, TD-18, TD-22, TD-23

---

### Story 4.4: Refatorar UserContext
**Prioridade:** MEDIA | **Esforco:** 16h | **Sprint:** 4

**Descricao:** UserContext e monolitico (God Context). Separar em contextos menores.

**Acceptance Criteria:**
- [ ] AuthContext: login, logout, session management
- [ ] ProfileContext: dados do perfil, creditos, assinatura
- [ ] GamificationContext: XP, niveis, badges, streaks
- [ ] Cada contexto com seu proprio provider
- [ ] Testes para cada contexto

**Debitos resolvidos:** TD-16

---

## Resumo do Epic

| Sprint | Stories | Esforco | Foco |
|--------|---------|---------|------|
| Sprint 1 | 1.1, 1.2, 1.3, 1.4 | ~17h | SEGURANCA |
| Sprint 2 | 2.1, 2.2 | ~16h | DATABASE |
| Sprint 3 | 3.1, 3.2, 3.3 | ~24h | PERFORMANCE |
| Sprint 4 | 4.1, 4.2, 4.3, 4.4 | ~44h | QUALIDADE |
| **Total** | **13 stories** | **~101h** | — |

*Nota: As ~84h restantes dos 185h totais correspondem a itens de prioridade BAIXA que podem ser tratados em sprints futuros conforme necessidade.*

---

## Dependencias Entre Stories

```
Story 1.1 (credentials) → TODAS as outras (keys precisam funcionar)
Story 2.1 (migrations) → Story 2.2 (DB optimization precisa de migrations)
Story 3.2 (chat realtime) → depende de Story 2.2 (indexes)
Story 4.4 (refactor context) → independente, pode ser paralela
```

---

## Proximos Passos

1. **IMEDIATO:** Executar Story 1.1 (remover credenciais) — risco ativo
2. **Dia 1-2:** Completar Sprint 1 inteiro (seguranca)
3. **Semana 1:** Sprint 2 (database foundation)
4. **Semana 2:** Sprint 3 (performance)
5. **Semana 3:** Sprint 4 (qualidade)

---

*Epic gerado por Synkra AIOS - Brownfield Discovery Workflow*
*@pm (Morgan) | Baseado em assessment de @architect, @data-engineer, @ux-design-expert, @qa, @analyst*
