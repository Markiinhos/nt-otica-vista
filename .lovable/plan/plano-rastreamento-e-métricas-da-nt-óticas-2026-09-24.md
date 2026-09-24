# Plano: rastreamento e métricas da NT Óticas

## Resultado
A landing page continuará visualmente simples e focada em contato, com medição opcional e condicionada ao consentimento. Nenhum identificador ou link será inventado.

## Implementação
- Criar uma camada central de analytics que:
  - lê o GA4 por `VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY`;
  - lê o Meta Pixel por `VITE_META_PIXEL_ID`;
  - só carrega scripts após consentimento;
  - preserva UTMs durante a sessão e envia origem, meio e campanha nos eventos;
  - identifica tráfego direto, referência, orgânico, social e pago quando os sinais permitirem.
- Instrumentar individualmente todos os pontos principais:
  - WhatsApp no cabeçalho, destaque principal, contato, rodapé e botão flutuante;
  - “Como chegar”;
  - “Avaliar no Google”;
  - eventos complementares `cta_hero_click` e `cta_contact_click` nos CTAs correspondentes.
- Incluir os parâmetros pedidos em cada evento: nome, posição, página, origem, meio e campanha; no WhatsApp, também o telefone comercial informado.
- Adicionar aviso de cookies com aceitar, recusar e acesso a preferências/política, sem rastrear antes da decisão.
- Adicionar uma política de privacidade e cookies simples, informando uso agregado, ferramentas, finalidade e como alterar o consentimento.
- Adicionar a seção de avaliação no Google. Enquanto `VITE_GOOGLE_REVIEW_URL` não estiver configurada, o botão ficará desabilitado e não abrirá um endereço falso.
- Atualizar o horário para segunda a sexta, 09h às 18h, inclusive nos dados para buscadores.
- Manter SEO local, acessibilidade, carregamento rápido e o design atual.

## Configuração externa necessária
- O GA4 receberá page views, UTMs, dispositivo/navegador e eventos. Cidade/região e dados demográficos agregados dependem das configurações, consentimento e disponibilidade do próprio Google Analytics.
- Os eventos `whatsapp_click`, `maps_click` e `google_review_click` serão enviados prontos para serem marcados como eventos principais no painel do GA4; essa marcação é feita na propriedade GA4.
- O Meta Pixel enviará `PageView`, `ViewContent` e `Contact` após consentimento.
- O link oficial de avaliação e o ID do Meta Pixel permanecem como configurações pendentes, sem valores fictícios.

## Verificação
- Validar desktop e celular, aviso e preferências de cookies, ausência de scripts sem consentimento, carregamento após aceite e todos os destinos dos botões.
- Confirmar que UTMs permanecem associadas aos cliques durante a sessão e que a página não apresenta erros.
