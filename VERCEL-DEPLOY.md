# Publicação na Vercel

Este projeto usa TanStack Start + Nitro e está configurado para gerar funções de servidor na Vercel.

## Importação

1. Envie o conteúdo desta pasta para a raiz do repositório GitHub (não envie apenas o ZIP).
2. Na Vercel, importe o repositório e confirme o framework **TanStack Start**.
3. Deixe a Vercel detectar o comando de build; se pedir, use `npm run build`.
4. Configure as variáveis privadas abaixo em **Settings → Environment Variables**.
5. Faça um novo deploy depois de cadastrar as variáveis.

## Variáveis privadas do servidor

Cadastre somente as credenciais do provedor que será usado pelo checkout. Não coloque essas chaves em variáveis com prefixo `VITE_`, nem em arquivos enviados ao GitHub.

- `PINGUPAG_API_KEY`
- `PINGUPAG_PRODUCT_HASH`
- `PINGUPAG_UPSELL_URL` (opcional)
- `PARADISEPAG_SECRET_KEY`
- `PARADISEPAG_PRODUCT_HASH`
- `PARADISEPAG_UPSELL_URL` (opcional)

As variáveis do provedor que não for utilizado podem ficar sem cadastro.

## Importante sobre segurança

As chaves privadas são lidas no servidor por `process.env` nas funções TanStack Start. Nunca use o prefixo `VITE_` para segredos: valores `VITE_` são incorporados ao JavaScript entregue ao navegador e ficam públicos. O código do front-end e as rotas HTTP do servidor não são secretos; proteja as credenciais e valide os dados recebidos pelas funções.
