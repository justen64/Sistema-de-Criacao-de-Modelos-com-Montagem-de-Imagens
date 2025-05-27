package br.com.SeuBone.recortes.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.SeuBone.recortes.Enums.Status;
import br.com.SeuBone.recortes.dto.RecorteRequestDTO;
import br.com.SeuBone.recortes.dto.RecorteResponseDTO;
import br.com.SeuBone.recortes.entity.Recorte;
import br.com.SeuBone.recortes.repository.ModeloFinalRepository;
import br.com.SeuBone.recortes.repository.RecorteRepository;
import jakarta.transaction.Transactional;

@Service
public class RecorteService {

    @Autowired
    private RecorteRepository repository;
    
    @Autowired
    private ModeloFinalRepository modeloFinalRecortesRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public Recorte toEntity(RecorteRequestDTO dto) {
        Recorte r = new Recorte();
        r.setNomeModelo(dto.getNomeModelo());
        r.setOrdemExibicao(dto.getOrdemExibicao());
        r.setSku(dto.getSku());
        r.setTipoRecorte(dto.getTipoRecorte());
        r.setPosicaoRecorte(dto.getPosicaoRecorte());
        r.setTipoProduto(dto.getTipoProduto());
        r.setMaterial(dto.getMaterial());
        r.setCorMaterial(dto.getCorMaterial());
        r.setUrlImagem(dto.getUrlImagem());
        return r;
    }

    public RecorteResponseDTO toDTO(Recorte r) {
        return new RecorteResponseDTO(
                r.getId(),
                r.getNomeModelo(),
                r.getOrdemExibicao(),
                r.getSku(),
                r.getTipoRecorte(),
                r.getPosicaoRecorte(),
                r.getTipoProduto(),
                r.getMaterial(),
                r.getCorMaterial(),
                r.getUrlImagem(),
                r.getStatus()
        );
    }

    public Page<RecorteResponseDTO> listarTodos(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<Recorte> recortesPage = repository.findAll(pageable);
        
        return recortesPage.map(this::toDTO);
    }

    public RecorteResponseDTO buscarPorId(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Recorte não encontrado"));
    }
    
    public Page<RecorteResponseDTO> filtrar(String tipoRecorte, String material, String corMaterial,
            String posicaoRecorte, String sku, String nome,
            int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<Recorte> recortesPage = repository.findByFiltros(tipoRecorte, material, corMaterial,
                sku, nome, pageable);

        return recortesPage.map(this::toDTO);
    }


    public RecorteResponseDTO salvar(RecorteRequestDTO dto, MultipartFile imagem) {
       
        if (dto.getTipoRecorte() == null || dto.getTipoProduto() == null) {
            throw new IllegalArgumentException("Tipo de recorte e produto são obrigatórios");
        }

        Recorte recorte = toEntity(dto);
        recorte.setStatus(Status.ATIVO);

        if (imagem == null || imagem.isEmpty()) {
            throw new IllegalArgumentException("Imagem é obrigatória para novo recorte");
        }

        try {
            String url = cloudinaryService.uploadImagem(imagem, dto);
            recorte.setUrlImagem(url);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao fazer upload da imagem", e);
        }

        Recorte salvo = repository.save(recorte);
        return toDTO(salvo);
    }

    public RecorteResponseDTO atualizar(Long id, RecorteRequestDTO dto, MultipartFile novaImagem) {
        return repository.findById(id).map(recorte -> {
           
            boolean camposImagemAlterados = 
                !recorte.getTipoProduto().equals(dto.getTipoProduto()) ||
                !recorte.getTipoRecorte().equals(dto.getTipoRecorte()) ||
                !recorte.getMaterial().equals(dto.getMaterial()) ||
                !recorte.getCorMaterial().equals(dto.getCorMaterial());

            if (camposImagemAlterados && (novaImagem == null || novaImagem.isEmpty())) {
                throw new IllegalArgumentException("Ao alterar tipo/material/cor, envie uma nova imagem");
            }

          
            recorte.setNomeModelo(dto.getNomeModelo());
            recorte.setOrdemExibicao(dto.getOrdemExibicao());
            recorte.setSku(dto.getSku());
            recorte.setTipoRecorte(dto.getTipoRecorte());
            recorte.setPosicaoRecorte(dto.getPosicaoRecorte());
            recorte.setTipoProduto(dto.getTipoProduto());
            recorte.setMaterial(dto.getMaterial());
            recorte.setCorMaterial(dto.getCorMaterial());

            
            if (novaImagem != null && !novaImagem.isEmpty()) {
                try {
                    if (recorte.getUrlImagem() != null) {
                        cloudinaryService.deletarImagem(recorte.getUrlImagem());
                    }
                    String novaUrl = cloudinaryService.uploadImagem(novaImagem, dto);
                    recorte.setUrlImagem(novaUrl);
                } catch (IOException e) {
                    throw new RuntimeException("Erro ao atualizar imagem", e);
                }
            }

            return toDTO(repository.save(recorte));
        }).orElseThrow(() -> new RuntimeException("Recorte não encontrado"));
    }
    
    public void atualizarStatus(Long id, Status novoStatus) {
        Recorte recorte = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recorte não encontrado"));
        recorte.setStatus(novoStatus);
        repository.save(recorte);
    }

    @Transactional
    public void deletar(Long id) {
        Recorte recorte = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recorte não encontrado"));


        modeloFinalRecortesRepository.deleteByRecorteId(id);

        try {
            if (recorte.getUrlImagem() != null && !recorte.getUrlImagem().isBlank()) {
                
                cloudinaryService.deletarImagem(recorte.getUrlImagem());
            }
        } catch (IOException e) {
       
            throw new RuntimeException("Erro ao excluir imagem", e);
        }

    
        repository.delete(recorte);
       
    }
}