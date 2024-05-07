import React, { useState } from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import logo from "../../assets/navbar/Logo 2.svg";
import accountIcon from "../../assets/navbar/_2350081091120.svg";
import styles from "./NavbarAdmin.module.css";
import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

function NavbarAdmin() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const token = getToken();

    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        limparToken();
        Swal.fire({ title: "Sucesso!", html: `Você foi desconectado com sucesso.`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    };

    const options = [
        { value: 'produtos', label: 'Produtos' },
        { value: 'categorias', label: 'Categorias' },
        { value: 'clientes', label: 'Clientes' },
        { value: 'enderecos', label: 'Endereços' },
        { value: 'enderecos_clientes', label: 'Endereços Clientes' },
        { value: 'pedidos', label: 'Pedidos' },
        { value: 'carrinhos_compra', label: 'Carrinhos de Compra' },
        { value: 'solicitacoes_troca_devolucao', label: 'Solicitações de Troca/Devolução' },
        { value: 'cupons', label: 'Cupons' },
        { value: 'grafico', label: 'Gráfico' }
    ];

    const handleDropdownChange = (option) => {
        // Redirecionar para a página matchnte à opção selecionada
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
                        <a className={styles.navbarA}>Painel Administrador</a>
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
                    <li>
                        <div className={styles.dropdown}>
                            <img src={accountIcon} alt="Account" onClick={toggleDropdown} />
                            {dropdownOpen && (
                                <ul className={styles.dropdownContent}>
                                    {!token ? (
                                        <>
                                            <li><a href="/login">Login</a></li>
                                            <li><a href="/cadastro/cliente">Cadastre-se</a> </li>
                                        </>
                                    ) : (
                                        <>
                                            <li><a href="/perfil/pessoal">Meu Perfil</a></li>
                                            <li><a onClick={handleLogout}>Sair</a></li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default NavbarAdmin;
