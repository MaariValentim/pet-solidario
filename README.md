# PetSolidário

MVP web acadêmico para reunir campanhas de proteção animal, explicar suas necessidades e direcionar pessoas interessadas aos canais oficiais de contribuição das instituições. O projeto toma como referência a Associação Casa dos Gatos (CDG), de Araraquara/SP.

## Problema e proposta

Informações sobre campanhas e formas de ajudar podem ficar dispersas entre diferentes canais. O PetSolidário organiza esses dados em uma página responsiva para facilitar a consulta. A plataforma não recebe nem processa pagamentos: qualquer contribuição é feita diretamente com a instituição, após a pessoa confirmar as informações nos canais oficiais.

## Funcionalidades implementadas

- Lista campanhas abertas consultadas pela API.
- Exibe instituição responsável, título, resumo e detalhes da campanha.
- Apresenta o canal oficial informado para contribuição como link de ação.
- Permite abrir e fechar detalhes usando mouse ou teclado.
- Informa estados de carregamento, lista vazia e falha de comunicação, com opção de tentar novamente.
- Inclui navegação por seções, atalho para pular ao conteúdo, foco visível e layout adaptável a dispositivos menores.
- Inclui testes automatizados de backend e de interface, além de verificações de acessibilidade com axe-core.

As duas campanhas incluídas pela migração V2, sobre ração e sachês, são **dados demonstrativos** para apresentar a interface. Elas não confirmam que a instituição esteja solicitando esses itens. Antes de contribuir, confirme a necessidade e os canais com a própria instituição.

## Tecnologias

- Java 21 e Spring Boot 3.5.16
- Maven
- Spring Web, Spring Data JPA e Bean Validation
- PostgreSQL 17 e Flyway
- HTML, CSS e JavaScript
- JUnit, Testcontainers, JaCoCo, Playwright e axe-core
- GitHub Actions para integração contínua

## Executar localmente

Requisitos: Java 21, Maven, Docker Desktop ou Colima e Node.js 24 para os testes de interface.

1. Inicie o Docker Desktop. No macOS com Colima, inicie-o antes de continuar.
2. Na pasta do projeto, execute `docker compose up -d db`.
3. Aguarde o estado `healthy`, conferindo com `docker compose ps`.
4. Em outro terminal, execute `mvn spring-boot:run`.
5. Abra `http://localhost:8080` no navegador.

O Flyway cria a estrutura do banco e insere os registros demonstrativos nas primeiras inicializações. O Compose usa credenciais locais padrão (`postgres`/`postgres`) e mantém os dados em um volume Docker. Essas credenciais são apenas para desenvolvimento local; em outro ambiente, configure `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` com valores próprios.

Para encerrar a aplicação, use `Ctrl+C`. Para parar o banco preservando os dados, execute `docker compose down`.

## API

- `GET /api/campanhas`: retorna campanhas abertas em JSON.
- `GET /api/campanhas/{id}`: retorna uma campanha aberta; responde `404` quando não existe ou está encerrada.

## Testes, cobertura e integração contínua

- `mvn test` executa testes unitários e de integração. Os testes de integração iniciam um PostgreSQL temporário com Testcontainers; Docker precisa estar disponível.
- `mvn verify` executa os testes, gera o relatório JaCoCo em `target/site/jacoco/` e verifica o limite mínimo de 70% de cobertura de linhas.
- Para testar a interface, instale as dependências com `npm ci`, instale o navegador de teste com `npx playwright install chromium` e execute `npm run test:e2e`.
- O GitHub Actions executa a verificação Java e os testes de interface em envios à `main`, às branches `feat/*` e em Pull Requests para `main`. Os relatórios e capturas gerados são disponibilizados como artefatos da execução.

## Acessibilidade e ODS

A interface inclui idioma declarado em português brasileiro, elementos semânticos, navegação por teclado, foco visível, estados anunciados por tecnologias assistivas e layout responsivo. O documento [`docs/acessibilidade-e-ods.md`](docs/acessibilidade-e-ods.md) descreve esses recursos, sua relação pretendida com o ODS 10 e um roteiro de verificação manual. As verificações automatizadas apoiam a análise, mas não representam certificação de conformidade.

## Publicação

A publicação está preparada em duas partes, porque o GitHub Pages hospeda arquivos estáticos, mas não executa a API Java nem o PostgreSQL:

- A interface pode ser publicada pelo workflow `.github/workflows/deploy-pages.yml` no GitHub Pages.
- A API Spring Boot e o PostgreSQL podem ser criados no Render a partir de `render.yaml` e `Dockerfile`.
- Depois que a API estiver no ar, configure a variável de repositório `PET_SOLIDARIO_API_ORIGIN` em **Settings → Secrets and variables → Actions → Variables** com a origem do serviço (por exemplo, `https://pet-solidario-api.onrender.com`, sem `/api`). Em seguida, execute novamente o workflow **Publicar interface no GitHub Pages**.
- Em **Settings → Pages**, selecione **GitHub Actions** como origem da publicação.

O endereço público da interface só fica ativo após concluir essas etapas e o workflow terminar com sucesso. O plano gratuito do Render pode suspender o serviço web quando fica sem tráfego e o banco PostgreSQL gratuito expira após 30 dias; consulte as limitações atuais do provedor antes de depender da disponibilidade por longo prazo.
