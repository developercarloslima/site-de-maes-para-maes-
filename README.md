# Colo de Mãe — Landing Page Final (copy profissional + tons pastéis)

## Como publicar
1. Envie o conteúdo **desta pasta** para uma hospedagem estática (Vercel, Netlify ou equivalente).
2. O arquivo de entrada é `index.html`. Sem etapa de compilação.
3. A oferta exibida é **R$ 29,90**, incluindo o app e os 3 bônus.
4. Apenas os **dois CTAs finais** (na seção de oferta e na seção de encerramento) levam a `https://pay.cakto.com.br/h4t8mzb_1358012`, abrindo o checkout em uma **nova guia** (`target="_blank"`, `rel="noopener noreferrer"`).
5. Os botões no cabeçalho, primeira dobra e barra fixa móvel navegam suavemente para a seção **#oferta**, preservando seus textos.
6. O checkout, preço e Pixel da Meta estão em `js/config.js`.

## Rastreamento
- Pixel da Meta: `1722078432606863` — `PageView` e `ViewContent` após consentimento de marketing. `InitiateCheckout` e `Purchase` são de responsabilidade da Cakto.
- Preserva parâmetros UTM, `fbclid`, outros parâmetros recebidos e compõe `sck` para os botões do checkout.
- A confirmação de `Purchase` precisa ser configurada/validada no checkout da Cakto.

## Conteúdo e atendimento
- Tela real do app em formato WebP, incluída em `assets/`.
- Faça a revisão final dos dados de vendedor e suporte em `privacidade.html` e `termos.html` antes de publicar.
- As descrições sobre saúde têm finalidade educativa e não substituem acompanhamento profissional.

## Design
- Estilo pastel: creme, verde-sálvia, rosa-pêssego e lavanda.
- Copy/gancho da landing profissional; eyebrow atualizado para “O bebê nasceu, o manual não...”.

## Novo: Smartphones mais realistas
- Molduras metálicas com espessura e reflexos de vidro, Dynamic Island, barra de status e botões físicos.
- Prints reais do aplicativo continuam dentro das telas sem substituição por imagens fictícias.
- A nova aparência dos aparelhos está centralizada em `css/devices.css`.

## Auditoria do rastreamento (27/11/2026)
- Pixel noscript removido para evitar PageView antes de consentimento.
- Parâmetros de URL restritos a `src`, `sck`, UTMs e IDs reais do Pixel Meta somente após consentimento.
- Script Vercel Web Analytics preparado no HTML; habilitar Vercel Dashboard > Projeto > Analytics > Enable antes de validar dados.
- A Cakto segue responsável por InitiateCheckout/Purchase e API de Conversões, sem integração duplicada.
