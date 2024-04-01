import React, { useState } from "react";
import { cepMask } from "../../../utils/mask";

export default function FormularioEndereco({ title, onChange }) {

    // Importando estilos condicionalmente
    let styles;

    if (title === "Endereço Geral") {
        styles = require("./formularioEnderecoGeral.module.css");
    } 
    else {
        styles = require("./formularioEndereco.module.css");
    }

    const [cep, setCep] = useState("");
    const [complemento, setComplemento] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [pais, setPais] = useState("");
    const [tipo] = useState("GERAL");
    const [observacao, setObservacao] = useState("");
    const [apelido, setApelido] = useState("");

    const handleChange = () => {
        onChange({
            apelido,
            complemento,
            numero,
            tipo,
            endereco:{
                cep
            },
            observacao
        });
    };

    return (
        <div className={styles.form}>
            <h3>{title}</h3>
            <form>
            <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>
                            <p>CEP</p>
                            <input
                                className={styles.input}
                                type="text"
                                value={cep}
                                onChange={(e) => setCep(cepMask(e.target.value))}
                                maxLength="9"
                                onBlur={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <p>Número</p>
                            <input
                                className={styles.inputNum}
                                type="text"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                onBlur={handleChange}
                                required
                            />
                        </label>
                    </div>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>
                            <p>Complemento</p>
                            <input
                                className={styles.input}
                                type="text"
                                value={complemento}
                                onChange={(e) => setComplemento(e.target.value)}
                                onBlur={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <p>Estado</p>
                            <select
                                className={styles.select}
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                onBlur={handleChange}
                            >
                                <option value="">Selecione</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espirito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label>
                        <p>Rua</p>
                        <input
                            className={styles.input}
                            type="text"
                            value={rua}
                            onChange={(e) => setRua(e.target.value)}
                            onBlur={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label>
                        <p>Bairro</p>
                        <input
                            className={styles.input}
                            type="text"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            onBlur={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label>
                        <p>Cidade</p>
                        <input
                            className={styles.input}
                            type="text"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            onBlur={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label>
                        <p>País</p>
                        <input
                            className={styles.input}
                            type="text"
                            value={pais}
                            onChange={(e) => setPais(e.target.value)}
                            onBlur={handleChange}
                        />
                    </label>
                </div>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>
                            <p>Observação</p>
                            <input
                                className={styles.input}
                                type="text"
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                onBlur={handleChange}
                            />
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <p>Apelido</p>
                            <input
                                className={styles.inputNum}
                                type="text"
                                value={apelido}
                                onChange={(e) => setApelido(e.target.value)}
                                onBlur={handleChange}
                                required
                            />
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
}
