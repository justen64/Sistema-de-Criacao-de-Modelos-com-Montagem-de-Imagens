package br.com.SeuBone.recortes.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.SeuBone.recortes.entity.ModeloFinal;
import br.com.SeuBone.recortes.repository.ModeloFinalRepository;

@Service
public class ModeloFinalService {

    @Autowired
    private ModeloFinalRepository modeloFinalRepository;

    public ModeloFinal criarModeloFinal(ModeloFinal modeloFinal) {
    	 if (modeloFinal.getRecortes() == null || modeloFinal.getRecortes().isEmpty()) {
             throw new IllegalArgumentException("O ModeloFinal deve ter pelo menos um recorte.");
         }
         
         return modeloFinalRepository.save(modeloFinal);
    }

    public List<ModeloFinal> listarTodos() {
        return modeloFinalRepository.findAll();
    }

    public Optional<ModeloFinal> buscarPorId(Long id) {
        return modeloFinalRepository.findById(id);
    }

    public void deletar(Long id) {
    	if (!modeloFinalRepository.existsById(id)) {
            throw new RuntimeException("ModeloFinal não encontrado com id: " + id);
        }
        modeloFinalRepository.deleteById(id);
    }

    public ModeloFinal atualizar(Long id, ModeloFinal modeloAtualizado) {
        return modeloFinalRepository.findById(id).map(modelo -> {
            modelo.setNome(modeloAtualizado.getNome());
            modelo.setImagemMontadaUrl(modeloAtualizado.getImagemMontadaUrl());
            modelo.setRecortes(modeloAtualizado.getRecortes());
            return modeloFinalRepository.save(modelo);
        }).orElseThrow(() -> new RuntimeException("ModeloFinal não encontrado com id: " + id));
    }
}