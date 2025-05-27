package br.com.SeuBone.recortes.dto;

import jakarta.validation.constraints.NotBlank;

public class RecorteRequestDTO {

	 	@NotBlank
	    private String nomeModelo;

	    private Integer ordemExibicao;

	    @NotBlank
	    private String sku;

	    @NotBlank
	    private String tipoRecorte;

	    @NotBlank
	    private String posicaoRecorte;

	    @NotBlank
	    private String tipoProduto;

	    @NotBlank
	    private String material;

	    @NotBlank
	    private String corMaterial;

	    private String urlImagem;

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
	    
	    
}
