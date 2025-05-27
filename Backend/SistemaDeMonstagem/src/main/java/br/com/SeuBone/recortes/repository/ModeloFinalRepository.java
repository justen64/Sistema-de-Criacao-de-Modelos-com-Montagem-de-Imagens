package br.com.SeuBone.recortes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.SeuBone.recortes.entity.ModeloFinal;

public interface ModeloFinalRepository extends JpaRepository<ModeloFinal, Long> {

	@Modifying
	@Query("DELETE FROM ModeloFinal mf WHERE EXISTS (SELECT r FROM mf.recortes r WHERE r.id = :recorteId)")
	void deleteByRecorteId(@Param("recorteId") Long recorteId);
}

