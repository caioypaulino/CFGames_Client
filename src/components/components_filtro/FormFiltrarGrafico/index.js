import React, { useEffect, useState } from "react";
import styles from "./FormFiltrarGrafico.module.css";
import Modal from "react-modal";
import Select from "react-select";
import AdminGraficoService from "../../../services/Admin/adminGraficoService";
import { dateTimeLocalMask, dateTimeMask2, dateTimeValido, reverterDateTimeLocalMask } from "../../../utils/mask";

const FormFiltrarGrafico = ({
    isOpen,
    onRequestClose,
    data,
    setData,
    filtro,
    setFiltro,
    alternarGrafico,
    stats,
    setStatsFiltrados
}) => {
    const { dataInicio, dataFim } = data;
    const { setDataInicio, setDataFim } = setData;
    const { statsProdutos, statsCategorias } = stats;
    const { setStatsProdutosFiltrados, setStatsCategoriasFiltradas } = setStatsFiltrados;

    const [produtosSelecionados, setProdutosSelecionados] = useState([]);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);

    useEffect(() => {
        const carregarFiltro = async () => {
            // Verifica se os dados iniciais estão disponíveis
            if (statsProdutos.length > 0 && statsCategorias.length > 0) {
                // Define os produtos e categorias iniciais no estado do filtro
                setFiltro({
                    produtos: await AdminGraficoService.buscarProdutosIniciais(statsProdutos),
                    categorias: await AdminGraficoService.buscarCategoriasIniciais(statsCategorias)
                });

                setProdutosSelecionados(await AdminGraficoService.buscarProdutosIniciais(statsProdutos));
                setCategoriasSelecionadas(await AdminGraficoService.buscarCategoriasIniciais(statsCategorias));
            }
        }

        carregarFiltro()
    }, [statsProdutos, statsCategorias]);

    const handleFiltrar = async () => {
        await AdminGraficoService.filtrarGrafico(statsProdutos, statsCategorias, alternarGrafico, filtro, setStatsProdutosFiltrados, setStatsCategoriasFiltradas);
    };

    const handleResetar = async () => {
        setDataInicio(dateTimeMask2(new Date(2024, 0, 1, 0, 0)));
        setDataFim(dateTimeMask2(new Date()));

        const filtroReset = {
            produtos: await AdminGraficoService.buscarProdutosIniciais(statsProdutos),
            categorias: await AdminGraficoService.buscarCategoriasIniciais(statsCategorias)
        };

        setFiltro(filtroReset);
        setProdutosSelecionados(await AdminGraficoService.buscarProdutosIniciais(statsProdutos));
        setCategoriasSelecionadas(await AdminGraficoService.buscarCategoriasIniciais(statsCategorias));

        setStatsProdutosFiltrados(statsProdutos);
        setStatsCategoriasFiltradas(statsCategorias);
    }

    const handleChangeDataInicio = (e) => {
        if (dateTimeValido(e.target.value)) {
            setDataInicio(reverterDateTimeLocalMask(e.target.value));
        }
    };

    const handleChangeDataFim = (e) => {
        if (dateTimeValido(e.target.value)) {
            setDataFim(reverterDateTimeLocalMask(e.target.value));
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Filtro Produto Modal"
            className={`${styles.modal} ${isOpen ? styles["modal-blowup"] : ""}`}
            overlayClassName={styles.overlay}
        >
            <h1>Filtrar Gráfico</h1><br></br>
            <form>
                <label for="dataInicio" className={styles.label}>Data Início:</label>
                <input id="dataInicio" type="datetime-local" className={`${styles.swal2input}`} value={dateTimeLocalMask(dataInicio)} onChange={handleChangeDataInicio} placeholder="Data Início" min="2024-01-01T00:00" />
                <label for="dataFim" className={styles.label}>Data Final:</label>
                <input id="dataFim" type="datetime-local" className={`${styles.swal2input}`} value={dateTimeLocalMask(dataFim)} onChange={handleChangeDataFim} placeholder="Data Final" min="2024-01-01T00:00" />

                {alternarGrafico ? (
                    <>
                        <label for="produtos" className={styles.label}>Produtos:</label>
                        <Select
                            id="produtos"
                            className="swal2-select"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    width: "100%",
                                    marginBottom: "2%",
                                    height: "150px",
                                    overflowY: "auto",
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
                            placeholder="..."
                            options={statsProdutos.map((stats) => ({ value: stats.produto.id, label: stats.produto.titulo })).sort((a, b) => a.label.localeCompare(b.label))}
                            isMulti
                            isClearable
                            isSearchable
                            closeMenuOnSelect={false}
                            value={produtosSelecionados}
                            onChange={(itensSelecionados) => {
                                setProdutosSelecionados(itensSelecionados || []);
                                const produtosSelecionados = itensSelecionados ? itensSelecionados.map((item) => ({ value: item.value, label: item.label })) : [];
                                setFiltro({ ...filtro, produtos: produtosSelecionados });
                            }}
                        />
                    </>
                ) : (
                    <>
                        <label for="categorias" className={styles.label}>Categorias:</label>
                        <Select
                            id="categorias"
                            className="swal2-select"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    width: "100%",
                                    marginBottom: "2%",
                                    height: "150px",
                                    overflowY: "auto",
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
                            options={statsCategorias.map((stats) => ({ value: stats.categoria.id, label: stats.categoria.nome })).sort((a, b) => a.label.localeCompare(b.label))}
                            isMulti
                            isClearable
                            isSearchable
                            closeMenuOnSelect={false}
                            value={categoriasSelecionadas}
                            onChange={(itensSelecionados) => {
                                setCategoriasSelecionadas(itensSelecionados || []);
                                const categoriasSelecionadas = itensSelecionados ? itensSelecionados.map((item) => ({ value: item.value, label: item.label })) : [];
                                setFiltro({ ...filtro, categorias: categoriasSelecionadas });
                            }}
                        />
                    </>
                )
                }
            </form><br></br>
            <div className={styles.buttonsContainer}>
                <button onClick={handleFiltrar} className={styles.confirmButton}>Filtrar</button>
                <button onClick={handleResetar} className={styles.limparButton}>Resetar</button>
                <button onClick={onRequestClose} className={styles.cancelButton}>Fechar</button>
            </div>
        </Modal>
    );
};

export default FormFiltrarGrafico;