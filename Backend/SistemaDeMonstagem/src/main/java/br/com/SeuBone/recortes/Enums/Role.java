package br.com.SeuBone.recortes.Enums;

public enum Role {
	ADMIN("ADMIN"),
	USER("USER");
	
	private String role;
	
	Role(String role){
		this.role = role;
	}

	public String getRole() {
		return role;
	}
	
	
	
}