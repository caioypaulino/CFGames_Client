import React from "react";
import Navbar from "../navbar/index";
import Footer from "../footer/index";
import styles from "./Layout.module.css";

function Layout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.contentContainer}>
        <Navbar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;