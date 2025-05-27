import React, { useState } from "react";
import { Navbar } from "../../components/NavBar";
import { SideBar } from "../../components/SideBar/sideBar";
import styles from "./styles.module.css";
import Botao from "../../components/Botao/botao";
import { IconInfo } from "../../assets/Icones/info";
import { IconLeftArrow } from "../../assets/Icones/leftArrow";
import { InputSwitch } from "primereact/inputswitch";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { useNavigate } from "react-router";
import { IconUpload } from "../../assets/Icones/upload";
import { toast } from "react-toastify";
import { cadastrarRecorte } from "../../services/api";
import { ProgressSpinner } from "primereact/progressspinner";

export const CadastrarPeca = () => {
  const navigate = useNavigate();

  const [ativo, setAtivo] = useState(true);
  const [imagem, setImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  const [nomeModelo, setNomeModelo] = useState("");
  const [tipoRecorte, setTipoRecorte] = useState("frente");
  const [posicaoRecorte, setPosicaoRecorte] = useState("");
  const [ordemExibicao, setOrdemExibicao] = useState("2");
  const [tecido, setTecido] = useState("linho");
  const [corTecido, setCorTecido] = useState("azul_marinho");
  const [sku, setSku] = useState("");
  const [tipoProduto, setTipoProduto] = useState("bone_trucker");

  const [loading, setLoading] = useState(false);

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

  const validarCampos = () => {
    if (!nomeModelo || !posicaoRecorte || !ordemExibicao || !sku || !imagem) {
      toast.warning(
        "Preencha todos os campos obrigatórios e selecione uma imagem."
      );
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    const dto = {
      nomeModelo,
      tipoRecorte,
      posicaoRecorte,
      ordemExibicao,
      tipoProduto,
      material: tecido,
      corMaterial: corTecido,
      sku,
      urlImagem: null,
    };

    try {
      await cadastrarRecorte(dto, imagem);
      toast.success("Recorte cadastrado com sucesso!");
      navigate(-1);
    } catch (error) {
      console.error("Erro detalhado:", error.response?.data);
      toast.error(
        `Erro ao cadastrar recorte: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (e) => {
    setAtivo(e.value);
  };

  return (
    <>
      <header>
        <Navbar />
      </header>

      <div className={styles.containerPrincipal}>
        <div className={styles.sidebar}>
          <SideBar />
        </div>
        <div className={styles.containerRegistrar}>
          <div className={styles.containerSalvar}>
            <div className={styles.containerTextoSalvar}>
              <IconInfo />
              <p>Preencha os dados para cadastrar</p>
            </div>
            <div className={styles.containerBotaoSalvar}>
              <Botao
                onClick={() => navigate(-1)}
                texto={"Cancelar"}
                className={styles.botaoDescartar}
              />
              <Botao
                texto={"Salvar"}
                className={styles.botaoSalvar}
                onClick={handleSalvar}
                disabled={loading}
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
                <h2>Novo modelo</h2>
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
                  <input type="number" value={ordemExibicao} readOnly />
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
                <label>Modelo</label>
                <select
                  value={tipoProduto}
                  onChange={(e) => setTipoProduto(e.target.value)}
                >
                  <option value="bone_trucker">Trucker</option>
                  <option value="bone_americano">Americano</option>
                </select>
              </div>

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
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
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
                    key={imagem ? imagem.name : "default"}
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
      {loading && (
        <div className={styles.overlayLoading}>
          <ProgressSpinner />
        </div>
      )}
    </>
  );
};
