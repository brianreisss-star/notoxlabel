# Technical Debt Assessment - DRAFT

> Phase 4 - Brownfield Discovery | @architect (Aria)
> Data: 2026-02-20

## Resumo Executivo

O projeto NoTox Label apresenta um MVP funcional e online com boa qualidade visual, porem carrega **divida tecnica significativa** em seguranca, banco de dados e arquitetura frontend. A prioridade imediata deve ser corrigir as **4 vulnerabilidades criticas de seguranca** antes de qualquer nova feature.

---

## Classificacao de Divida Tecnica

### CRITICA (Bloqueia producao segura)

| ID | Categoria | Debito | Esforco | Risco se Ignorado |
|----|-----------|--------|---------|-------------------|
| TD-01 | Seguranca | Credenciais commitadas no Git (.credentials.md, .env) | 2h | Comprometimento total da plataforma |
| TD-02 | Seguranca | Admin bypass hardcoded (admin123) | 1h | Acesso admin nao autorizado |
| TD-03 | Seguranca | /api/analyze sem autenticacao JWT | 4h | Abuso ilimitado das APIs Claude/OpenAI (custo $$$) |
| TD-04 | Seguranca | Supabase config override via localStorage | 1h | Redirect para backend malicioso |
| TD-05 | Seguranca | Sem sanitizacao de input (XSS) | 8h | Cross-site scripting em chat/community |

### ALTA (Impacta escalabilidade e confiabilidade)

| ID | Categoria | Debito | Esforco | Risco se Ignorado |
|----|-----------|--------|---------|-------------------|
| TD-06 | Database | 6 indexes faltando | 2h | Degradacao de performance com crescimento |
| TD-07 | Database | Sem migration framework | 8h | Schemas dessincronizados, deploys arriscados |
| TD-08 | Database | Schema duplicados/conflitantes entre 6 arquivos SQL | 4h | Bugs silenciosos, dados inconsistentes |
| TD-09 | Database | Colunas fantasma (usadas no codigo, ausentes no SQL) | 2h | Falhas silenciosas em novos deploys |
| TD-10 | Database | Sem tabela de transacoes (audit trail) | 4h | Impossivel auditar pagamentos |
| TD-11 | Performance | Chat polling 5s (deveria ser Realtime) | 8h | Carga desnecessaria no servidor |
| TD-12 | Performance | N+1 queries em getConversations() | 4h | 21 requests por 10 conversas |
| TD-13 | Performance | Sem paginacao em mensagens | 4h | OOM em conversas longas |
| TD-14 | Frontend | Sem code splitting / lazy loading | 4h | Bundle grande, carregamento lento |
| TD-15 | UX | Resultado de scan via state (perde ao reload) | 4h | Perda de dados do usuario |

### MEDIA (Impacta qualidade e manutencao)

| ID | Categoria | Debito | Esforco | Risco se Ignorado |
|----|-----------|--------|---------|-------------------|
| TD-16 | Arquitetura | UserContext monolitico (God Context) | 16h | Dificil de manter e testar |
| TD-17 | UX | alert() para erros (deveria ser toast) | 4h | UX pobre |
| TD-18 | UX | Comments UI existe mas nao funciona | 4h | Confusao do usuario |
| TD-19 | Database | likes_count sem trigger (drift) | 2h | Contadores incorretos |
| TD-20 | SEO | SPA sem SSR, sem sitemap, sem robots.txt | 8h | Invisivel para Google |
| TD-21 | Acessibilidade | user-scalable=no, sem ARIA, sem focus | 8h | Exclui usuarios com deficiencia |
| TD-22 | Frontend | Sem validacao de formularios | 4h | Dados invalidos no banco |
| TD-23 | Dados | Cupons hardcoded no codigo | 2h | Impossivel gerenciar cupons |

### BAIXA (Nice-to-have)

| ID | Categoria | Debito | Esforco |
|----|-----------|--------|---------|
| TD-24 | Performance | Recharts bundled globalmente | 2h |
| TD-25 | PWA | Offline nao funcional | 16h |
| TD-26 | PWA | Sem push notifications | 16h |
| TD-27 | UX | Sem loading skeletons | 4h |

---

## Metricas Consolidadas

| Metrica | Valor |
|---------|-------|
| Total de debitos identificados | 27 |
| Criticos (bloqueia producao segura) | 5 |
| Altos (impacta escalabilidade) | 10 |
| Medios (impacta qualidade) | 8 |
| Baixos (nice-to-have) | 4 |
| Esforco total estimado | ~150h |
| Esforco CRITICO (obrigatorio) | ~16h |
| Esforco ALTO (recomendado) | ~44h |

---

## Score de Saude do Projeto

| Dimensao | Score (1-10) | Nota |
|----------|-------------|------|
| Seguranca | 3/10 | Vulnerabilidades criticas abertas |
| Performance | 5/10 | Funcional mas nao escalavel |
| Manutencao | 4/10 | Context monolitico, schemas duplicados |
| UX/Design | 8/10 | Visual excelente, UX com gaps |
| Acessibilidade | 4/10 | Muitas lacunas basicas |
| SEO | 3/10 | SPA puro, sem otimizacao |
| Database | 4/10 | Funcional mas sem governanca |
| **GERAL** | **4.4/10** | **MVP funcional com riscos serios** |

---

## Plano de Acao Recomendado

### Sprint 1 - Seguranca (URGENTE - 1-2 dias)
- [ ] TD-01: Remover credenciais do Git + rotate keys
- [ ] TD-02: Remover admin bypass
- [ ] TD-03: Adicionar JWT auth no /api/analyze
- [ ] TD-04: Remover localStorage override de Supabase config
- [ ] TD-05: Implementar sanitizacao de input

### Sprint 2 - Database Foundation (3-5 dias)
- [ ] TD-06: Criar 6 indexes faltantes
- [ ] TD-07: Setup Supabase migrations
- [ ] TD-08: Consolidar schemas
- [ ] TD-09: Adicionar colunas fantasma ao schema
- [ ] TD-10: Criar tabela transactions

### Sprint 3 - Performance & UX (5-7 dias)
- [ ] TD-11: Migrar chat para Realtime
- [ ] TD-12: Resolver N+1 em conversations
- [ ] TD-13: Implementar paginacao
- [ ] TD-14: Code splitting com React.lazy
- [ ] TD-15: Persistir resultado de scan

### Sprint 4 - Qualidade (5-7 dias)
- [ ] TD-16 a TD-23: Melhorias de arquitetura e UX

### Sprint 5 - Polish (opcional)
- [ ] TD-24 a TD-27: Otimizacoes e PWA
