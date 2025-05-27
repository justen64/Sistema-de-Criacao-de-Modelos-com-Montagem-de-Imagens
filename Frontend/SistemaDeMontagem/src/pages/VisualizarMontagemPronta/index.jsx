import React, { useState } from "react";
import { useModelosFinais } from "../../services/api.js";
import styles from "./styles.module.css";
import { useNavigate } from "react-router";
import { IconSeuBone } from "../../assets/Icones/seuBone.jsx";

export const ModelosFinais = () => {
  const { modelos } = useModelosFinais();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <header className={styles.topo}>
        <IconSeuBone />
      </header>

      <p className={styles.mensagem}>
        <strong>
          Olá ‘fulano’, selecione <br />
          os modelos que mais curtiu!
        </strong>
      </p>
      <div className={styles.grid}>
        {modelos.map((modelo) => (
          <div className={styles.card} key={modelo.id}>
            <div className={styles.imagemContainer}>
              <img
                src={modelo.imagemMontadaUrl}
                alt={modelo.nome}
                className={styles.imagem}
              />

              <div className={styles.checkbox} />
            </div>
            <p className={styles.subtexto}>A partir de 30 unidades</p>
            <p className={styles.precoOriginal}>R$149,00</p>
            <p className={styles.precoPix}>
              R$127,39 <span className={styles.pix}>no PIX</span>
            </p>
            <button className={styles.btnSelecionar}>SELECIONAR</button>
          </div>
        ))}
      </div>

      <button onClick={() => navigate(-1)} className={styles.btnVoltar}>
        VOLTAR PARA ATENDIMENTO
      </button>
    </div>
  );
};
