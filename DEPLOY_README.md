# 🚀 Deploy Automático Configurado!

## Como Usar

Sempre que você fizer alterações no código e quiser atualizar o site, rode:

```bash
npm run deploy
```

Ou com uma mensagem personalizada:

```bash
npm run deploy "Adicionei nova funcionalidade X"
```

## O Que o Script Faz

1. ✅ Verifica se há mudanças
2. ✅ Adiciona todos os arquivos modificados (`git add .`)
3. ✅ Faz commit com mensagem automática ou personalizada
4. ✅ Envia para o GitHub (`git push`)
5. ✅ A Vercel detecta e atualiza o site automaticamente em ~1-2 minutos

## Exemplos de Uso

```bash
# Deploy com mensagem automática (data/hora)
npm run deploy

# Deploy com mensagem personalizada
npm run deploy "Corrigido bug no login"
npm run deploy "Adicionado novo recurso de scan"
npm run deploy "Melhorias na interface"
```

## Verificar Deploy

Depois de rodar o comando:
1. Aguarde 1-2 minutos
2. Acesse: https://notoxlabel.com.br
3. Recarregue a página (Ctrl+F5 ou Cmd+Shift+R)

Você também pode ver o progresso em tempo real no painel da Vercel!

---

## ⚠️ IMPORTANTE - Configuração do Supabase

Agora que seu domínio está funcionando, você DEVE atualizar o Supabase:

### Passo a Passo:

1. Acesse: [app.supabase.com](https://app.supabase.com)
2. Entre no seu projeto
3. Vá em **Authentication** → **URL Configuration**
4. Atualize os campos:

**Site URL:**
```
https://notoxlabel.com.br
```

**Redirect URLs** (adicione estas 3 URLs):
```
https://notoxlabel.com.br/auth/callback
https://www.notoxlabel.com.br/auth/callback
https://notoxlabel.vercel.app/auth/callback
```

5. Clique em **Save**

Isso é necessário para que o login social (Google/Facebook) funcione corretamente no domínio personalizado!

---

## Workflow Completo

```
Fazer alterações no código
         ↓
npm run deploy "descrição"
         ↓
GitHub recebe o código
         ↓
Vercel detecta mudança
         ↓
Build automático (~1-2 min)
         ↓
Site atualizado! 🎉
```
