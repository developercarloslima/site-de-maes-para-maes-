# Colo de Mãe — Landing page de vendas

Site estático responsivo pronto para hospedar na Vercel, Netlify, Render Static Site ou hospedagem convencional.

## Oferta
- Produto principal: aplicativo Colo de Mãe
- 3 bônus: Mais Leite Materno, Lacta Lux, Noites Tranquilas
- **Valor: R$ 29,90**
- Fotografias e telas do aplicativo v0.5.8 obtidas dos materiais oficiais enviados em conversa.

## Antes de publicar — etapas obrigatórias

1. **Conectar checkout:** editar o arquivo `js/config.js` e preencher `checkoutUrl` com o link HTTPS do checkout da Kacto (ou sua plataforma de pagamento). Até esse momento, o botão de compra exibe um aviso em vez de simular uma compra. Todos os botões `data-checkout` usam o mesmo endereço configurado.
2. **Revisar os bônus:** o nome atualizado do segundo bônus é **Lacta Lux**. A arte dele foi criada em CSS por falta de uma capa final com esse título. A capa final pode substituir o visual atual quando disponível.
3. **Políticas legais:** completar os campos de identidade do vendedor e canal de suporte em `privacidade.html` e `termos.html`; revisar termos definitivos e política de entrega/reembolso conforme a oferta real.
4. **Hospedar:** fazer upload da pasta completa num provedor estático. Não se deve enviar apenas `index.html`, pois ele depende de `assets`, `css`, e `js`.
5. **Verificar anúncios:** usar o Meta Pixel Helper e o Gerenciador de Eventos para confirmar eventos após consentimento.

## Meta Pixel

Pixel ID: `1722078432606863`.

Eventos:
- `PageView` quando o visitante concede consentimento para cookies de marketing;
- `ViewContent` quando a oferta é visualizada, após consentimento;
- `InitiateCheckout` ao clicar no botão de compra conectado ao checkout, se houver consentimento.

A opção de consentimento do visitante fica armazenada localmente para fins de privacidade. A página `privacidade.html` informa o mecanismo. Existe fallback `noscript` em `index.html`, conforme o snippet entregue.

## UTMs e SCK

O arquivo `js/tracking.js` lê parâmetros da URL atual, como `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`, `fbclid`, `gclid` e outros parâmetros recebidos, faz fallback de UTMs presentes no referrer, e cria `sck` a partir dos valores sem repeti-los. A URL do checkout recebe os parâmetros automaticamente, sem sobrescrever valores existentes na própria URL.

Exemplo para teste:

```
https://SEU-DOMINIO.com/?utm_source=instagram&utm_medium=paid&utm_campaign=colo_de_mae&utm_content=criativo01
```

O checkout configurado receberá os parâmetros e `sck`.

## Desenvolvimento local

Com Python 3:

```
cd colo-de-mae-landing-page
python -m http.server 8080
```

Abra `http://localhost:8080` no navegador.

## Observações

- Este pacote não cria automaticamente um checkout, nem confirma pedidos: a integração de compra depende do link oficial.
- Não existem contagens regressivas, depoimentos inventados ou descontos fictícios.
- Imagens reais do app são do pacote disponibilizado e reproduzem a interface verde/bege original dentro do design comercial rosa.
- Sem dependências de JavaScript de terceiros, exceto Meta Pixel (com consentimento); fontes Google Fonts são opcionais e há fontes de sistema como fallback.
