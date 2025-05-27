package br.com.SeuBone.recortes.dto;

import br.com.SeuBone.recortes.Enums.Role;

public record RegisterDTO(String email, String senha, Role role) {

}
