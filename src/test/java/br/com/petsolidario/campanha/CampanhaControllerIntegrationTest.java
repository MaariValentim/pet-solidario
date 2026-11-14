package br.com.petsolidario.campanha;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CampanhaControllerIntegrationTest {

    @Container
    private static final PostgreSQLContainer POSTGRES = new PostgreSQLContainer(
            DockerImageName.parse("postgres:16-alpine"))
            .withDatabaseName("pet_solidario")
            .withUsername("pet_solidario")
            .withPassword("pet_solidario");

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CampanhaRepository campanhaRepository;

    @DynamicPropertySource
    static void configurarPostgreSQL(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @BeforeEach
    void limparCampanhas() {
        campanhaRepository.deleteAll();
    }

    @Test
    void listaSomenteCampanhasAbertas() {
        campanhaRepository.save(criarCampanha("Campanha aberta"));

        Campanha encerrada = criarCampanha("Campanha encerrada");
        encerrada.encerrar();
        campanhaRepository.save(encerrada);

        ResponseEntity<String> resposta = restTemplate.getForEntity("/api/campanhas", String.class);

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resposta.getBody())
                .contains("Campanha aberta")
                .doesNotContain("Campanha encerrada");
    }

    @Test
    void retornaDetalhesDeCampanhaAberta() {
        Campanha campanha = campanhaRepository.save(criarCampanha("Campanha de detalhes"));

        ResponseEntity<String> resposta = restTemplate.getForEntity(
                "/api/campanhas/{id}", String.class, campanha.getId());

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resposta.getBody()).contains("Campanha de detalhes");
    }

    @Test
    void retornaNaoEncontradoQuandoCampanhaEstaEncerrada() {
        Campanha encerrada = criarCampanha("Campanha encerrada");
        encerrada.encerrar();
        Campanha salva = campanhaRepository.save(encerrada);

        ResponseEntity<String> resposta = restTemplate.getForEntity(
                "/api/campanhas/{id}", String.class, salva.getId());

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void retornaNaoEncontradoQuandoCampanhaNaoExiste() {
        ResponseEntity<String> resposta = restTemplate.getForEntity(
                "/api/campanhas/{id}", String.class, Long.MAX_VALUE);

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void disponibilizaPaginaInicialComEstruturaAcessivel() {
        ResponseEntity<String> resposta = restTemplate.getForEntity("/", String.class);

        assertThat(resposta.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resposta.getBody())
                .contains("lang=\"pt-BR\"")
                .contains("href=\"#conteudo\"")
                .contains("role=\"status\"")
                .contains("aria-live=\"polite\"");
    }

    private Campanha criarCampanha(String titulo) {
        return new Campanha(
                titulo,
                "Resumo da campanha de teste",
                "Descrição da campanha de teste",
                "Instituição de teste",
                "Consulte os canais oficiais da instituição.");
    }
}
