# Deploy na Vercel - Passo a Passo

## ✅ Código já está no GitHub!
Repositório: https://github.com/brianreisss-star/notoxlabel

---

## 🚀 Próximos Passos

### 1. Acessar a Vercel
Abra: **[vercel.com](https://vercel.com)**

### 2. Fazer Login
- Clique em **"Login"**
- Escolha **"Continue with GitHub"**
- Autorize a Vercel a acessar sua conta

### 3. Importar o Projeto
- Clique em **"Add New..."** → **"Project"**
- Você verá uma lista dos seus repositórios do GitHub
- Encontre **"notoxlabel"** e clique em **"Import"**

### 4. Configurar o Projeto
Na tela de configuração:

**Framework Preset:** Vite (deve detectar automaticamente)  
**Root Directory:** `./` (deixe como está)  
**Build Command:** `npm run build` (já preenchido)  
**Output Directory:** `dist` (já preenchido)

### 5. ⚠️ IMPORTANTE - Adicionar Variáveis de Ambiente

**Antes de clicar em Deploy**, role a página até a seção **"Environment Variables"**.

Clique em **"Add"** e adicione estas 2 variáveis:

#### Variável 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://bcocmqwvscorlrlalokb.supabase.co`

#### Variável 2:
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjb2NtcXd2c2NvcmxybGFsb2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MDc1MjAsImV4cCI6MjA4NTM4MzUyMH0.VmqQn5CmCtH1zI7yKjw1SzVGTN5WdW31xWOxAKyhuAw`

**Certifique-se de que ambas estão marcadas para:**
- ✅ Production
- ✅ Preview
- ✅ Development

### 6. Deploy!
Clique no botão **"Deploy"**

### 7. Aguardar
- O deploy leva cerca de 1-2 minutos
- Você verá os logs em tempo real
- Quando terminar, aparecerá uma tela de sucesso com confetes! 🎉

### 8. Acessar o Site
- A Vercel vai te dar uma URL tipo: `https://notoxlabel.vercel.app`
- Clique em **"Visit"** para abrir seu site no ar!

---

## 🔧 Configuração Final no Supabase

Para que o login social (Google/Facebook) funcione em produção:

1. Acesse o painel do **Supabase**
2. Vá em **Authentication** → **URL Configuration**
3. Em **Site URL**, adicione: `https://SEU-PROJETO.vercel.app`
4. Em **Redirect URLs**, adicione:
   - `https://SEU-PROJETO.vercel.app/auth/callback`

---

## ✅ Pronto!

Seu app está no ar! Agora você pode:
- Compartilhar o link com outras pessoas
- Testar cadastro e login em produção
- Configurar um domínio personalizado (opcional)

---

## 📝 Próximos Passos (Opcional)

### Domínio Personalizado
1. No painel da Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `notoxlabel.com.br`)
3. Configure o DNS conforme as instruções

### Monitoramento
- Vercel Analytics: Veja quantas pessoas acessam
- Vercel Logs: Monitore erros em tempo real
