import React, { useState, useEffect } from "react";
import logo from "../../assets/navbar/Logo 2.svg";
import accountIcon from "../../assets/navbar/_2350081091120.svg";
import buyIcon from "../../assets/navbar/Camada_x0020_1 (1).svg";
import styles from "./NavbarPerfil.module.css";
import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import ClienteService from "../../services/clienteService";

function NavbarPerfil() {
    const token = getToken();
    const [perfisConta, setPerfisConta] = useState({});

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const carregarConta = async () => {
                const response = await ClienteService.buscarPerfisConta(token);
    
                setPerfisConta(response);
            }
    
            carregarConta(token);
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        limparToken();
        Swal.fire({ title: "Sucesso!", html: `Você foi desconectado com sucesso.`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    };

    return (
        <header>
            <div className={styles.navbar}>
                <ul>
                    <div className={styles.itensEsquerda}>
                        <li>
                            <a href="/">
                                <img className="logoCF" src={logo} alt="Logo" />
                            </a>
                        </li>
                    </div>
                    <div className={styles.itensDireita}>

                    </div>
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
                                            {perfisConta.length > 0 && perfisConta.some(perfil => perfil.id === 3 && perfil.authority === "ROLE_ADMIN") && (
                                                <li><a href="/admin/produtos">Painel Administrador</a></li>
                                            )}
                                            <li><a onClick={handleLogout}>Sair</a></li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </div>
                    </li>
                    <li>
                        <a href="/carrinho">
                            <img src={buyIcon} alt="Carrinho" />
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    );
}

export default NavbarPerfil;
