package br.com.petsolidario.campanha;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Entidade JPA que representa uma campanha armazenada no banco de dados.
 */
@Entity
@Table(name = "campanhas")
public class Campanha {

    // O banco gera o identificador quando a campanha é salva.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String titulo;

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false, length = 500)
    private String resumo;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String instituicao;

    @NotBlank
    @Column(name = "como_contribuir", nullable = false, columnDefinition = "TEXT")
    private String comoContribuir;

    // Persistir o nome do enum evita depender da posição de cada opção.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCampanha status = StatusCampanha.ABERTA;

    protected Campanha() {
        // Construtor exigido pelo JPA para carregar a entidade do banco.
    }

    public Campanha(
            String titulo,
            String resumo,
            String descricao,
            String instituicao,
            String comoContribuir) {
        this.titulo = titulo;
        this.resumo = resumo;
        this.descricao = descricao;
        this.instituicao = instituicao;
        this.comoContribuir = comoContribuir;
        this.status = StatusCampanha.ABERTA;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getResumo() {
        return resumo;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getInstituicao() {
        return instituicao;
    }

    public String getComoContribuir() {
        return comoContribuir;
    }

    public StatusCampanha getStatus() {
        return status;
    }

    /** Encerra a campanha sem permitir um status fora das opções definidas. */
    public void encerrar() {
        this.status = StatusCampanha.ENCERRADA;
    }
}
