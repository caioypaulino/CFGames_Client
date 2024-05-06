import React, { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import AdminProdutoService from "../../../services/Admin/adminProdutoService";
import { precoMask, precoUnmask, removeMask, valueMaskEN } from "../../../utils/mask";
let styles;

const FormFiltrarProdutos = ({
    isOpen,
    onRequestClose,
    filtro,
    setFiltro,
    produtos,
    categorias,
    setProdutosFiltrados,
    home
}) => {
    if (home) {
        styles = require("./FormFiltrarProdutosHome.module.css");
    }
    else {
        styles = require("./FormFiltrarProdutos.module.css");
    }

    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [plataformasSelecionadas, setPlataformasSelecionadas] = useState([]);
    const [statusSelecionados, setStatusSelecionados] = useState([]);

    const handleFiltrar = async () => {
        const response = await AdminProdutoService.filtrarProdutos(produtos, filtro);
        setProdutosFiltrados(response);
    };

    const handleLimpar = async () => {
        const filtroLimpo = {
            id: "",
            titulo: "",
            descricao: "",
            diaLancamento: "",
            mesLancamento: "",
            anoLancamento: "",
            marca: "",
            publisher: "",
            peso: "",
            comprimento: "",
            altura: "",
            largura: "",
            codigoBarras: "",
            quantidade: "",
            precoMin: 0,
            precoMax: Infinity,
            status: "",
            categorias: [],
            plataformas: [],
            status: []
        };

        setFiltro(filtroLimpo);
        setCategoriasSelecionadas([]);
        setPlataformasSelecionadas([]);
        setStatusSelecionados([]);

        const response = await AdminProdutoService.filtrarProdutos(produtos, filtroLimpo);
        setProdutosFiltrados(response);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Filtro Produto Modal"
            className={`${styles.modal} ${isOpen ? styles["modal-blowup"] : ""}`}
            overlayClassName={styles.overlay}
        >
            <h1>Filtrar Produtos</h1><br></br>
            <form>
                {!home &&
                    <input type="text" className={styles.swal2input} value={filtro.id} onChange={(e) => setFiltro({ ...filtro, id: removeMask(e.target.value) })} placeholder="ID" />
                }
                <input type="text" className={styles.swal2input} value={filtro.titulo} onChange={(e) => setFiltro({ ...filtro, titulo: e.target.value })} placeholder="Título" />
                <input type="text" className={styles.swal2input} value={filtro.codigoBarras} onChange={(e) => setFiltro({ ...filtro, codigoBarras: e.target.value })} placeholder="Código de Barras" />
                <input type="text" className={styles.swal2input} value={filtro.quantidade} onChange={(e) => setFiltro({ ...filtro, quantidade: removeMask(e.target.value) })} placeholder="Quantidade" />
                <div className={`${styles.inputRow} ${styles.priceInputWrapper}`}>
                    <input type="text" className={styles.swal2input} value={precoMask(filtro.precoMin)} onChange={(e) => setFiltro({ ...filtro, precoMin: precoUnmask(e.target.value) })} placeholder="Preço Mín" />
                    <input type="text" className={styles.swal2input} value={precoMask(filtro.precoMax)} onChange={(e) => setFiltro({ ...filtro, precoMax: precoUnmask(e.target.value) })} placeholder="Preço Máx" />
                </div>
                <input type="text" className={styles.swal2input} value={filtro.descricao} onChange={(e) => setFiltro({ ...filtro, descricao: e.target.value })} placeholder="Descrição" />
                <input type="text" className={styles.swal2input} value={filtro.marca} onChange={(e) => setFiltro({ ...filtro, marca: e.target.value })} placeholder="Marca" />
                <input type="text" className={styles.swal2input} value={filtro.publisher} onChange={(e) => setFiltro({ ...filtro, publisher: e.target.value })} placeholder="Publisher" />
                <div className={styles.dateFilter}>
                    <input type="text" className={`${styles.swal2input} ${styles.dateInput}`} value={removeMask(filtro.diaLancamento)} onChange={(e) => setFiltro({ ...filtro, diaLancamento: e.target.value })} placeholder="Dia" maxLength="2" />
                    <input type="text" className={`${styles.swal2input} ${styles.dateInput}`} value={removeMask(filtro.mesLancamento)} onChange={(e) => setFiltro({ ...filtro, mesLancamento: e.target.value })} placeholder="Mês" maxLength="2" />
                    <input type="text" className={`${styles.swal2input} ${styles.dateInput}`} value={removeMask(filtro.anoLancamento)} onChange={(e) => setFiltro({ ...filtro, anoLancamento: e.target.value })} placeholder="Ano" maxLength="4" />
                </div>
                <input type="number" className={styles.swal2input} value={filtro.comprimento} onChange={(e) => setFiltro({ ...filtro, comprimento: e.target.value })} placeholder="Comprimento (cm)" />
                <input type="number" className={styles.swal2input} value={filtro.largura} onChange={(e) => setFiltro({ ...filtro, largura: e.target.value })} placeholder="Largura (cm)" />
                <input type="number" className={styles.swal2input} value={filtro.altura} onChange={(e) => setFiltro({ ...filtro, altura: e.target.value })} placeholder="Altura (cm)" />
                <input type="text" className={styles.swal2input} value={filtro.peso} onChange={(e) => setFiltro({ ...filtro, peso: removeMask(e.target.value) })} placeholder="Peso (g)" />
                <Select
                    id="plataformas"
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
                    placeholder="Plataforma(s)"
                    options={[
                        { value: "XBOX360", label: "Xbox 360" },
                        { value: "XBOXONE", label: "Xbox One" },
                        { value: "XBOXS", label: "Xbox Series S" },
                        { value: "PS3", label: "PlayStation 3" },
                        { value: "PS4", label: "PlayStation 4" },
                        { value: "PS5", label: "PlayStation 5" },
                        { value: "PSP", label: "PSP" },
                        { value: "NINTENDOWII", label: "Nintendo Wii" },
                        { value: "NINTENDODS", label: "Nintendo DS" },
                        { value: "NINTENDOSWITCH", label: "Nintendo Switch" }
                    ]}
                    isMulti
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    value={plataformasSelecionadas}
                    onChange={(selectedItems) => {
                        setPlataformasSelecionadas(selectedItems || []);
                        const plataformasSelecionadas = selectedItems ? selectedItems.map(item => item.value) : [];
                        setFiltro({ ...filtro, plataformas: plataformasSelecionadas });
                    }}
                />
                <Select
                    id="categorias"
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
                    placeholder="Categorias"
                    options={categorias.map((categoria) => ({ value: categoria.id, label: categoria.nome }))}
                    isMulti
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    value={categoriasSelecionadas}
                    onChange={(selectedItems) => {
                        setCategoriasSelecionadas(selectedItems || []);
                        const categoriasSelecionadas = selectedItems ? selectedItems.map(item => item.value) : [];
                        setFiltro({ ...filtro, categorias: categoriasSelecionadas });
                    }}
                />
                <Select
                    id="plataformas"
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
                    placeholder="Status"
                    options={[
                        { value: "INATIVO", label: "Inativo" },
                        { value: "ATIVO", label: "Ativo" },
                        { value: "FORA_DE_MERCADO", label: "Fora de Mercado" }
                    ]}
                    isMulti
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    value={statusSelecionados}
                    onChange={(selectedItems) => {
                        setStatusSelecionados(selectedItems || []);
                        const statusSelecionados = selectedItems ? selectedItems.map(item => item.value) : [];
                        setFiltro({ ...filtro, status: statusSelecionados });
                    }}
                />
            </form><br></br>
            <div className={styles.buttonsContainer}>
                <button onClick={handleFiltrar} className={styles.confirmButton}>Filtrar</button>
                <button onClick={handleLimpar} className={styles.limparButton}>Limpar</button>
                <button onClick={onRequestClose} className={styles.cancelButton}>Fechar</button>
            </div>
        </Modal>
    );
};

export default FormFiltrarProdutos;