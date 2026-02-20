# Database Audit - NoTox Label (ROTULIMPO)

> Phase 2 - Brownfield Discovery | @data-engineer (Dara)
> Data: 2026-02-20

## 1. Inventario de Tabelas

| # | Tabela | Proposito | Estimativa |
|---|--------|-----------|------------|
| 1 | `profiles` | Perfis, gamificacao, assinatura | ~1.000 |
| 2 | `scan_history` | Resultados de analise (JSONB) | ~10.000-50.000 |
| 3 | `posts` | Posts da comunidade | ~5.000 |
| 4 | `post_likes` | Likes (composite PK) | ~20.000 |
| 5 | `comments` | Comentarios (EXISTE no SQL, NAO USADO no codigo) | 0 |
| 6 | `conversations` | Salas de chat | ~1.000 |
| 7 | `conversation_participants` | Membros do chat (composite PK) | ~2.000 |
| 8 | `messages` | Mensagens de chat | ~10.000-100.000 |
| 9 | `blog_posts` | Artigos gerados por IA | ~100 |
| 10 | `auth.users` | Supabase Auth (gerenciado) | ~1.000 |

## 2. Funcoes RPC

```sql
-- Deducao atomica de creditos com row locking
deduct_credits(amount INTEGER) RETURNS void

-- Adicao de XP com calculo automatico de nivel
add_xp(amount INTEGER) RETURNS void
```

## 3. Indexes Existentes (apenas 2)

```sql
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_participants_user ON conversation_participants(user_id);
```

## 4. RLS Policies

- 20+ policies definidas nas tabelas
- Cobertura: profiles, scan_history, posts, post_likes, conversations, messages, blog_posts

## 5. PROBLEMAS CRITICOS

### 5.1 Seguranca

| # | Severidade | Problema | Local |
|---|-----------|----------|-------|
| S1 | CRITICO | Admin bypass hardcoded | `src/services/supabase.js:99-103` |
| S2 | CRITICO | /api/analyze sem autenticacao JWT | `api/analyze.js` |
| S3 | CRITICO | Supabase config override via localStorage | `src/services/supabase.js:8-9` |
| S4 | CRITICO | Sem input sanitization (XSS) | Chat, posts, blog |
| S5 | ALTO | Chat creation sem autorizacao | `createConversation()` |
| S6 | ALTO | likes_count drift (sem trigger) | `posts` table |
| S7 | ALTO | Comments table existe mas nao e usada | `COMMUNITY_SCHEMA.sql` |
| S8 | ALTO | Admin queries sem RLS admin policy | `AdminDashboard.jsx` |

### 5.2 Performance

| # | Problema | Impacto | Solucao |
|---|---------|---------|---------|
| P1 | 6 indexes faltando | Queries lentas em tabelas grandes | Criar indexes |
| P2 | Sem paginacao em messages | Memoria ilimitada | Cursor pagination |
| P3 | Chat polling 5s | Carga desnecessaria no servidor | Supabase Realtime |
| P4 | N+1 em getConversations() | 21 requests para 10 conversas | JOIN ou view |

### 5.3 Indexes Recomendados

```sql
CREATE INDEX idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX idx_scan_history_created_at ON scan_history(created_at DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

## 6. Inconsistencias de Schema

### 6.1 Definicoes Duplicadas Entre Arquivos

| Tabela | Arquivos | Conflito |
|--------|----------|----------|
| `profiles` | supabase_schema.sql, FULL_DB_SETUP.sql | Colunas diferentes (is_professional, referral_code, onboarding_completed) |
| `blog_posts` | BLOG_CHAT_SCHEMA.sql, FULL_DB_SETUP.sql | Colunas incompativeis (summary vs excerpt, content_markdown vs slug) |
| `conversations` | 3 arquivos | Colunas ligeiramente diferentes |
| `messages` | 2 arquivos | `read` vs `is_read` |

### 6.2 Colunas Fantasma (usadas no codigo, ausentes no SQL)

| Coluna | Tabela | Onde e usada |
|--------|--------|-------------|
| `subscription_plan` | profiles | UserContext, webhook.js |
| `evolution` | profiles | UserContext.jsx |
| `clean_habit_score` | profiles | UserContext.jsx |

### 6.3 Dados Hardcoded (deviam estar no banco)

```javascript
// UserContext.jsx - Cupons hardcoded
const validCoupons = {
  'HEALTHY50': { credits: 50, plan: 'free' },
  'BIOHACKER_PRO': { credits: 100, plan: 'pro' },
  'INFLUENCER_999': { credits: 999, plan: 'pro' }
};
```

### 6.4 Tabela Faltando

- **`transactions`** - Nao ha log de pagamentos. Stripe webhook atualiza profiles diretamente sem auditoria.

## 7. Sem Migration Framework

- 6 arquivos SQL standalone (paste no SQL Editor)
- Sem versionamento
- Sem rollback
- Conflito entre `CREATE TABLE` e `CREATE TABLE IF NOT EXISTS`
- Ordem de execucao importa (foreign keys) mas nao esta documentada

## 8. Diagrama de Relacionamentos

```
auth.users (Supabase managed)
    |
    |--- 1:1 --- profiles (user_id FK)
    |                |
    |                |--- 1:N --- scan_history (user_id FK)
    |                |--- 1:N --- posts (user_id FK)
    |                |              |--- 1:N --- post_likes (post_id FK, user_id FK)
    |                |              |--- 1:N --- comments (post_id FK) [NAO USADO]
    |                |
    |                |--- N:M --- conversations (via conversation_participants)
    |                               |--- 1:N --- messages (conversation_id FK)
    |
    |--- blog_posts (sem FK para users - standalone)
```

## 9. Recomendacoes Priorizadas

1. **URGENTE:** Remover admin bypass hardcoded
2. **URGENTE:** Adicionar JWT auth no /api/analyze
3. **ALTO:** Criar migration framework (supabase migration)
4. **ALTO:** Consolidar schemas em arquivo unico e versionado
5. **ALTO:** Adicionar 6 indexes faltantes
6. **MEDIO:** Criar tabela `transactions` para auditoria
7. **MEDIO:** Implementar trigger para likes_count
8. **MEDIO:** Implementar paginacao em mensagens
9. **MEDIO:** Migrar chat polling para Supabase Realtime
10. **BAIXO:** Resolver N+1 em getConversations()
