package br.com.SeuBone.recortes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import br.com.SeuBone.recortes.entity.Usuario;
import java.util.List;
import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	 Optional<Usuario> findByEmail(String email);

}
