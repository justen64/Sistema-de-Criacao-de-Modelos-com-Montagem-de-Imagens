package br.com.SeuBone.recortes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.SeuBone.recortes.Enums.Status;
import br.com.SeuBone.recortes.dto.RecorteMontagemDTO;
import br.com.SeuBone.recortes.dto.RecorteRequestDTO;
import br.com.SeuBone.recortes.dto.RecorteResponseDTO;
import br.com.SeuBone.recortes.entity.Usuario;
import br.com.SeuBone.recortes.repository.RecorteRepository;
import br.com.SeuBone.recortes.service.RecorteService;


@RestController
@CrossOrigin("*")
@RequestMapping("/api/recortes")
public class RecorteController {

    @Autowired
    private RecorteService service;
    
    @Autowired
    private RecorteRepository repository;

    @GetMapping
    public Page<RecorteResponseDTO> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ordemExibicao") String sort) {
        
        return service.listarTodos(page, size, sort);
    }

    @GetMapping("/{id}")
    public RecorteResponseDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }
    
    @GetMapping("/montagem/{tipoProduto}")
    public List<RecorteMontagemDTO> getRecortesParaMontagem(
            @PathVariable String tipoProduto) {
        
        return repository.findByTipoProdutoOrderByOrdemExibicaoAsc(tipoProduto)
            .stream()
            .map(recorte -> new RecorteMontagemDTO(
                recorte.getUrlImagem(),
                recorte.getOrdemExibicao(),
                recorte.getTipoRecorte(),
                recorte.getPosicaoRecorte()
            ))
            .toList();
    }
    
    @GetMapping("/filtro")
    public Page<RecorteResponseDTO> filtrarRecortes(
            @RequestParam(required = false) String tipoRecorte,
            @RequestParam(required = false) String material,
            @RequestParam(required = false) String corMaterial,
            @RequestParam(required = false) String posicaoRecorte,
            @RequestParam(required = false) String sku,
            @RequestParam(required = false) String nome,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ordemExibicao") String sort) {

        tipoRecorte = (tipoRecorte != null && tipoRecorte.isBlank()) ? null : tipoRecorte;
        material = (material != null && material.isBlank()) ? null : material;
        posicaoRecorte = (posicaoRecorte != null && posicaoRecorte.isBlank()) ? null : posicaoRecorte;
        sku = (sku != null && sku.isBlank()) ? null : sku;
        nome = (nome != null && nome.isBlank()) ? null : nome;
        corMaterial = (corMaterial != null && corMaterial.isBlank()) ? null : corMaterial;

        return service.filtrar(tipoRecorte, material, corMaterial, posicaoRecorte, sku, nome, page, size, sort);
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<RecorteResponseDTO> salvar(
            @RequestPart("dto") String dtoJson,
            @RequestPart("imagem") MultipartFile imagem,
            @AuthenticationPrincipal Usuario usuario) {
        
       

        RecorteRequestDTO dto = convertJsonToDto(dtoJson);
        return ResponseEntity.ok(service.salvar(dto, imagem));
    }

    private RecorteRequestDTO convertJsonToDto(String dtoJson) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(dtoJson, RecorteRequestDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao converter DTO JSON: " + e.getMessage());
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<RecorteResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestPart("dto") String dtoJson,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem,
            @AuthenticationPrincipal Usuario usuario) {
        
       

        RecorteRequestDTO dto = convertJsonToDto(dtoJson);
        return ResponseEntity.ok(service.atualizar(id, dto, imagem));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id, 
            @RequestParam Status status,
            @AuthenticationPrincipal Usuario usuario) {
        
      

        service.atualizarStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario) {
        
       

        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}