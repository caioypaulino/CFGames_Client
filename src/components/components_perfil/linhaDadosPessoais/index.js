import React from "react";
import styles from "./linhaDadosPessoais.module.css";
import { cpfMask, telefoneMask, dataMask } from "../../../utils/mask";

const linhaDadosPessoais = (props) => {
    let dadoFormatado = props.dado;

    // Aplicando a máscara de CPF
    if (props.tipo === 'cpf') {
        dadoFormatado = cpfMask(dadoFormatado);
    }

    // Aplicando a máscara de telefone
    if (props.tipo === 'telefone') {
        dadoFormatado = telefoneMask(dadoFormatado);
    }

    // Aplicando a máscara de data de nascimento
    if (props.tipo === 'dataNascimento') {
        dadoFormatado = dataMask(dadoFormatado);
    }

    return (
        <div className={styles.container}>
            <p className={styles.type}>{props.tipo}:</p>
            <p className={styles.data}>{dadoFormatado}</p>
        </div>
    );
};

export default linhaDadosPessoais;
