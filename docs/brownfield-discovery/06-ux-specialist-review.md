# UX Specialist Review

> Phase 6 - Brownfield Discovery | @ux-design-expert
> Data: 2026-02-20

## Parecer Tecnico

Reviso o draft de divida tecnica (Phase 4) sob a otica de UX/Frontend.

### Concordancias

Os itens de frontend/UX estao bem classificados:
- **TD-14** (code splitting): Confirmado como ALTO - impacta diretamente o LCP
- **TD-15** (resultado via state): Confirmado como ALTO - perda de dados e frustrante
- **TD-17** (alert vs toast): Confirmado como MEDIO
- **TD-21** (acessibilidade): Deveria ser ALTO, nao MEDIO (compliance LGPD/acessibilidade)

### Reclassificacoes Sugeridas

| ID | Draft | Sugerido | Justificativa |
|----|-------|----------|--------------|
| TD-21 | MEDIO | ALTO | Acessibilidade e obrigacao legal (Lei 13.146/2015) |
| TD-20 | MEDIO | ALTO | SEO e critico para aquisicao organica |

### Adicoes ao Draft

| ID | Problema | Severidade | Recomendacao |
|----|---------|-----------|-------------|
| TD-UX-01 | Sem dark/light mode toggle (e dark fixo) | BAIXO | Considerar preferencia do sistema |
| TD-UX-02 | Imagens sem lazy loading nativo | MEDIO | Adicionar loading="lazy" |
| TD-UX-03 | Sem skeleton screens | MEDIO | Implementar para perceived performance |
| TD-UX-04 | Navegacao bottom bar sem feedback haptico | BAIXO | Vibration API para PWA |
| TD-UX-05 | Sem onboarding tour para novos usuarios | MEDIO | Implementar walkthrough |
| TD-UX-06 | Recharts sem responsive container em mobile | MEDIO | Verificar overflow em telas < 375px |

### Pontos Positivos (manter)

1. **Design visual excelente** - Consistente, moderno, profissional
2. **Animacoes bem dosadas** - Framer Motion usado com bom gosto
3. **Paleta de cores coerente** - Dark theme bem executado
4. **Gamificacao engajante** - XP, badges, streak bem implementados
5. **PWA manifest completo** - Instalavel no mobile

### Recomendacao de Prioridade UX

```
1. Remover user-scalable=no (TD-21) — 5 minutos
2. Code splitting com React.lazy (TD-14) — 4h
3. Persistir resultado de scan (TD-15) — 4h
4. Implementar toast system (TD-17) — 4h
5. Adicionar ARIA labels basicos (TD-21) — 4h
6. Sitemap + robots.txt (TD-20) — 2h
7. Image lazy loading (TD-UX-02) — 1h
```

### Verdict: APROVADO COM RECLASSIFICACOES
O draft esta bom. Acessibilidade e SEO devem subir para ALTO.
