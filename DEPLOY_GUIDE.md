# Guia de Deploy - Vercel

## Pré-requisitos
- ✅ Supabase configurado e funcionando localmente
- ✅ Conta no GitHub (para conectar com Vercel)
- ✅ Conta na Vercel (gratuita)

## Opção 1: Deploy via GitHub (Recomendado)

### Passo 1: Criar Repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (botão verde)
3. Nome do repositório: `notoxlabel` (ou o nome que preferir)
4. Deixe como **Private** (recomendado para projetos com chaves)
5. **NÃO** marque "Initialize with README"
6. Clique em **"Create repository"**

### Passo 2: Conectar Projeto Local ao GitHub
No terminal, na pasta do projeto (`/Users/brianreis/Desktop/ROTULIMPO`), execute:

```bash
git init
git add .
git commit -m "Initial commit - NoToxLabel"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/notoxlabel.git
git push -u origin main
```

> **Nota:** Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.

### Passo 3: Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New..."** → **"Project"**
3. Selecione o repositório `notoxlabel` que você acabou de criar
4. Clique em **"Import"**
5. Na tela de configuração:
   - **Framework Preset:** Vite (deve detectar automaticamente)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Passo 4: Configurar Variáveis de Ambiente
**IMPORTANTE:** Antes de fazer o deploy, adicione as variáveis de ambiente:

1. Na mesma tela de configuração, clique em **"Environment Variables"**
2. Adicione as seguintes variáveis:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://bcocmqwvscorlrlalokb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (a chave completa) |

3. Clique em **"Deploy"**

### Passo 5: Aguardar Deploy
- O Vercel vai instalar as dependências e fazer o build
- Isso leva cerca de 1-2 minutos
- Quando terminar, você verá uma tela de sucesso com o link do seu site!

---

## Opção 2: Deploy via CLI (Alternativa)

### Passo 1: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Passo 2: Fazer Login
```bash
vercel login
```

### Passo 3: Deploy
```bash
vercel
```

Siga as instruções no terminal e adicione as variáveis de ambiente quando solicitado.

---

## Após o Deploy

### Configurar Domínio Personalizado (Opcional)
1. No painel da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure o DNS conforme as instruções

### Testar o Site em Produção
1. Acesse a URL fornecida pela Vercel (ex: `notoxlabel.vercel.app`)
2. Teste o cadastro e login
3. Verifique se os scans estão salvando no Supabase

### Configurar Redirect URL no Supabase
Para que o login social (Google/Facebook) funcione em produção:

1. Acesse o painel do Supabase
2. Vá em **Authentication** → **URL Configuration**
3. Adicione a URL da Vercel em **Site URL** e **Redirect URLs**:
   - `https://SEU-PROJETO.vercel.app`
   - `https://SEU-PROJETO.vercel.app/auth/callback`

---

## Próximos Passos Após Deploy

1. **Configurar APIs de IA** (Claude/OpenAI) para análise de rótulos
2. **Adicionar Stripe** para pagamentos (se ainda não configurado)
3. **Testar todas as funcionalidades** em produção
4. **Monitorar erros** via Vercel Analytics
5. **Configurar domínio personalizado** (ex: `notoxlabel.com.br`)

---

## Comandos Úteis

```bash
# Ver logs em tempo real
vercel logs

# Fazer novo deploy
vercel --prod

# Ver lista de deploys
vercel ls
```
