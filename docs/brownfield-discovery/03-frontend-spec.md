# Frontend & UX Spec - NoTox Label (ROTULIMPO)

> Phase 3 - Brownfield Discovery | @ux-design-expert
> Data: 2026-02-20

## 1. Inventario de Componentes

- **35 arquivos** no src/
- **15 paginas** principais
- **25+ componentes** React

### Paginas Principais

| Pagina | Arquivo | Funcionalidade |
|--------|---------|---------------|
| Landing | LandingPage.jsx | Vitrine + CTA |
| Login | LoginPage.jsx | Email/senha + Google OAuth |
| Scan | ScanPage.jsx | Upload/camera de rotulos |
| Resultado | ResultPage.jsx | Exibicao da analise AI |
| Perfil | ProfilePage.jsx | Dados do usuario + stats |
| Historico | ScanHistoryPage.jsx | Lista de analises passadas |
| Planos | PlansPage.jsx | 3 planos Stripe |
| Comunidade | CommunityPage.jsx | Posts + likes |
| Chat | ChatSystem.jsx | Mensagens entre usuarios |
| Blog | BlogPage.jsx | Artigos gerados por IA |
| Gamificacao | GamificationHub.jsx | XP, niveis, badges |
| Indicacao | ReferralProgram.jsx | Sistema de referral |
| Admin | AdminDashboard.jsx | Metricas + gestao |
| Privacidade | PrivacyPolicy.jsx | LGPD |
| Termos | TermsOfUse.jsx | Termos de uso |

## 2. Styling & Design System

### Stack de Estilos
- **Tailwind CSS 3.4.1** com configuracao custom
- **CSS Layers** em index.css
- **Framer Motion 11** para animacoes
- **Lucide React** para icones

### Paleta de Cores
```
Primary: Verde (#22c55e area)
Background: Escuro (#0a0a0a area)
Cards: Semi-transparente com backdrop-blur
Accent: Emerald/Green gradients
Text: White + gray variants
```

### Nota de Design: A+
- Estetica coerente inspirada em apps premium (Airbnb-like)
- Spacing e tipografia consistentes
- Uso efetivo de glassmorphism e gradients

## 3. Responsividade

- **Mobile-first** com breakpoints sm/lg
- **Bottom navigation** com 5 itens no mobile
- **PROBLEMA:** `user-scalable=no` no viewport (acessibilidade)

## 4. Animacoes

- Framer Motion em todas as paginas
- Staggered lists para feed da comunidade
- Scroll-triggered animations
- Bottom sheet modals
- Page transitions suaves

## 5. Acessibilidade - Nota: C+

| Aspecto | Status | Problema |
|---------|--------|----------|
| ARIA labels | Parcial | Faltam em botoes de acao |
| Focus indicators | Ausente | Navegacao por teclado comprometida |
| Zoom support | Bloqueado | `user-scalable=no` impede zoom |
| Semantic HTML | Parcial | Alguns divs deviam ser section/article |
| Color contrast | OK | Texto branco em fundo escuro funciona |
| Screen reader | Fraco | Imagens sem alt text adequado |

## 6. User Flows Principais

### Flow 1: Scan de Rotulo
```
Login → Scan Page → Upload/Camera → Aguardar AI → Resultado → Salvar Historico
```

### Flow 2: Pagamento
```
Planos → Selecionar → Stripe Checkout → Webhook → Credits adicionados
```

### Flow 3: Comunidade
```
Feed → Ver posts → Curtir → Criar post → (Comments nao funciona)
```

### Flow 4: Gamificacao
```
Scan → XP ganho → Level up → Badge desbloqueado → Leaderboard
```

## 7. Error Handling UX

| Aspecto | Status |
|---------|--------|
| ErrorBoundary | Presente (global) |
| Loading states | Spinners basicos |
| Error display | Usa `alert()` nativo (ruim) |
| Toast notifications | Ausente |
| Empty states | Parcial |
| Offline support | Ausente |

## 8. Formularios

- Validacao minima (apenas HTML5 `required`)
- Sem biblioteca de formularios (React Hook Form, etc.)
- Sem mascaras de input
- Feedback de erro inline ausente

## 9. Performance Frontend

| Aspecto | Status | Impacto |
|---------|--------|---------|
| Code splitting | Ausente | Bundle unico grande |
| Lazy loading | Ausente | Todas paginas carregam juntas |
| Image optimization | Ausente | Sem next/image ou similar |
| Recharts | Bundled globalmente | Peso desnecessario |
| localStorage cache | Presente | Risco de dados stale |
| Tree shaking | Parcial | Vite faz basico |

## 10. SEO

| Aspecto | Status |
|---------|--------|
| Open Graph tags | Presentes (estaticas) |
| Meta description | Presente |
| Sitemap | Ausente |
| robots.txt | Ausente |
| SSR/SSG | Ausente (SPA puro) |
| Structured data | Ausente |

## 11. PWA

| Aspecto | Status |
|---------|--------|
| Manifest | Completo |
| Service Worker | Registrado (minimo) |
| Icons | Todos os tamanhos |
| Offline | Nao funcional |
| Push notifications | Ausente |

## 12. Problemas de UX Priorizados

| # | Severidade | Problema | Recomendacao |
|---|-----------|----------|-------------|
| 1 | ALTO | alert() para erros | Implementar toast system |
| 2 | ALTO | Resultado via state (perde ao recarregar) | Salvar em URL/DB antes |
| 3 | ALTO | Comments nao funciona | Implementar ou remover UI |
| 4 | ALTO | Sem code splitting | React.lazy() + Suspense |
| 5 | MEDIO | user-scalable=no | Remover restricao |
| 6 | MEDIO | Sem form validation | Adicionar inline validation |
| 7 | MEDIO | Sem loading skeletons | Melhorar perceived performance |
| 8 | MEDIO | Sem sitemap/robots.txt | Adicionar para SEO |
| 9 | BAIXO | Sem offline support | Expandir service worker |
| 10 | BAIXO | Sem push notifications | Adicionar para engagement |
