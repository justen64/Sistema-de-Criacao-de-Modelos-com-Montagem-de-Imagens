import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styles from "./styles.module.css";
import { SideBar } from "../../components/SideBar/sideBar";
import { Navbar } from "../../components/NavBar";
import { IconLeftArrow } from "../../assets/Icones/leftArrow";
import { IconInfo } from "../../assets/Icones/info";
import Botao from "../../components/Botao/botao";
import { InputSwitch } from "primereact/inputswitch";
import { salvarModeloFinalAPI } from "../../services/api.js";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";

export const MontagemCompleta = () => {
  const location = useLocation();
  const camadas = location.state?.camadas || [];

  const navigate = useNavigate();

  const ordenadas = [...camadas].sort(
    (a, b) => a.ordemExibicao - b.ordemExibicao
  );

  const [loading, setLoading] = useState(false);

  const obterNomeMaisComum = () => {
    const contagem = {};

    ordenadas.forEach((item) => {
      const tipo = item.tipoProduto;
      contagem[tipo] = (contagem[tipo] || 0) + 1;
    });

    let tipoMaisComum = null;
    let max = 0;

    for (const tipo in contagem) {
      if (contagem[tipo] > max) {
        max = contagem[tipo];
        tipoMaisComum = tipo;
      }
    }

    return tipoMaisComum || "modelo_personalizado";
  };

  const handleSalvarModeloFinal = async () => {
    setLoading(true);
    try {
      const nomeModelo = obterNomeMaisComum();

      const imagemBlob = await montarImagemFinal();
      const imagemMontadaUrl = await uploadParaCloudinary(imagemBlob);

      const modeloFinal = {
        nome: nomeModelo,
        imagemMontadaUrl,
        recortes: ordenadas.map((item) => ({ id: item.id })),
      };

      const resultado = await salvarModeloFinalAPI(modeloFinal);
      toast.success("Modelo salvo com sucesso ");
      console.log("Modelo salvo:", resultado);
      navigate("/visualizacao");
    } catch (error) {
      toast.error("Falha ao salvar modelo");
      console.error("Erro ao salvar modelo:", error);
    }
    setLoading(false);
  };

  const montarImagemFinal = async () => {
    const imagensOrdenadas = [...ordenadas].sort(
      (a, b) => a.ordemExibicao - b.ordemExibicao
    );

    const carregarImagem = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const imagens = await Promise.all(
      imagensOrdenadas.map((item) => carregarImagem(item.urlImagem))
    );

    const largura = imagens[0].width;
    const altura = imagens[0].height;

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");

    imagens.forEach((img) => ctx.drawImage(img, 0, 0, largura, altura));

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  const uploadParaCloudinary = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "modelo_preset");
    formData.append("folder", "modelos-finais");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwqbskr4t/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  return (
    <>
      <header>
        <Navbar />
      </header>

      <div className={styles.containerPrincipal}>
        <SideBar />

        <div className={styles.montagemContainer}>
          <div className={styles.containerSalvar}>
            <div className={styles.containerTextoSalvar}>
              <IconInfo />
              <p>Desaja salvar esse modelo?</p>
            </div>

            <div className={styles.containerBotaoSalvar}>
              <Botao
                onClick={() => navigate(-1)}
                texto={"Descartar"}
                className={styles.botaoDescartar}
              />
              <Botao
                texto={"Salvar"}
                onClick={handleSalvarModeloFinal}
                className={styles.botaoSalvar}
              />
            </div>
          </div>

          <div className={styles.containerCabecalho}>
            <div className={styles.titulo}>
              <div
                className={styles.nomeModelo}
                onClick={() => navigate(-1)}
                style={{ cursor: "pointer" }}
              >
                <IconLeftArrow />
                <h2>Novo Modelo</h2>
              </div>
            </div>
          </div>
          <div className={styles.containerProdutoMontado}>
            <div className={styles.tabelaInfo}>
              <div className={styles.tabelaCabecalho}>
                <span>Key</span>
                <span>Ordem de exibição</span>
              </div>

              <div className={styles.tabelaCorpo}>
                {ordenadas.map((item, index) => (
                  <div key={item.id} className={styles.linha}>
                    <span className={styles.key}>
                      {item.tipoRecorte}-{item.tipoProduto}-
                      {item.material?.toLowerCase()}-
                      {item.corMaterial?.toLowerCase()}
                    </span>
                    <span className={styles.ordem}>
                      {String(item.ordemExibicao).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.visualizacaoBonet}>
              {ordenadas.map((item, index) => (
                <img
                  key={item.id}
                  src={item.urlImagem}
                  alt={item.nomeModelo || `camada-${index}`}
                  className={styles.imagemCamada}
                  style={{ zIndex: ordenadas.length - index }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className={styles.overlayLoading}>
          <ProgressSpinner />
        </div>
      )}
    </>
  );
};
