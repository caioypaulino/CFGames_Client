import React, { useState } from "react";
import logoCF from "../../assets/navbar/Logo 2.svg";
import bannerCadastro from "../../assets/cadastro/undraw_old_day_-6-x25 1.svg";
import styles from "./CadastroCliente.module.css";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { removeMask, cpfMask, telefoneMask, dataMaskEN } from '../../utils/mask';
import { salvarToken } from "../../utils/storage";

export default function CadastroCliente() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [genero, setGenero] = useState("MASCULINO");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/cadastro/cliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    cpf: removeMask(cpf), // Removendo a máscara do CPF
                    dataNascimento: dataMaskEN(dataNascimento), // Inserindo máscara de data
                    genero,
                    telefone: removeMask(telefone), // Removendo a máscara do telefone
                    email,
                    senha,
                    confirmaSenha
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Cadastro realizado com sucesso!", text: "Cliente cadastrado.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => {
                    loginAutomatico(email, senha);
                    navigate("/cadastro/endereco");
                });

            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao cadastrar o cliente:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao cadastrar o cliente.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    const loginAutomatico = async (email, senha) => {
        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                const data = await response.json();

                salvarToken(data.token);
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            console.error("Erro ao fazer login automaticamente:", error);
            Swal.fire({ title: "Erro!", text: "Não foi possível fazer login automaticamente após o cadastro.", icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    return (
        <div className="cadastro">
            <div className={styles.container}>
                <div className={styles.form}>
                    <a href="/"><img className="logoCF" src={logoCF} alt="Logo" /></a>
                    <form onSubmit={handleSubmit}>
                        <h1>Criar conta</h1><br></br>
                        <label>
                            <p>Nome completo</p>
                            <input
                                className={styles.input}
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </label><br />
                        <label>
                            <p>CPF</p>
                            <input
                                className={styles.input}
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(cpfMask(e.target.value))}
                                maxlength="14"
                            />
                        </label><br />
                        <label>
                            <p>Data de nascimento</p>
                            <input
                                className={styles.date}
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                            />
                        </label><br />
                        <label>
                            <p>Telefone</p>
                            <input
                                className={styles.input}
                                type="text"
                                value={telefone}
                                onChange={(e) => setTelefone(telefoneMask(e.target.value))}
                                maxlength="15"
                            />
                        </label><br />
                        <label>
                            <p>Gênero</p>
                            <select
                                className={styles.select}
                                value={genero}
                                onChange={(e) => setGenero(e.target.value)}
                            >
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                                <option value="OUTRO">Outro</option>
                                <option value="NAO_INFORMAR">Não Informar</option>
                            </select>
                        </label><br />
                        <label>
                            <p>Email</p>
                            <input
                                className={styles.input}
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            /><br />
                        </label>
                        <label>
                            <p>Senha</p>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </label><br />
                        <label>
                            <p>Confirmação da Senha</p>
                            <input
                                type="password"
                                value={confirmaSenha}
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                            />
                        </label><br />
                        <input className={styles.enviar} type="submit" value="Continuar" />
                        <div className={styles.lastP}>
                            <p>Já possui uma conta? <Link className={styles.link} to="/Login">Entrar</Link></p>
                        </div>
                    </form>
                </div>
                <div className="image-banner">
                    <img className={styles.img_banner} src={bannerCadastro} alt="Banner" />
                </div>
            </div>
        </div>
    );
}
