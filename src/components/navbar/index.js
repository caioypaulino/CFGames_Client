import React, { useState, useEffect } from "react";
import logo from "../../assets/navbar/Logo 2.svg";
import accountIcon from "../../assets/navbar/_2350081091120.svg";
import buyIcon from "../../assets/navbar/Camada_x0020_1 (1).svg";
import searchIcon from "../../assets/navbar/Camada_x0020_1.svg";
import styles from "./Navbar.module.css";
import Swal from "sweetalert2";
import { getToken, limparToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

function Navbar({ termoBusca, setTermoBusca }) {
    const token = getToken();
    const [perfisConta, setPerfisConta] = useState({});

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            carregarConta(token);
        }
    }, []);

    const carregarConta = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/perfil/conta', {
                headers: { Authorization: "Bearer " + token }
            });

            if (!response.ok) {
                throw new Error('Token Inválido!');
            }

            const conta = await response.json();

            setPerfisConta(conta.perfis);
        }
        catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        limparToken();
        Swal.fire({ title: "Sucesso!", html: `Você foi desconectado com sucesso.`, icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
    };

    const handleChangeBusca = (event) => {
        setTermoBusca(event.target.value); // Atualiza o estado do termo de busca conforme o usuário digita
    };

    return (
        <header>
            <div className={styles.navbar}>
                <ul>
                    <li>
                        <a href="/">
                            <img className="logoCF" src={logo} alt="Logo" />
                        </a>
                    </li>
                    <li>
                        <div className={styles.searchContainer}>
                            <input testid="barrabusca" type="text" className={styles.inputText} value={termoBusca} onChange={handleChangeBusca} />
                            <img src={searchIcon} alt="Search" className={styles.searchIcon} />
                        </div>
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

export default Navbar;
