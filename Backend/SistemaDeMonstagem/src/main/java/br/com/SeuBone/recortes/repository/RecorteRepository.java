package br.com.SeuBone.recortes.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.SeuBone.recortes.entity.Recorte;

@Repository
public interface RecorteRepository extends JpaRepository<Recorte, Long> {
	boolean existsBySku(String sku);

	 @Query("SELECT r FROM Recorte r WHERE r.tipoProduto = :tipoProduto " +
	           "ORDER BY r.ordemExibicao ASC")
	    List<Recorte> findByTipoProdutoOrderByOrdemExibicaoAsc(
	        @Param("tipoProduto") String tipoProduto);
	 
	 @Query("SELECT r FROM Recorte r WHERE " +
		        "(:tipoRecorte IS NULL OR r.tipoRecorte = :tipoRecorte) AND " +
		        "(:material IS NULL OR r.material = :material) AND " +
		        "(:corMaterial IS NULL OR r.corMaterial = :corMaterial) AND " +
		        "(:posicaoRecorte IS NULL OR r.posicaoRecorte = :posicaoRecorte) AND " +
		        "(:sku IS NULL OR r.sku = :sku) AND " +
		        "(:nomeModelo IS NULL OR LOWER(r.nomeModelo) LIKE LOWER(CONCAT('%', :nomeModelo, '%'))) AND " +
		        "(:tipoProduto IS NULL OR r.tipoProduto = :tipoProduto) AND " +
		        "(:status IS NULL OR r.status = :status)")
		Page<Recorte> findByFiltros(
		        @Param("tipoRecorte") String tipoRecorte,
		        @Param("material") String material,
		        @Param("corMaterial") String corMaterial,
		        @Param("posicaoRecorte") String posicaoRecorte,
		        @Param("sku") String sku,
		        @Param("nomeModelo") String nomeModelo,
		        @Param("tipoProduto") String tipoProduto,
		        @Param("status") Status status,
		        Pageable pageable);
}
