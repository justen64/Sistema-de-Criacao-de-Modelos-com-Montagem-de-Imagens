import React, { createContext, useContext, useEffect, useState } from "react";
import { postLogin, sair } from "../services/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const LoginContext = createContext({});

export const LoginProvider = ({ children }) => {
  const [logado, setLogado] = useState(!!Cookies.get("token"));
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    const email = localStorage.getItem("email");
    if (token) {
      setLogado(true);
      setEmail(email);
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const token = await postLogin(email, senha);
      if (!token) throw new Error("Token invalido");
      setLogado(true);
      setEmail(email);
      return true;
    } catch (erro) {
      toast.error("Erro ao realizar login, verifique as credenciais");
      console.error("Erro no login" + erro);
      throw erro;
    }
  };

  const logout = () => {
    sair();
    setLogado(false);
    setEmail("");
  };

  return (
    <LoginContext.Provider
      value={{
        logado,
        email,
        login,
        logout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
