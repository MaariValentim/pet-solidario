package br.com.petsolidario.campanha;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

    @GetMapping("/{id}")
    public Campanha buscarCampanhaAberta(@PathVariable Long id) {
        return campanhaRepository.findById(id)
                .filter(campanha -> campanha.getStatus() == StatusCampanha.ABERTA)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Campanha não encontrada"));
    }
}
