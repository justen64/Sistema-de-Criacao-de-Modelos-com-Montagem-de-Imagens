package br.com.SeuBone.recortes.dto;

import br.com.SeuBone.recortes.Enums.Status;

public class RecorteResponseDTO {

	 	private Long id;
	    private String nomeModelo;
	    private Integer ordemExibicao;
	    private String sku;
	    private String tipoRecorte;
	    private String posicaoRecorte;
	    private String tipoProduto;
	    private String material;
	    private String corMaterial;
	    private String urlImagem;
	    private Status status;

	    public RecorteResponseDTO(Long id, String nomeModelo, Integer ordemExibicao, String sku,
	                              String tipoRecorte, String posicaoRecorte, String tipoProduto,
	                              String material, String corMaterial, String urlImagem, Status status) {
	        this.id = id;
	        this.nomeModelo = nomeModelo;
	        this.ordemExibicao = ordemExibicao;
	        this.sku = sku;
	        this.tipoRecorte = tipoRecorte;
	        this.posicaoRecorte = posicaoRecorte;
	        this.tipoProduto = tipoProduto;
	        this.material = material;
	        this.corMaterial = corMaterial;
	        this.urlImagem = urlImagem;
	        this.status = status;
	    }

	    

		public Long getId() {
			return id;
		}

		public String getNomeModelo() {
			return nomeModelo;
		}

		public Integer getOrdemExibicao() {
			return ordemExibicao;
		}

		public String getSku() {
			return sku;
		}

		public String getTipoRecorte() {
			return tipoRecorte;
		}

		public String getPosicaoRecorte() {
			return posicaoRecorte;
		}

		public String getTipoProduto() {
			return tipoProduto;
		}

		public String getMaterial() {
			return material;
		}

		public String getCorMaterial() {
			return corMaterial;
		}

		public String getUrlImagem() {
			return urlImagem;
		}



		public Status getStatus() {
			return status;
		}
	    
	    
	    
	    
}
