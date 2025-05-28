package br.com.SeuBone.recortes.entity;

import br.com.SeuBone.recortes.Enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Recorte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeModelo; 
    
    private Integer ordemExibicao;
    
	@Column(unique = true, nullable = false)
    private String sku;
    
    
    private String tipoRecorte; 
    
    private String posicaoRecorte;
    
    private String tipoProduto;
    
    private String material; 
    
    private String corMaterial;
    
    private String urlImagem;
    
    @Enumerated(EnumType.STRING)
    private Status status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNomeModelo() {
		return nomeModelo;
	}

	public void setNomeModelo(String nomeModelo) {
		this.nomeModelo = nomeModelo;
	}

	public Integer getOrdemExibicao() {
		return ordemExibicao;
	}

	public void setOrdemExibicao(Integer ordemExibicao) {
		this.ordemExibicao = ordemExibicao;
	}

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public String getTipoRecorte() {
		return tipoRecorte;
	}

	public void setTipoRecorte(String tipoRecorte) {
		this.tipoRecorte = tipoRecorte;
	}

	public String getPosicaoRecorte() {
		return posicaoRecorte;
	}

	public void setPosicaoRecorte(String posicaoRecorte) {
		this.posicaoRecorte = posicaoRecorte;
	}

	public String getTipoProduto() {
		return tipoProduto;
	}

	public void setTipoProduto(String tipoProduto) {
		this.tipoProduto = tipoProduto;
	}

	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	public String getCorMaterial() {
		return corMaterial;
	}

	public void setCorMaterial(String corMaterial) {
		this.corMaterial = corMaterial;
	}

	public String getUrlImagem() {
		return urlImagem;
	}

	public void setUrlImagem(String urlImagem) {
		this.urlImagem = urlImagem;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}
    
    
}