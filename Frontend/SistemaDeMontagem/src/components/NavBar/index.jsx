import React from "react";
import { useLocation } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import LogoNavBar from "../../assets/LogoNavBar.png";
import styles from "./styles.module.css";
import { FiLogOut } from "react-icons/fi";

export const Navbar = () => {
  const location = useLocation();
  const { logout } = useLogin();

  const isLoginPage = location.pathname === "/";

  return (
    <div className={styles.header} tabIndex={0}>
      <img
        className={styles.logo}
        src={LogoNavBar}
        alt="Logo escrito Fanation, com uma bandeira no lado esquerdo"
      />

      {!isLoginPage && (
        <button className={styles.logoutButton} onClick={logout}>
          <FiLogOut className={styles.logoutIcon} />
          <span>Sair</span>
        </button>
      )}
    </div>
  );
};
