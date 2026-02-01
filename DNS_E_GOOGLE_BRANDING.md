# Configuração de DNS (Domínio WWW)

Para corrigir o erro de **www.notoxlabel.com.br** não abrir, você precisa adicionar um registro CNAME no seu provedor de domínio (Registro.br ou onde comprou).

## O que está faltando:
O domínio `notoxlabel.com.br` (sem www) já aponta para a Vercel, mas o subdomínio `www` não.

## Como corrigir:
1. Acesse o painel onde você comprou o domínio.
2. Vá na zona de DNS.
3. Adicione (ou edite) o seguinte registro:

| Tipo | Nome (Host) | Valor (Destino) |
|------|-------------|-----------------|
| **CNAME** | `www` | `cname.vercel-dns.com` |

4. Salve.
5. Aguarde algumas horas para propagar.

---

# Sobre o Login Google "Supabase"
Ao autorizar com Google, aparece "Supabase" porque estamos usando o serviço de autenticação deles na camada gratuita.

**Para colocar a logo do NoTox:**
1. Isso exige configuração avançada no **Google Cloud Console** e no **Supabase**.
2. É necessário verificar o domínio e criar uma Tela de Consentimento OAuth personalizada.
3. **Solução Rápida:** Posso te enviar o link da documentação oficial do Supabase ensinando isso, mas envolve configurações fora do código (no painel da Google).
