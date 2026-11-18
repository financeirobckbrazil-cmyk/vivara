# Configuração do rastreio Life Pandora

O rastreio só é criado depois que o servidor consulta a Pingupag e confirma que o PIX está pago.

## 1. Banco de dados (Supabase)

1. Crie um projeto no Supabase.
2. Abra **SQL Editor** e execute todo o conteúdo de `supabase/tracking-schema.sql`.
3. Em **Project Settings → API**, copie a Project URL e a chave `service_role`. A chave service role é secreta e deve ficar apenas nas variáveis de ambiente da Vercel.

## 2. Serviço de e-mail (Resend)

1. Crie/acesse uma conta em Resend.
2. Verifique um domínio ou remetente autorizado.
3. Gere uma API Key.

## 3. Variáveis de ambiente na Vercel

Em **Project → Settings → Environment Variables**, configure em Production (e Preview, se desejar):

- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave secreta service_role do Supabase.
- `RESEND_API_KEY`: chave da API do Resend.
- `TRACKING_FROM_EMAIL`: remetente verificado, por exemplo `Life Pandora <pedidos@seudominio.com>`.
- `APP_URL`: URL pública do site, por exemplo `https://life-pandora.vercel.app`.

Mantenha também as variáveis da Pingupag já usadas pelo checkout. Nunca coloque chaves secretas em arquivos do frontend, GitHub ou mensagens públicas.

Depois de salvar as variáveis, faça um novo deploy.

## Como o acompanhamento funciona

- O pedido é persistido no Supabase somente depois da confirmação de pagamento consultada no servidor.
- O link exclusivo é mostrado na tela de sucesso e enviado ao e-mail cadastrado pelo Resend.
- A página calcula as oito etapas em dias corridos desde a confirmação do PIX.
- **Importante:** sem integração de eventos da transportadora, as etapas de envio/entrega são uma previsão automática e não uma leitura real do rastreamento dos Correios/Jadlog. Não informe ao cliente que houve uma leitura real da transportadora.
