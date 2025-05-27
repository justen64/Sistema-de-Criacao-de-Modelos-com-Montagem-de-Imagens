package br.com.SeuBone.recortes.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SeuBone.recortes.dto.LoginResponseDTO;
import br.com.SeuBone.recortes.dto.RegisterDTO;
import br.com.SeuBone.recortes.entity.Usuario;
import br.com.SeuBone.recortes.repository.UsuarioRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("auth")
public class AuthenticationController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UsuarioRepository repository;
	
	
	@Autowired
	private TokenService tokenService;
	
	@PostMapping("/login")
	public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
		var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
		var auth = this.authenticationManager.authenticate(usernamePassword);
		
		var token = tokenService.generateToken((Usuario)auth.getPrincipal());
		
		return ResponseEntity.ok(new LoginResponseDTO(token));
		
	}

	@PostMapping("/register")
	public ResponseEntity register(@RequestBody @Valid RegisterDTO data) {
		if(this.repository.findByEmail(data.email()).isPresent()) return ResponseEntity.badRequest().build();
		
		String encryptedPassword = new BCryptPasswordEncoder().encode(data.senha());
		Usuario novoUsuario = new Usuario(data.email(), encryptedPassword, data.role());
		
		this.repository.save(novoUsuario);
		
		return ResponseEntity.ok().build();
		
	}
}
