package br.com.petsolidario.campanha;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints HTTP usados para consultar campanhas. */
@RestController
@RequestMapping("/api/campanhas")
public class CampanhaController {

    private final CampanhaRepository campanhaRepository;

    public CampanhaController(CampanhaRepository campanhaRepository) {
        this.campanhaRepository = campanhaRepository;
    }

    @GetMapping
    public List<Campanha> listarCampanhasAbertas() {
        return campanhaRepository.findAllByStatusOrderByIdDesc(StatusCampanha.ABERTA);
    }
}
