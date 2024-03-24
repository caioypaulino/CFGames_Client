// NavbarAdmin.js

import React from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import logo from "../../assets/navbar/Logo 2.svg";
import accountIcon from "../../assets/navbar/_2350081091120.svg";
import hamburguerIcon from "../../assets/navbar/hamburguer.svg";
import styles from "./NavbarAdmin.module.css";

function NavbarAdmin() {
    const options = [
        { value: 'produtos', label:'Produtos' },
        { value: 'categorias', label: 'Categorias' },
        { value: 'clientes', label: 'Clientes' },
        { value: 'enderecos', label: 'Endereços' },
        { value: 'enderecos_clientes', label: 'Endereços Clientes' },
        { value: 'pedidos', label: 'Pedidos' },
        { value: 'carrinhos_compra', label: 'Carrinhos de Compra' },
        { value: 'solicitacoes_troca', label: 'Solicitações de Troca' }
    ];

    const handleDropdownChange = (option) => {
        // Redirecionar para a página correspondente à opção selecionada
        window.location.href = `/admin/${option.value}`;
    };

    return (
        <header>
            <div className={styles.navbar}>
                <ul>
                    <li>
                        <a href="/"><img className="logoCF" src={logo} alt="Logo" /></a>
                    </li>
                    <li>
                        <a>Painel Administrador</a>
                    </li>
                    <li>
                        <Dropdown
                            options={options}
                            onChange={handleDropdownChange}
                            placeholder="Opções"
                            className={styles['dropdown-control']}
                            controlClassName={styles['dropdown-control']}
                            menuClassName={styles['dropdown-menu']}
                        />
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
