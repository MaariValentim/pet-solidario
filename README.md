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

1. Instale Java 21 e Maven.
2. Crie um banco PostgreSQL chamado `pet_solidario`.
3. Configure as variáveis de ambiente abaixo, se os valores locais forem diferentes:

   - `DB_URL`: URL JDBC do PostgreSQL (padrão: `jdbc:postgresql://localhost:5432/pet_solidario`)
   - `DB_USERNAME`: usuário do banco (padrão: `postgres`)
   - `DB_PASSWORD`: senha do banco (padrão: `postgres`)

4. Inicie a aplicação com `mvn spring-boot:run`.

As credenciais padrão são apenas para desenvolvimento local. Não versione senhas ou credenciais reais.

## Estrutura inicial

O código Java fica em `src/main/java/br/com/petsolidario` e as configurações em `src/main/resources`. As funcionalidades serão adicionadas em etapas, mantendo o escopo do MVP.
