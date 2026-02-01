# Opções para Fazer Push no GitHub

O push para o GitHub está travado porque precisa de autenticação. Escolha uma das opções abaixo:

## Opção 1 - GitHub CLI (Recomendado - Mais Fácil)

```bash
brew install gh
gh auth login
git push -u origin main
```

## Opção 2 - Personal Access Token

1. Acesse: [GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Clique em **"Generate new token (classic)"**
3. Marque a permissão **`repo`**
4. Copie o token gerado
5. No terminal, rode:
   ```bash
   git push -u origin main
   ```
6. Quando pedir **senha**, cole o **token** (não a senha normal do GitHub)

## Opção 3 - Deploy Direto via Vercel CLI (Pula o GitHub)

Se quiser pular o GitHub e fazer deploy direto:

```bash
npm install -g vercel
vercel
```

Depois de fazer login, o Vercel vai fazer o deploy automaticamente e você adiciona as variáveis de ambiente pelo painel web.

---

## Variáveis de Ambiente (Lembrete)

Independente da opção escolhida, você precisará adicionar estas variáveis na Vercel:

- `VITE_SUPABASE_URL`: `https://bcocmqwvscorlrlalokb.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb2NtcXd2c2NvcmxybGFsb2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDc1MjAsImV4cCI6MjA4NTM4MzUyMH0.VmqQn5CmCtH1zI7yKjw1SzVGTN5WdW31xWOxAKyhuAw`
