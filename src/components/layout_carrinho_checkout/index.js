import React from "react";
import Navbar from "../navbar/index";
import styles from "./Layout.module.css";

function LayoutCarrinhoCheckout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.contentContainer}>
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default LayoutCarrinhoCheckout;