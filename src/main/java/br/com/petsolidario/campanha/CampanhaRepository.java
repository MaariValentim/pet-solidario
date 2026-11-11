package br.com.petsolidario.campanha;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/** Consultas de campanhas persistidas, geradas pelo Spring Data JPA. */
public interface CampanhaRepository extends JpaRepository<Campanha, Long> {

    List<Campanha> findAllByStatusOrderByIdDesc(StatusCampanha status);
}
