package br.com.SeuBone.recortes.Enums;

public enum Status {
	ATIVO("ATIVO"),
	DESATIVADO("DESATIVADO");
	
	private String status;

	Status(String status){
		this.status = status;
	}
	
	public String getStatus() {
		return status;
	}


	
}
