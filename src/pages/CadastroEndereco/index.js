import React, { useState, useEffect } from "react";
import logoCF from "../../assets/navbar/Logo 2.svg";
import bannerCadastro from "../../assets/cadastro/cadastroEndereco.svg"
import styles from "./CadastroEndereco.module.css";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getToken } from "../../utils/storage";
import FormularioEndereco from "../../components/components_cadastro/formularioEndereco";
import CadastroService, { cadastrarEndereco } from "../../services/cadastroService";

export default function CadastroEndereco() {
    const navigate = useNavigate();

    const [enderecosDiferentes, setEnderecosDiferentes] = useState(false);

    const [enderecoEntrega, setEnderecoEntrega] = useState({
        apelido: "",
        numero: "",
        complemento: "",
        tipo: "",
        endereco: {
            cep: ""
        },
        observacao: ""
    });

    const [enderecoCobranca, setEnderecoCobranca] = useState({
        apelido: "",
        numero: "",
        complemento: "",
        tipo: "",
        endereco: {
            cep: ""
        },
        observacao: ""
    });

    const [enderecoResidencial, setEnderecoResidencial] = useState({
        apelido: "",
        numero: "",
        complemento: "",
        tipo: "",
        endereco: {
            cep: ""
        },
        observacao: ""
    });

    useEffect(() => {
        const token = getToken();

        if (!token) {
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o(s) endereço(s).<br><br>É necessário Cadastro Cliente primeiro`, icon: "error", confirmButtonColor: "#6085FF" }).then(navigate("/cadastro/cliente"));
        }
    }, []);

    const handleCheckboxChange = () => {
        setEnderecosDiferentes(!enderecosDiferentes);
    };

    const handleSubmit = async () => {
        let enderecosRequest = [];

        if (enderecosDiferentes) {
            enderecoEntrega.tipo = "ENTREGA";
            enderecoCobranca.tipo = "COBRANCA";
            enderecoResidencial.tipo = "RESIDENCIAL";

            enderecosRequest = [enderecoEntrega, enderecoCobranca, enderecoResidencial];
        }
        else {
            enderecosRequest = [enderecoEntrega];
        }

        CadastroService.cadastrarEndereco({enderecosRequest, navigate});
    };

    return (
        <div className="cadastro">
            <div className={styles.container}>
                <div className={styles.mini}>
                    <a href="/"><img className="logoCF" src={logoCF} alt="Logo" /></a>
                    <h1>Falta pouco!</h1>
                </div>
                {!enderecosDiferentes && (
                    <div className={styles.formE}>
                        <FormularioEndereco
                            title="Endereço Geral"
                            onChange={(endereco) => setEnderecoEntrega(endereco)}
                        />
                    </div>
                )}
                <div className={styles.checkbox}>
                    <input
                        type="checkbox"
                        checked={enderecosDiferentes}
                        onChange={handleCheckboxChange}
                    />
                    <label>Endereço de Entrega DIFERENTE de Cobrança e Residencial</label>
                </div>
                <button className={styles.enviar} onClick={handleSubmit}>Confirmar</button>
                {enderecosDiferentes && (
                    <div className={styles.formE1}>
                        <FormularioEndereco
                            title="Endereço Entrega"
                            onChange={(endereco) => setEnderecoEntrega(endereco)}
                        />
                    </div>
                )}
                {enderecosDiferentes && (
                    <div className={styles.formE2}>
                        <FormularioEndereco
                            title="Endereço de Cobrança"
                            onChange={(endereco) => setEnderecoCobranca(endereco)}
                        />
                    </div>
                )}
                {enderecosDiferentes && (
                    <div className={styles.formE3}>
                        <FormularioEndereco
                            title="Endereço Residencial"
                            onChange={(endereco) => setEnderecoResidencial(endereco)}
                        />
                    </div>
                )}

            </div>

            {!enderecosDiferentes && (
                <div className="image-banner">
                    <img className={styles.img_banner} src={bannerCadastro} alt="Banner" />
                </div>
            )}
        </div>
    );
}
