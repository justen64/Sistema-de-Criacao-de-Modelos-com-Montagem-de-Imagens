import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/NavBar";
import { SideBar } from "../../components/SideBar/sideBar";
import styles from "./styles.module.css";
import Botao from "../../components/Botao/botao.jsx";
import { GenericTable } from "../../components/Tabela/tabela.jsx";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { buscarRecortes, getAllRecortes } from "../../services/api.js";
import { useNavigate } from "react-router";

export const Recorte = () => {
  const [recortes, setRecortes] = useState([]);
  const [recortesFiltrados, setRecortesFiltrados] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalTodos, setTotalTodos] = useState(0);
  const [totalAtivos, setTotalAtivos] = useState(0);
  const [totalExpirados, setTotalExpirados] = useState(0);
  const [filtroAtivo, setFiltroAtivo] = useState("TODOS");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllRecortes();
  }, []);

  const loadAllRecortes = async (page = 0, size = rows) => {
    try {
      const response = await getAllRecortes(page, size);
      const dados = response.content;
      const todosDados = await loadAllRecortesSemPaginacao();

      setRecortes(dados);
      setRecortesFiltrados(dados);
      setTotalTodos(todosDados.totalElements);
      setTotalAtivos(todosDados.totalAtivos);
      setTotalExpirados(todosDados.totalExpirados);
      setTotalRecords(response.totalElements);
      setFirst(page * size);
    } catch (error) {
      console.error("Erro ao carregar recortes:", error);
    }
  };

  const loadAllRecortesSemPaginacao = async () => {
    try {
      const response = await getAllRecortes(0, 9999);
      return {
        content: response.content || [],
        totalElements: response.totalElements,
        totalAtivos: response.content.filter((r) => r.status === "ATIVO")
          .length,
        totalExpirados: response.content.filter(
          (r) => r.status === "DESATIVADO"
        ).length,
      };
    } catch (error) {
      console.error("Erro ao buscar todos os recortes:", error);
      return {
        content: [],
        totalElements: 0,
        totalAtivos: 0,
        totalExpirados: 0,
      };
    }
  };

  const mostrarTodos = async () => {
    setFiltroAtivo("TODOS");
    const { content, totalElements } = await loadAllRecortesSemPaginacao();
    setRecortes(content);
    setRecortesFiltrados(content);
    setTotalTodos(totalElements);
    setTotalRecords(totalElements);
    setFirst(0);
  };

  const mostrarAtivos = async () => {
    setFiltroAtivo("ATIVOS");
    const { content, totalAtivos } = await loadAllRecortesSemPaginacao();
    const ativos = content.filter((r) => r.status === "ATIVO");
    setRecortes(content);
    setRecortesFiltrados(ativos);
    setTotalAtivos(totalAtivos);
    setTotalRecords(totalAtivos);
    setFirst(0);
  };

  const mostrarExpirados = async () => {
    setFiltroAtivo("EXPIREADOS");
    const { content, totalExpirados } = await loadAllRecortesSemPaginacao();
    const expirados = content.filter((r) => r.status === "DESATIVADO");
    setRecortes(content);
    setRecortesFiltrados(expirados);
    setTotalExpirados(totalExpirados);
    setTotalRecords(totalExpirados);
    setFirst(0);
  };
  const onPageChange = (event) => {
    const newPage = event.first / event.rows;
    setRows(event.rows);

    if (globalFilter.trim() === "") {
      loadAllRecortes(newPage, event.rows);
    } else {
      buscar(newPage, event.rows);
    }
  };

  const buscar = async (page = 0, size = rows) => {
  try {
    if (globalFilter.trim() === "") {
      await loadAllRecortes(page, size);
      return;
    }

    const todosDados = await loadAllRecortesSemPaginacao();
    let resultadoFiltrado = todosDados.content.filter((r) => {
      const filtro = globalFilter.toLowerCase();
      return (
        r.nomeModelo?.toLowerCase().includes(filtro) ||
        r.sku?.toLowerCase().includes(filtro) ||
        r.ordemExibicao?.toString().toLowerCase().includes(filtro) ||
        r.tipoRecorte?.toLowerCase().includes(filtro) ||
        r.posicaoRecorte?.toLowerCase().includes(filtro) ||
        r.tipoProduto?.toLowerCase().includes(filtro) ||
        r.material?.toLowerCase().includes(filtro) ||
        r.corMaterial?.toLowerCase().includes(filtro)
      );
    });

    if (filtroAtivo === "ATIVOS") {
      resultadoFiltrado = resultadoFiltrado.filter(
        (r) => r.status === "ATIVO"
      );
    } else if (filtroAtivo === "EXPIREADOS") {
      resultadoFiltrado = resultadoFiltrado.filter(
        (r) => r.status === "DESATIVADO"
      );
    }

    setRecortesFiltrados(resultadoFiltrado);
    setTotalRecords(resultadoFiltrado.length);
    setFirst(0);
  } catch (error) {
    console.error("Erro ao buscar recortes:", error);
    setRecortesFiltrados([]);
  }
};


  useEffect(() => {
    const timer = setTimeout(() => {
      buscar();
    }, 300);

    return () => clearTimeout(timer);
  }, [globalFilter]);

  const columns = [
    {
      field: "nomeModelo",
      header: "Título",
      body: (rowData) => (
        <span
          className={styles.linkRecorte}
          onClick={() => navigate("/atualizarPeca", { state: rowData })}
          style={{
            cursor: "pointer",
            color: "#070707",
            textDecoration: "underline",
          }}
        >
          {rowData.nomeModelo}
        </span>
      ),
    },
    { field: "sku", header: "SKU" },
    {
      field: "tipoProduto",
      header: "Tipo",
      body: (rowData) => {
        const mapTipos = {
          bone_americano: "AMERICANO",
          bone_trucker: "TRUCKER",
        };

        return (
          mapTipos[rowData.tipoProduto] ||
          rowData.tipoProduto?.toUpperCase() ||
          ""
        );
      },
    },
    { field: "ordemExibicao", header: "Ordem exibição" },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <span
          className={`${styles.statusTag} ${
            rowData.status === "DESATIVADO" ? styles.desativado : ""
          }`}
        >
          {rowData.status}
        </span>
      ),
    },
  ];

  const header = (
    <div className={styles.headerWrapper}>
      <div className={styles.filtersLeft}>
        <Button
          label={`Todos (${totalTodos})`}
          className={`p-button-text p-button-sm ${
            filtroAtivo === "TODOS" ? styles.botaoAtivo : ""
          }`}
          onClick={mostrarTodos}
        />
        <Button
          label={`Ativos (${totalAtivos})`}
          className={`p-button-text p-button-sm ${
            filtroAtivo === "ATIVOS" ? styles.botaoAtivo : ""
          }`}
          onClick={mostrarAtivos}
        />
        <Button
          label={`Expirado (${totalExpirados})`}
          className={`p-button-text p-button-sm ${
            filtroAtivo === "EXPIREADOS" ? styles.botaoAtivo : ""
          }`}
          onClick={mostrarExpirados}
        />
      </div>
      <span
        className="p-input-icon-left"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <InputText
          className={styles.searchInut}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Pesquisar..."
        />
        <Button className={styles.teste} onClick={buscar}>
          <i
            className="pi pi-search"
            style={{ color: "white", alignSelf: "center" }}
          />
        </Button>
      </span>
    </div>
  );

  const handleAdicionarPeca = () => {
    navigate("/atualizarPeca");
  };

  const handleRowClick = (e) => {
    const recorteSelecionado = e.data;
    navigate("/atualizarPeca", { state: { recorte: recorteSelecionado } });
  };

  const handleCadastrar = () => {
    navigate("/cadastrarPeca");
  };

  return (
    <>
      <header>
        <Navbar />
      </header>

      <div className={styles.containerPrincipal}>
        <div>
          <SideBar />
        </div>

        <div className={styles.containerTabela}>
          <div className={styles.containerCabecalho}>
            <h2>Peças gerais</h2>

            <Botao
              texto={"Adicionar peça"}
              className={styles.botao}
              onClick={handleCadastrar}
            />
          </div>
          <div className={styles.tabela}>
            <GenericTable
              data={recortesFiltrados}
              columns={columns}
              globalFilterFields={[
                "nomeModelo",
                "sku",
                "tipoProduto",
                "status",
              ]}
              filters={{ globalFilter }}
              header={header}
              emptyMessage="Nenhum recorte encontrado."
              first={first}
              rows={rows}
              totalRecords={totalRecords}
              onPage={onPageChange}
              className="p-datatable-sm"
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};
