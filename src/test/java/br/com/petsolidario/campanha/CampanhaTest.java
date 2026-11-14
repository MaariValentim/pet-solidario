package br.com.petsolidario.campanha;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CampanhaTest {

    @Test
    void campanhaNovaComecaAberta() {
        Campanha campanha = criarCampanha();

        assertThat(campanha.getStatus()).isEqualTo(StatusCampanha.ABERTA);
    }

    @Test
    void encerrarAlteraStatusDaCampanha() {
        Campanha campanha = criarCampanha();

        campanha.encerrar();

        assertThat(campanha.getStatus()).isEqualTo(StatusCampanha.ENCERRADA);
    }

    private Campanha criarCampanha() {
        return new Campanha(
                "Campanha de teste",
                "Resumo da campanha de teste",
                "Descrição da campanha de teste",
                "Instituição de teste",
                "Consulte os canais oficiais da instituição.");
    }
}
