import React from "react";
import Navbar from "../navbar/index";
import Footer from "../footer/index";
import styles from "./Layout.module.css";

function Layout({ children, termoBusca, setTermoBusca }) {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.contentContainer}>
        <Navbar termoBusca={termoBusca} setTermoBusca={setTermoBusca}/>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;