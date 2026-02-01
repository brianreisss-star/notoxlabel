# Configuração de Variáveis de Ambiente na Vercel

Para que o site funcione corretamente para **todos os usuários** (sem depender do seu navegador), precisamos configurar as chaves de API diretamente na Vercel.

## 1. Pegue suas Chaves
Tenha em mãos as chaves que você já tem:
- **VITE_SUPABASE_URL**: URL do seu projeto Supabase
- **VITE_SUPABASE_ANON_KEY**: Chave pública do Supabase
- **VITE_CLAUDE_API_KEY**: Sua chave da Anthropic (começa com `sk-ant...`)
- **VITE_OPENAI_API_KEY**: Sua chave da OpenAI (começa com `sk-...`)

## 2. Acessar a Vercel
1. Vá para o painel da Vercel: [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no projeto **notoxlabel**
3. Vá na aba **Settings** (Configurações)
4. No menu lateral esquerdo, clique em **Environment Variables**

## 3. Adicionar as Variáveis
Adicione cada uma abaixo. Em todos os casos, deixe marcado os ambientes: `Production`, `Preview`, `Development`.

| Key (Nome) | Value (Valor) |
|------------|---------------|
| `VITE_SUPABASE_URL` | *Sua URL do Supabase* |
| `VITE_SUPABASE_ANON_KEY` | *Sua chave Anon Key* |
| `VITE_CLAUDE_API_KEY` | *Sua chave da Anthropic* |
| `VITE_OPENAI_API_KEY` | *Sua chave da OpenAI* |

### Como adicionar:
1. Digite o **Key** (ex: `VITE_CLAUDE_API_KEY`)
2. Cole o **Value** (ex: `sk-ant-admin...`)
3. Clique em **Save** ou **Add**.
4. Repita para todas as 4 chaves.

## 4. Redeploy (IMPORTANTE)
As variáveis só funcionam após um **novo deploy**.
1. Vá na aba **Deployments**
2. Clique no último deploy (o que está no topo, mesmo se falhou)
3. Clique nos 3 pontinhos (⋮) e escolha **Redeploy**
4. Confirme.

Pronto! Agora o site funcionará para qualquer pessoa que acessar, usando as chaves seguras do servidor.
