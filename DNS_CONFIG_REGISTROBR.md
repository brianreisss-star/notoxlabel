# Configuração de Domínio - Registro.br → Vercel

## Informações da Vercel

A Vercel está solicitando que você configure este registro DNS:

| Type | Name | Value |
|------|------|-------|
| **A** | **@** | **76.76.21.21** |

> **Nota:** O IP `76.76.21.21` é o servidor da Vercel. O IP que você mencionou (`216.198.79.1`) pode estar desatualizado. Use sempre o IP que a Vercel mostra na tela de configuração atual.

---

## Passo a Passo - Configurar DNS no Registro.br

### 1. Acessar o Painel do Registro.br
- Acesse: [registro.br](https://registro.br)
- Faça login com sua conta

### 2. Selecionar o Domínio
- Clique em **"Meus Domínios"**
- Encontre seu domínio (ex: `notoxlabel.com.br`)
- Clique em **"Administrar"** ou **"Gerenciar"**

### 3. Configurar DNS
- Procure pela opção **"Editar Zona"** ou **"DNS"** ou **"Servidores DNS"**
- Se estiver usando os servidores do Registro.br (padrão), você verá opções para editar registros

### 4. Adicionar Registro A
Adicione o seguinte registro:

- **Tipo:** A
- **Nome/Host:** @ (ou deixe em branco, representa o domínio raiz)
- **Valor/Destino:** `76.76.21.21` (ou o IP que a Vercel mostrou)
- **TTL:** 3600 (ou deixe o padrão)

### 5. Adicionar Registro CNAME para WWW (Opcional mas Recomendado)
Para que `www.seudominio.com.br` também funcione:

- **Tipo:** CNAME
- **Nome/Host:** www
- **Valor/Destino:** `cname.vercel-dns.com`
- **TTL:** 3600

### 6. Salvar as Alterações
- Clique em **"Salvar"** ou **"Aplicar"**
- As mudanças podem levar de alguns minutos até 48 horas para propagar (geralmente 10-30 minutos)

---

## Verificar se Funcionou

### Opção 1 - Aguardar na Vercel
- Volte para a tela da Vercel
- Aguarde alguns minutos
- A Vercel vai verificar automaticamente e mostrar "Valid Configuration" quando estiver pronto

### Opção 2 - Verificar Manualmente
Abra o terminal e rode:

```bash
dig seudominio.com.br
```

Se aparecer o IP `76.76.21.21` (ou o IP da Vercel), está funcionando!

---

## ⚠️ Importante - Configuração no Supabase

Depois que o domínio estiver funcionando, você DEVE atualizar o Supabase:

1. Acesse o painel do **Supabase**
2. Vá em **Authentication** → **URL Configuration**
3. Atualize:
   - **Site URL:** `https://seudominio.com.br`
   - **Redirect URLs:** Adicione:
     - `https://seudominio.com.br/auth/callback`
     - `https://www.seudominio.com.br/auth/callback`

---

## Problemas Comuns

### "Domínio não verificado"
- Aguarde mais alguns minutos (propagação DNS)
- Verifique se o IP está correto
- Certifique-se de que não há outros registros A conflitantes

### "Registro.br não permite editar DNS"
Se você estiver usando servidores DNS externos (como Cloudflare):
- Configure os registros no painel do seu provedor DNS
- Não no Registro.br

### "Quero usar Cloudflare"
Se quiser usar Cloudflare para CDN/proteção:
1. Adicione o domínio no Cloudflare
2. Configure os nameservers no Registro.br para apontar para o Cloudflare
3. Configure os registros DNS no painel do Cloudflare

---

## Resumo

✅ Adicione registro A: `@ → 76.76.21.21` (ou IP mostrado pela Vercel)  
✅ Adicione registro CNAME: `www → cname.vercel-dns.com`  
✅ Aguarde propagação (10-30 min)  
✅ Atualize URLs no Supabase  

Depois disso, seu domínio estará funcionando! 🚀
