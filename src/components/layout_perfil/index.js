import React from "react";
import NavbarPerfil from "../navbar_perfil";
import Footer from "../footer/index";
import styles from "./LayoutPerfil.module.css";

function Layout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.contentContainer}>
        <NavbarPerfil/>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;