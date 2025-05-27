import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/NavBar";
import styles from "./styles.module.css";
import LogoLogin from "../../assets/LogoLogin.png";
import InputPequeno from "../../components/InputPequeno/InputPequeno.jsx";
import Botao from "../../components/Botao/botao.jsx";
import { useNavigate } from "react-router";
import { useLogin } from "../../context/LoginContext.jsx";
import { toast } from "react-toastify";
import Desenvolvido from "../../assets/image.png";

export function Login() {
  const [isMobile, setIsMobile] = useState(false);

  let navigate = useNavigate();
  const { logado, login } = useLogin();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState({ email: "", senha: "" });

  const validar = () => {
    const erros = { email: "", senha: "" };

    if (!email.trim()) {
      erros.email = "Preencha o email!";
    }

    if (!senha.trim()) {
      erros.senha = "Preencha a senha!";
    }

    setErro(erros);
    return !erros.email && !erros.senha;
  };

  const handleLogin = async () => {
    if (validar()) {
      try {
        const logado = await login(email, senha);
        toast.success("Você logou com sucesso!");
        if (logado) navigate("/recorte");
      } catch (erro) {
        console.log("ERRO: " + erro);
      }
    } else {
      toast.error("Verifique os campos.");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!isMobile && (
        <header>
          <Navbar />
        </header>
      )}
      <div className={styles.containerPrincipal}>
        <div className={styles.containerLogin}>
          <img src={LogoLogin} alt="" />
          <h3>Bem-vindo ao Fanation</h3>
          <h5>Acesse a sua conta para iniciar</h5>
          <div className={styles.inputLogin}>
            <label htmlFor="emailInput">inserir email</label>
            <InputPequeno
              id="emailInput"
              type="text"
              placeholder="Digite seu Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              erro={erro.email}
            />
            <label>inserir senha</label>
            <InputPequeno
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              erro={erro.senha}
            />

            <Botao
              texto={"Acessar"}
              className={styles.botao}
              onClick={handleLogin}
            />
          </div>
        </div>
        <div className={styles.footerImagem}>
          <img
            className={styles.imagemDesenvolvido}
            src={Desenvolvido}
            alt="Site desenvolvido pela SeuBoné"
          />
        </div>
      </div>
    </>
  );
}
