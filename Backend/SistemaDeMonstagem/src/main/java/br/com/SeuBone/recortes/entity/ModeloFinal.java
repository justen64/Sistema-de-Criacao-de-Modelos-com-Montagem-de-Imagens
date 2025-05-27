package br.com.SeuBone.recortes.entity;

import java.time.LocalDateTime;
import java.util.List;

import br.com.SeuBone.recortes.Enums.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class ModeloFinal {

	 	@Id	
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String nome;

	    private String tipoProduto;

	    private String imagemMontadaUrl;

	    @Enumerated(EnumType.STRING)
	    private Status status;

	    private LocalDateTime dataCriacao;

	    @ManyToMany
	    @JoinTable(
	        name = "modelo_final_recortes",
	        joinColumns = @JoinColumn(name = "modelo_final_id"),
	        inverseJoinColumns = @JoinColumn(name = "recorte_id")
	    )
	    private List<Recorte> recortes;

	    public ModeloFinal() {
	        this.status = Status.ATIVO;
	        this.dataCriacao = LocalDateTime.now();
	    }

	    public Long getId() {
	        return id;
	    }

	    public void setId(Long id) {
	        this.id = id;
	    }

	    public String getNome() {
	        return nome;
	    }

	    public void setNome(String nome) {
	        this.nome = nome;
	    }

	    public String getTipoProduto() {
	        return tipoProduto;
	    }

	    public void setTipoProduto(String tipoProduto) {
	        this.tipoProduto = tipoProduto;
	    }

	    public String getImagemMontadaUrl() {
	        return imagemMontadaUrl;
	    }

	    public void setImagemMontadaUrl(String imagemMontadaUrl) {
	        this.imagemMontadaUrl = imagemMontadaUrl;
	    }

	    public Status getStatus() {
	        return status;
	    }

	    public void setStatus(Status status) {
	        this.status = status;
	    }

	    public LocalDateTime getDataCriacao() {
	        return dataCriacao;
	    }

	    public void setDataCriacao(LocalDateTime dataCriacao) {
	        this.dataCriacao = dataCriacao;
	    }

	    public List<Recorte> getRecortes() {
	        return recortes;
	    }

	    public void setRecortes(List<Recorte> recortes) {
	        this.recortes = recortes;
	    }
	}