# POC — Relatórios do CRM MídiaCarros

Interface navegável e responsiva, feita em HTML5, CSS3 e JavaScript puro. Os 120 leads fictícios são gerados de forma determinística em `assets/js/data.js`; nenhum dado é enviado a servidor.

## Executar localmente

Abra `index.html` diretamente no navegador. Para evitar políticas restritivas de alguns navegadores, também é possível usar `npx serve .` ou a extensão Live Server.

## Publicar na Vercel

Importe esta pasta/repositório em **vercel.com/new** e mantenha as configurações padrão (Framework Preset: Other; diretório de saída: `.`). Não há etapa de build. Também é possível executar `npx vercel` na raiz.

## Estrutura

- `index.html`: estrutura semântica da aplicação
- `assets/css/styles.css`: identidade visual, responsividade e animações
- `assets/js/data.js`: base local de leads
- `assets/js/app.js`: filtros, cálculos, gráficos e interações

Chart.js e Montserrat são carregados por CDN. Para produção, recomenda-se hospedar esses arquivos localmente ou adicioná-los ao pipeline oficial do CRM.

## Escopo da simulação

Filtros centrais, abas, ordenação, navegação superior responsiva, gráficos, painel lateral e feedback de exportação são interativos. Exportação, edição de leads, autenticação, persistência e insights por IA são apenas simulações visuais.
