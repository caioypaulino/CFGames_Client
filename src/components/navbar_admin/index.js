import logo from "../../assets/navbar/Logo 2.svg";
import accountIcon from "../../assets/navbar/_2350081091120.svg";
import hamburguerIcon from "../../assets/navbar/hamburguer.svg";
import styles from "./NavbarAdmin.module.css";
import React from "react";

function NavbarAdmin() {
    return (
        <header>
            <div className={styles.navbar}>
                <ul>
                    <li>
                        <a href="/"><img className="logoCF" src={logo} alt="Logo" /></a>
                    </li>
                    <li>
                        <a href="/admin/produtos">Produtos</a>
                    </li>
                    <li>
                        <a href="/admin/clientes">Clientes</a>
                    </li>
                    <li>
                        <a href="/admin/pedidos">Pedidos</a>
                    </li>
                    <li className={styles.accountIcon}>
                        <a href="/login"><img src={accountIcon} alt="Conta" /></a>
                    </li>
                    <li>
                        <a href="/perfil/pessoal"><img src={hamburguerIcon} alt="Hamburguer" /></a>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default NavbarAdmin;