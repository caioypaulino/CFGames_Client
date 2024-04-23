import React from "react";
import NavbarPerfil from "../navbar_perfil";
import styles from "./Layout.module.css";

function LayoutCarrinhoCheckout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.contentContainer}>
        <NavbarPerfil />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default LayoutCarrinhoCheckout;