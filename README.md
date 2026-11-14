# PetSolidário

MVP web acadêmico para divulgar campanhas, necessidades e formas oficiais de contribuição de instituições de proteção animal. O projeto tem como referência a Associação Casa dos Gatos (CDG), de Araraquara/SP.

## Escopo do MVP

- Consultar campanhas disponíveis.
- Visualizar as necessidades de cada campanha.
- Consultar formas oficiais de contato e contribuição da instituição.

O MVP não processa pagamentos e não inclui aplicativo móvel, logística, controle de estoque ou gestão completa de ONG.

## Tecnologias

- Java 21
- Spring Boot 3.5.16
- Maven
- PostgreSQL
- HTML5, CSS3, JavaScript e Bootstrap

## Executar localmente

Requisitos: Java 21, Maven e Docker Desktop ou Colima.

1. Inicie o Docker Desktop. Se usa Colima no macOS, execute `colima start` após ligar o computador.
2. Na pasta do projeto, inicie o banco: `docker compose up -d db`.
3. Confirme que o banco está pronto: `docker compose ps` deve mostrar `healthy`.
4. Inicie a aplicação: `mvn spring-boot:run`.

Abra `http://localhost:8080` no navegador. Para parar a aplicação, use `Ctrl+C`; para parar o banco sem apagar os dados, execute `docker compose down`.

O Compose cria o banco `pet_solidario` com as credenciais locais padrão (`postgres`/`postgres`), alinhadas à configuração da aplicação. O banco fica restrito ao próprio computador e persiste em um volume Docker. Esses valores servem apenas para desenvolvimento local; nunca os use em produção. Para personalizá-los, defina `DB_NAME`, `DB_USERNAME` e `DB_PASSWORD` tanto para o Compose quanto para a aplicação.

## API de campanhas

- `GET /api/campanhas`: consulta as campanhas abertas e retorna os dados em JSON.
- `GET /api/campanhas/{id}`: consulta os detalhes de uma campanha aberta. Retorna `404` se ela não existir ou já estiver encerrada.

Na inicialização, o Flyway aplica as migrações SQL em `src/main/resources/db/migration`. O Hibernate valida se o modelo Java corresponde à estrutura do banco.

## Testes, cobertura e integração contínua

- `mvn test`: executa os testes unitários e de integração. Os testes de integração usam Testcontainers para iniciar um PostgreSQL temporário; Docker precisa estar disponível.
- `mvn verify`: executa os testes, gera o relatório JaCoCo em `target/site/jacoco/` e falha se a cobertura de linhas ficar abaixo de 70%.

O GitHub Actions executa `mvn verify` em atualizações da branch principal, branches `feat/*` e Pull Requests para `main`. O workflow registra a cobertura de linhas no log e publica o relatório JaCoCo como artefato.

O teste de interface usa Playwright e axe-core para verificar navegação por teclado, layout móvel e violações de acessibilidade. Ele também gera capturas de tela com uma campanha explicitamente fictícia. Para executar localmente, use `npm ci`, `npx playwright install chromium` e `npm run test:e2e`.

## Interface e acessibilidade

A página inicial está em `src/main/resources/static/index.html` e consome a API de campanhas. Inclui navegação por teclado, foco visível, mensagens de estado acessíveis e layout responsivo. A relação com o ODS 10 e um roteiro de verificação manual estão em [`docs/acessibilidade-e-ods.md`](docs/acessibilidade-e-ods.md).

## Estrutura inicial

O código Java fica em `src/main/java/br/com/petsolidario` e as configurações em `src/main/resources`. As funcionalidades serão adicionadas em etapas, mantendo o escopo do MVP.
