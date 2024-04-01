import React, { useState } from "react";
import logoCF from "../../assets/navbar/Logo 2.svg";
import bannerCadastro from "../../assets/cadastro/cadastroEndereco.svg"
import styles from "./CadastroEndereco.module.css";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getToken } from "../../utils/storage";
import FormularioEndereco from "../../components/components_cadastro/formularioEndereco";

export default function CadastroEndereco() {
    const navigate = useNavigate();

    const [enderecosDiferentes, setEnderecosDiferentes] = useState(false);

    const [enderecoEntrega, setEnderecoEntrega] = useState({
        numero: "",
        complemento: "",
        tipo: "",
        endereco: {
            cep: ""
        },
        observacao: "",
        apelido: ""
    });

    const [enderecoCobranca, setEnderecoCobranca] = useState({
        numero: "",
        complemento: "",
        tipo: "",
        endereco: {
            cep: ""
        },
        observacao: "",
        apelido: ""
    });

    const [enderecoResidencial, setEnderecoResidencial] = useState({
        numero: "",
        complemento: "",
        tipo: "",
        endereco: {
            cep: ""
        },
        observacao: "",
        apelido: ""
    });

    const handleCheckboxChange = () => {
        setEnderecosDiferentes(!enderecosDiferentes);
    };

    const handleSubmit = async () => {
        try {
            const token = getToken();

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

            // Submissão do endereço de entrega
            const response = await fetch("http://localhost:8080/cadastro/endereco", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(enderecosRequest),
            });

            // Verificação e tratamento da resposta para o endereço de entrega
            if (response.ok) {
                // Exibição de mensagem de sucesso
                Swal.fire({title: "Sucesso!", text: "Endereço(s) adicionado(s) com sucesso.", icon: "success", confirmButtonColor: "#6085FF"}).then(() => { navigate("/perfil/pessoal") });
                
            }
            else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        
        }
        catch (error) {
            console.error("Erro ao adicionar endereço:", error);
            Swal.fire({title: "Erro!", html: `Ocorreu um erro ao adicionar os endereço(s).<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF"});
        }
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
