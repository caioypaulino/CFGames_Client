import React, { useState } from "react";
import logoCF from "../../assets/navbar/Logo 2.svg";
import bannerLogin from "../../assets/login/undraw_login_re_4vu2 1.svg";
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginUsuario } from "../../services/loginService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        loginUsuario(email, senha, navigate)
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
