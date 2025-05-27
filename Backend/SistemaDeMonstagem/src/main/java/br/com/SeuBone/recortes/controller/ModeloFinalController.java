package br.com.SeuBone.recortes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.SeuBone.recortes.entity.ModeloFinal;
import br.com.SeuBone.recortes.service.ModeloFinalService;

@RestController
@RequestMapping("/modelos-finais")
@CrossOrigin(origins = "*")
public class ModeloFinalController {

    @Autowired
    private ModeloFinalService modeloFinalService;

    @PostMapping
    public ResponseEntity<ModeloFinal> criar(@RequestBody ModeloFinal modeloFinal) {
        ModeloFinal criado = modeloFinalService.criarModeloFinal(modeloFinal);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping
    public ResponseEntity<List<ModeloFinal>> listarTodos() {
        return ResponseEntity.ok(modeloFinalService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModeloFinal> buscarPorId(@PathVariable Long id) {
        return modeloFinalService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        modeloFinalService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModeloFinal> atualizar(@PathVariable Long id, @RequestBody ModeloFinal modeloAtualizado) {
        ModeloFinal atualizado = modeloFinalService.atualizar(id, modeloAtualizado);
        return ResponseEntity.ok(atualizado);
    }
}