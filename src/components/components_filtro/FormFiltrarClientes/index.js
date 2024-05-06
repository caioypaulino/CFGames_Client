import React, { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import styles from "./FormFiltrarClientes.module.css";
import AdminClienteService from "../../../services/Admin/adminClienteService";
import { cpfMask, generoMask, removeMask, telefoneMask } from "../../../utils/mask";

// Abrir o modal de troca/devolução do pedido
const FormFiltrarClientes = ({
    isOpen,
    onRequestClose,
    filtro,
    setFiltro,
    clientes,
    setClientesFiltrados
}) => {
    const generosOptions = (["MASCULINO", "FEMININO", "OUTRO", "NAO_INFORMAR"]);

    const [generosSelecionados, setGenerosSelecionados] = useState([]);

    const handleFiltrar = async () => {
        const response = await AdminClienteService.filtrarClientes(clientes, filtro);

        setClientesFiltrados(response);
    };

    const handleLimpar = async () => {
        const filtroLimpo = {
            id: "",
            nome: "",
            cpf: "",
            diaNascimento: "",
            mesNascimento: "",
            anoNascimento: "",
            generos: [],
            telefone: "",
            email: ""
        };

        setFiltro(filtroLimpo);
        setGenerosSelecionados([]);

        const response = await AdminClienteService.filtrarClientes(clientes, filtroLimpo);

        setClientesFiltrados(response);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Filtro Cliente Modal"
            className={`${styles.modal} ${isOpen ? styles["modal-blowup"] : ""}`}
            overlayClassName={styles.overlay}
        >
            <h1>Filtrar Clientes</h1><br></br>
            <form>
                <input type="text" className={styles.swal2input} value={filtro.id} onChange={(e) => setFiltro({ ...filtro, id: removeMask(e.target.value) })} placeholder="ID" />
                <input type="text" className={styles.swal2input} value={filtro.nome} onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })} placeholder="Nome" />
                <input type="text" className={styles.swal2input} value={cpfMask(filtro.cpf)} onChange={(e) => setFiltro({ ...filtro, cpf: removeMask(e.target.value) })} placeholder="CPF" maxLength="14" />
                <div className={styles.dateFilter}>
                    <input type="text" className={`${styles.swal2input} ${styles.dateInput}`} value={removeMask(filtro.diaNascimento)} onChange={(e) => setFiltro({ ...filtro, diaNascimento: e.target.value })} placeholder="Dia" maxLength="2" />
                    <input type="text" className={`${styles.swal2input} ${styles.dateInput}`} value={removeMask(filtro.mesNascimento)} onChange={(e) => setFiltro({ ...filtro, mesNascimento: e.target.value })} placeholder="Mês" maxLength="2" />
                    <input type="text" className={`${styles.swal2input} ${styles.dateInput}`} value={removeMask(filtro.anoNascimento)} onChange={(e) => setFiltro({ ...filtro, anoNascimento: e.target.value })} placeholder="Ano" maxLength="4" />
                </div>
                <Select
                    id="generos"
                    className="swal2-select"
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            width: "100%",
                            marginBottom: "2%",
                        }),
                        menu: (provided) => ({
                            ...provided,
                            width: "100%",
                        }),
                        option: (provided) => ({
                            ...provided,
                            fontSize: "1rem",
                        }),
                    }}
                    placeholder="Gênero(s)"
                    options={generosOptions && generosOptions.map((genero) => ({ value: genero, label: `${generoMask(genero)}` }))}
                    isMulti
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    value={generosSelecionados}
                    onChange={(itensSelecionados) => {
                        setGenerosSelecionados(itensSelecionados || []); // Atualiza a variável de estado com os gêneros selecionados
                        const generosSelecionados = itensSelecionados ? itensSelecionados.map(item => item.value) : [];
                        setFiltro({ ...filtro, generos: generosSelecionados }); // Atualiza o estado do filtro de gênero
                    }}
                />
                <input type="text" className={styles.swal2input} value={telefoneMask(filtro.telefone)} onChange={(e) => setFiltro({ ...filtro, telefone: removeMask(e.target.value) })} placeholder="Telefone" maxLength="15" />
                <input type="text" className={styles.swal2input} value={filtro.email} onChange={(e) => setFiltro({ ...filtro, email: e.target.value })} placeholder="Email" />
            </form><br></br>
            <div className={styles.buttonsContainer}>
                <button onClick={handleFiltrar} className={styles.confirmButton}>Filtrar</button>
                <button onClick={handleLimpar} className={styles.limparButton}>Limpar</button>
                <button onClick={onRequestClose} className={styles.cancelButton}>Fechar</button>
            </div>
        </Modal >
    );
};

export default FormFiltrarClientes;
