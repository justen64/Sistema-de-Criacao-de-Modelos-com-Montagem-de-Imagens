package br.com.SeuBone.recortes.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	SecurityFilter securityFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    return http
	    	.cors(cors -> cors.configurationSource(corsConfigurationSource()))	
	        .csrf(csrf -> csrf.disable())
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .authorizeHttpRequests(authorize -> authorize
	            
	            .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
	            .requestMatchers(HttpMethod.POST, "/api/recortes").authenticated()
	            .requestMatchers(HttpMethod.POST, "/api/upload").authenticated()
	            .requestMatchers(HttpMethod.POST, "/auth/register").authenticated()
	            .requestMatchers(HttpMethod.GET, "/filtro").permitAll()
	            .requestMatchers(HttpMethod.GET, "/api/").authenticated()
	            .requestMatchers(HttpMethod.GET, "/api/recortes/**").permitAll()
	            .requestMatchers(HttpMethod.PUT, "/recortes/**").authenticated()
	            .requestMatchers(HttpMethod.PUT, "/api/recortes/**").authenticated()
	            .requestMatchers(HttpMethod.POST, "/modelos-finais").authenticated()
	            .requestMatchers(HttpMethod.DELETE, "/api/recortes/**").authenticated()
	            .requestMatchers(HttpMethod.GET, "/modelos-finais/**").permitAll()
	            
	            
	            .requestMatchers(HttpMethod.GET, "/modelos-finais").permitAll()
	            
	            .anyRequest().permitAll()
	        )
	        .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
	        .build();
	}
	
	 
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOriginPatterns(List.of("*"));
	    configuration.setAllowedMethods(List.of("*"));
	    configuration.setAllowedHeaders(List.of("*"));
	    configuration.setAllowCredentials(true);
	    
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
	    return authenticationConfiguration.getAuthenticationManager();
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
