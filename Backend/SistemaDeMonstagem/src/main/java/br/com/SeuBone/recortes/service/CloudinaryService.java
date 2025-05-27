package br.com.SeuBone.recortes.service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import br.com.SeuBone.recortes.dto.RecorteRequestDTO;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadImagem(MultipartFile file, RecorteRequestDTO dto) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo de imagem é obrigatório");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Apenas arquivos de imagem são permitidos");
        }

        String publicId = String.format("assets/%s_%s_%s_%s_%s",
        	    dto.getTipoProduto().toLowerCase().replace(" ", "_"),
        	    dto.getTipoRecorte().toLowerCase(),
        	    dto.getMaterial().toLowerCase(),
        	    dto.getCorMaterial().toLowerCase().replace(" ", "-"),
        	    UUID.randomUUID());

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
            ObjectUtils.asMap(
                "public_id", publicId,
                "folder", "assets",
                "use_filename", false,
                "unique_filename", false,
                "overwrite", true
            ));

        return uploadResult.get("secure_url").toString();
    }

    public void deletarImagem(String urlImagem) throws IOException {
        try {
            if (urlImagem == null || urlImagem.isBlank() || !urlImagem.contains("cloudinary")) {

                return;
            }

          
            String[] parts = urlImagem.split("/upload/");
            if (parts.length < 2) {
       
                return;
            }

            String publicId = parts[1].contains(".") 
                ? parts[1].substring(0, parts[1].lastIndexOf('.')) 
                : parts[1];

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            
        } catch (Exception e) {
            throw e;
        }
    }
}