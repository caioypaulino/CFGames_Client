import React, { useState } from "react";
import logoCF from "../../assets/navbar/Logo 2.svg";
import bannerLogin from "../../assets/login/undraw_login_re_4vu2 1.svg";
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { salvarToken } from "../../utils/storage";
import Swal from 'sweetalert2';

export default function login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                const data = await response.json();

                console.log(data);

                salvarToken(data.token);

                Swal.fire({ title: "Login realizado com sucesso!", text: "Seja Bem-vindo(a)", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate("/perfil/pessoal") });
            }
            else {
                // Lidar com um erro de autenticação
                Swal.fire({ title: "Email ou Senha inválidos!", text: "Digite novamente.", icon: "error", confirmButtonColor: "#6085FF" })
            }
        }
        catch (error) {
            console.error(error);
            Swal.fire(error, '', "error");
            // Lidar com um erro de rede
        }
    };

    return (
        <div className="login">
            <div className={styles.container}>
                <div className={styles.images}>
                    <a href="/"><img className="logoCF" src={logoCF} /></a>
                    <img className={styles.img_banner} src={bannerLogin} />
                </div>
                <div className={styles.form}>
                    <form onSubmit={handleSubmit}>
                        <h1>Faça seu login!</h1><br></br>
                        <label>
                            <p>Email</p>
                            <input
                                type="text"
                                value={email}
                                className={styles.input}
                                onChange={(e) => setEmail(e.target.value)}
                            /><br />
                        </label>
                        <label>
                            <p>Senha</p>
                            <input
                                type="password"
                                value={senha}
                                className="password"
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </label><br />
                        <input className={styles.enviar} type="submit" />
                    </form><br />
                    <div className={styles.lastP}>
                        <p>Não possui uma conta? <Link className={styles.link} to="/cadastro/cliente">  Registrar-se</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
