import React from "react";
import NavbarAdmin from "../navbar_admin/index";
import styles from "./LayoutAdmin.module.css";

function LayoutAdmin({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <div className={styles.contentContainer}>
        <NavbarAdmin />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default LayoutAdmin;