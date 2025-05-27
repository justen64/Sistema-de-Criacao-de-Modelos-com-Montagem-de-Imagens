import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

export const postLogin = async (email, senha) => {
  const resposta = await axios.post(
    `${API_URL}/auth/login`,
    {
      email,
      senha,
    },
    {
      withCredentials: true,
    }
  );

  const { token } = resposta.data;

  Cookies.set("token", token, {
    expires: 1,
    sameSite: "Lax",
  });
  localStorage.setItem("email", email);

  return token;
};

export const sair = () => {
  Cookies.remove("token");
  localStorage.removeItem("email");
};

export const getAllRecortes = async (page = 0, size = 10) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.get(
      `${API_URL}/api/recortes?page=${page}&size=${size}`,
      {
        params: {
          page,
          size,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Dados recebidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar recortes:", error);
    throw error;
  }
};

export const buscarRecortes = async (nomeModelo = "", page = 0, size = 10) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.get(`${API_URL}/api/recortes/filtro`, {
      params: {
        nomeModelo,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar recortes:", error);
    throw error;
  }
};

export const salvarModeloFinalAPI = async (modeloFinal) => {
  try {
    const token = Cookies.get("token");

    const response = await axios.post(
      `${API_URL}/modelos-finais`,
      modeloFinal,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao salvar modelo final:", error);
    throw error;
  }
};

export const cadastrarRecorte = async (dto, imagem) => {
  try {
    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("dto", JSON.stringify(dto));
    if (imagem) {
      formData.append("imagem", imagem);
    }

    const response = await axios.post(`${API_URL}/api/recortes`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erro ao cadastrar recorte:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const useModelosFinais = () => {
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/modelos-finais")
      .then((response) => {
        setModelos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar modelos finais:", error);
      });
  }, []);

  return { modelos };
};
