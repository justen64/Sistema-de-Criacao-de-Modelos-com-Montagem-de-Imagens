import React, { useState } from "react";
import styles from "./styles.module.css";
import { IconBone } from "../../assets/Icones/bone";
import { IconVisualizacao } from "../../assets/Icones/visualizacao";
import { IconCliente } from "../../assets/Icones/cliente";
import { NavLink } from "react-router-dom";

export const SideBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div
        className={`${styles.sidebar} ${
          isMobileMenuOpen ? styles.mobileOpen : ""
        }`}
      >
        <nav className={styles.nav}>
          <ul>
            <li className={styles.navItem}>
              <NavLink
                to="/recorte"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.inactiveLink
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>
                  <IconBone /> Peças
                </span>
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/visualizacao"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.inactiveLink
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>
                  <IconVisualizacao /> Visualização
                </span>
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/visualizacaoMontagensProntas"
                className={({ isActive }) =>
                  isActive ? styles.activeLink : styles.inactiveLink
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>
                  <IconCliente /> Clientes
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <button
        className={`${styles.mobileMenuButton} ${
          isMobileMenuOpen ? styles.menuShifted : ""
        }`}
        onClick={toggleMobileMenu}
      >
        ☰
      </button>
    </>
  );
};
