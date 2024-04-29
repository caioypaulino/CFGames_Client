import React from "react";
import styles from "./linhaDadosPessoais.module.css";
import { cpfMask, telefoneMask, dataMaskBR, generoMask } from "../../../utils/mask";

const linhaDadosPessoais = ({ tipo, dado }) => {
    const formatarMap = {
        nome: { tipo: 'Nome'},
        cpf: { tipo: 'CPF', formatter: cpfMask },
        telefone: { tipo: 'Telefone', formatter: telefoneMask },
        dataNascimento: { tipo: 'Data de Nascimento', formatter: dataMaskBR },
        genero: { tipo: 'Gênero', formatter: generoMask }
    };

    const { tipo: tipoFormatado, formatter } = formatarMap[tipo];
    const dadoFormatado = formatter ? formatter(dado) : dado;

    return (
        <div className={styles.container}>
            <p className={styles.type}>{tipoFormatado}:</p>
            <p className={styles.data}>{dadoFormatado}</p>
        </div>
    );
};

export default linhaDadosPessoais;
