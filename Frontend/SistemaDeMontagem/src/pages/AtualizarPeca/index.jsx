import React, { useState, useEffect } from "react";
import { Navbar } from "../../components/NavBar";
import { SideBar } from "../../components/SideBar/sideBar";
import styles from "./styles.module.css";
import Botao from "../../components/Botao/botao";
import { IconInfo } from "../../assets/Icones/info";
import { IconLeftArrow } from "../../assets/Icones/leftArrow";
import { InputSwitch } from "primereact/inputswitch";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import Cookies from "js-cookie";
import { IconUpload } from "../../assets/Icones/upload";
import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";

export const AtualizarPeca = () => {
  const location = useLocation();
  const recorte = location.state;
  const navigate = useNavigate();

  const [ativo, setAtivo] = useState(recorte.status === "ATIVO");
  const [imagem, setImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(recorte.urlImagem || null);

  const [nomeModelo, setNomeModelo] = useState(recorte.nomeModelo || "");
  const [tipoRecorte, setTipoRecorte] = useState(recorte.tipoRecorte || "");
  const [posicaoRecorte, setPosicaoRecorte] = useState(
    recorte.posicaoRecorte || ""
  );
  const [ordemExibicao, setOrdemExibicao] = useState(
    recorte.ordemExibicao || ""
  );
  const [tecido, setTecido] = useState(recorte.material || "");
  const [corTecido, setCorTecido] = useState(recorte.corMaterial || "");
  const [sku, setSku] = useState(recorte.sku || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAtivo(recorte.status === "ATIVO");
  }, [recorte.status]);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = () => {
    setImagem(null);
    setPreviewImagem(null);
  };

  const handleSalvar = async () => {
    const tipoRecorteAlterado = tipoRecorte !== recorte.tipoRecorte;
    const tecidoAlterado = tecido !== recorte.material;
    const corTecidoAlterado = corTecido !== recorte.corMaterial;

    if (
      (tipoRecorteAlterado || tecidoAlterado || corTecidoAlterado) &&
      !imagem
    ) {
      toast.error("Altere a imagem se modificar tipo, tecido ou cor.");
      return;
    }

    setLoading(true);

    const dto = {
      nomeModelo,
      tipoRecorte,
      posicaoRecorte,
      ordemExibicao,
      tipoProduto: recorte.tipoProduto,
      material: tecido,
      corMaterial: corTecido,
      sku,
      urlImagem: recorte.urlImagem,
    };

    const formData = new FormData();
    formData.append("dto", JSON.stringify(dto));

    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `http://localhost:8080/api/recortes/${recorte.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Recorte atualizado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data);
      toast.error(
        `Erro ao atualizar recorte: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (status) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      await axios.put(
        `http://localhost:8080/api/recortes/${recorte.id}/status`,
        null,
        {
          params: { status: status ? "ATIVO" : "DESATIVADO" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAtivo(status);
      toast.success(`Status alterado para ${status ? "ATIVO" : "DESATIVADO"}`);
    } catch (err) {
      console.error("Erro detalhado:", err.response?.data);
      toast.error(
        `Erro ao atualizar status: ${
          err.response?.data?.message || err.message
        }`
      );
      setAtivo(!status);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = () => {
    confirmDialog({
      message: "Tem certeza que deseja apagar este recorte?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: async () => {
        setLoading(true);
        try {
          const token = Cookies.get("token");
          await axios.delete(
            `http://localhost:8080/api/recortes/${recorte.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          toast.success("Recorte apagado com sucesso!");
          navigate(-1);
        } catch (error) {
          console.error("Erro ao apagar:", error.response?.data);
          toast.error(
            `Erro ao apagar recorte: ${
              error.response?.data?.message || error.message
            }`
          );
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleStatusChange = (e) => {
    setAtivo(e.value);
    atualizarStatus(e.value);
  };

  return (
    <>
      <header>
        <Navbar />
      </header>

      <div className={styles.containerPrincipal}>
        <SideBar />
        <div className={styles.containerRegistrar}>
          <div className={styles.containerSalvar}>
            <div className={styles.containerTextoSalvar}>
              <IconInfo />
              <p>Alterações não salvas</p>
            </div>

            <div className={styles.containerBotaoSalvar}>
              <Botao
                onClick={handleDeletar}
                texto={"Apagar"}
                className={styles.botaoDescartar}
              />
              <Botao
                texto={"Salvar"}
                className={styles.botaoSalvar}
                onClick={handleSalvar}
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
                <h2>
                  Modelo{" "}
                  {recorte.tipoProduto === "bone_trucker"
                    ? "Trucker"
                    : recorte.tipoProduto === "bone_americano"
                    ? "Americano"
                    : ""}
                </h2>
              </div>

              <div className={styles.inputStatus}>
                <InputSwitch checked={ativo} onChange={handleStatusChange} />
                <p>status</p>
              </div>
            </div>
          </div>

          <div className={styles.containerEdicao}>
            <div className={styles.infoGerais}>
              <h3>Especificações</h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label>Nome do Modelo</label>
                  <input
                    type="text"
                    value={nomeModelo}
                    onChange={(e) => setNomeModelo(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Tipo da recorte</label>
                  <select
                    value={tipoRecorte}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTipoRecorte(value);

                      if (value === "aba") setOrdemExibicao("1");
                      else if (value === "frente") setOrdemExibicao("2");
                      else if (value === "lateral") setOrdemExibicao("3");
                    }}
                  >
                    <option value="frente">Frente</option>
                    <option value="aba">Aba</option>
                    <option value="lateral">Lateral</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Posição da imagem</label>
                  <input
                    type="text"
                    value={posicaoRecorte}
                    onChange={(e) => setPosicaoRecorte(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Ordem de exibição</label>
                  <input
                    type="number"
                    value={ordemExibicao}
                    onChange={(e) => setOrdemExibicao(e.target.value)}
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label>Tecido</label>
                  <select
                    value={tecido}
                    onChange={(e) => setTecido(e.target.value)}
                  >
                    <option value="linho">Linho</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Cor do tecido</label>
                  <select
                    value={corTecido}
                    onChange={(e) => setCorTecido(e.target.value)}
                  >
                    <option value="azul_marinho">Azul marinho</option>
                    <option value="laranja">Laranja</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.infoDados}>
              <h3>Dados do produto</h3>
              <div className={styles.field}>
                <label>SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>
              <div>
                <h4>Chave key gerada</h4>
                <div className={styles.generatedKey}>
                  {`${nomeModelo}-${tipoRecorte}-${tecido}-${corTecido}`
                    .toLowerCase()
                    .replace(/\s/g, "_")}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.containerImagem}>
            <label className={styles.labelTitulo}>Mídia</label>
            <div className={styles.imagem}>
              <div className={styles.areaUpload}>
                {previewImagem && (
                  <div className={styles.previewImagem}>
                    <img src={previewImagem} alt="Pré-visualização" />
                    <button
                      className={styles.botaoRemover}
                      onClick={removerImagem}
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className={styles.inputUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagemChange}
                    id="input-imagem"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="input-imagem" className={styles.areaInput}>
                    <div className={styles.iconeUpload}>
                      <IconUpload />
                    </div>
                    <strong>Carregar arquivo</strong>
                    <p>Escolha um arquivo ou arraste e solte aqui</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        pt={{
          root: { className: styles.confirmDialog },
          header: { className: styles.confirmHeader },
          content: { className: styles.confirmContent },
          icon: { className: styles.confirmIcon },
          footer: { className: styles.confirmFooter },
          rejectButton: { className: styles.confirmButtonCancel },
          acceptButton: { className: styles.confirmButtonDelete },
        }}
      />

      {loading && (
        <div className={styles.overlayLoading}>
          <ProgressSpinner />
        </div>
      )}
    </>
  );
};
