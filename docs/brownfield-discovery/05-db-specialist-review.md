# Database Specialist Review

> Phase 5 - Brownfield Discovery | @data-engineer (Dara)
> Data: 2026-02-20

## Parecer Tecnico

Reviso o draft de divida tecnica (Phase 4) sob a otica de banco de dados.

### Concordancias

Todos os itens de database no draft estao corretos e bem classificados:
- **TD-06 a TD-10**: Confirmados. A falta de indexes e migration framework sao os maiores riscos de escalabilidade.
- **TD-19**: Trigger para likes_count e essencial para integridade.

### Adicoes ao Draft

| ID | Problema | Severidade | Recomendacao |
|----|---------|-----------|-------------|
| TD-DB-01 | RPC `deduct_credits` nao valida se credits >= amount | ALTO | Adicionar CHECK ou validacao na funcao |
| TD-DB-02 | Sem backup strategy documentada | ALTO | Configurar Supabase Point-in-Time Recovery |
| TD-DB-03 | JSONB em scan_history sem schema validation | MEDIO | Adicionar CHECK constraint ou validacao |
| TD-DB-04 | Sem soft delete em nenhuma tabela | MEDIO | Adicionar `deleted_at` para auditoria |
| TD-DB-05 | FK cascade policies nao verificadas | MEDIO | Auditar ON DELETE behavior |

### Recomendacao de Ordem de Execucao (Database)

```
1. Rotate keys comprometidas (TD-01)
2. Criar migration framework (TD-07)
3. Consolidar schema em migration inicial (TD-08)
4. Adicionar colunas fantasma (TD-09)
5. Criar indexes (TD-06)
6. Criar tabela transactions (TD-10)
7. Implementar trigger likes_count (TD-19)
8. Adicionar validacao em deduct_credits (TD-DB-01)
```

### Schema de Migracao Recomendado

```
supabase/migrations/
├── 00001_initial_schema.sql          # Schema consolidado
├── 00002_add_missing_columns.sql     # subscription_plan, evolution, etc.
├── 00003_add_indexes.sql             # 6 indexes faltantes
├── 00004_create_transactions.sql     # Tabela de auditoria
├── 00005_add_likes_trigger.sql       # Trigger para integridade
└── 00006_fix_deduct_credits.sql      # Validacao na RPC
```

### Verdict: APROVADO COM OBSERVACOES
O draft esta solido. As adicoes acima devem ser incorporadas no assessment final.
