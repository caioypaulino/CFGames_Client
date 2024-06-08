import React, { useEffect, useState } from "react";
import iconSwitch from "../../../assets/buttons/switch.svg";
import iconFilter from "../../../assets/buttons/filter.svg";
import styles from "./AdminGrafico.module.css";
import { dateTimeLocalMask, dateTimeMask2, dateTimeValido, reverterDateTimeLocalMask } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";
import FormFiltrarGrafico from "../../../components/components_filtro/FormFiltrarGrafico";
import AdminGraficoService from "../../../services/Admin/adminGraficoService";
import { Chart } from "react-google-charts";

const AdminGrafico = () => {
    const [statsProdutos, setStatsProdutos] = useState([]);
    const [statsCategorias, setStatsCategorias] = useState([]);

    const [statsProdutosFiltrados, setStatsProdutosFiltrados] = useState([]);
    const [statsCategoriasFiltradas, setStatsCategoriasFiltradas] = useState([]);

    const [dadosProdutos, setDadosProdutos] = useState([]);
    const [dadosCategorias, setDadosCategorias] = useState([]);

    const [dataInicio, setDataInicio] = useState(dateTimeMask2(new Date(2024, 0, 1, 0, 0)));
    const [dataFim, setDataFim] = useState(dateTimeMask2(new Date()));

    const [filtro, setFiltro] = useState({
        produtos: [],
        categorias: []
    });

    const [alternarGrafico, setAlternarGrafico] = useState(true);
    const [abrirFormFiltrarGrafico, setAbrirFormFiltrarGrafico] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const carregarStats = async () => {
            const responseProdutos = await AdminGraficoService.buscarStatsProdutos(dataInicio, dataFim, navigate);
            const responseCategorias = await AdminGraficoService.buscarStatsCategorias(dataInicio, dataFim, navigate);

            setStatsProdutos(responseProdutos);
            setStatsCategorias(responseCategorias);

            setStatsProdutosFiltrados(responseProdutos);
            setStatsCategoriasFiltradas(responseCategorias);
        };

        carregarStats();
    }, [dataInicio, dataFim]);

    useEffect(() => {
        const carregarDados = async () => {
            // Dados formatados para o gráfico de produtos e categorias
            const responseProdutos = await AdminGraficoService.adequarDadosGrafico(statsProdutosFiltrados, true);
            const responseCategorias = await AdminGraficoService.adequarDadosGrafico(statsCategoriasFiltradas, false);

            setDadosProdutos(responseProdutos);
            setDadosCategorias(responseCategorias);
        };

        carregarDados();

    }, [statsProdutosFiltrados, statsCategoriasFiltradas]);

    function handleAlternarGrafico() {
        setAlternarGrafico(!alternarGrafico); // Alternando entre exibição de produtos e categorias
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
        <div className={styles.container}>

            <div className={styles.grafic}>
                <form>
                    <label for="dataInicio" className={styles.label}>Data Início: </label>
                    <input id="dataInicio" type="datetime-local" className={`${styles.swal2input}`} value={dateTimeLocalMask(dataInicio)} onChange={handleChangeDataInicio} placeholder="Data Início" />
                    <label for="dataFim" className={styles.label}>Data Fim: </label>
                    <input id="dataFim" type="datetime-local" className={`${styles.swal2input}`} value={dateTimeLocalMask(dataFim)} onChange={handleChangeDataFim} placeholder="Data Final" />
                </form>
                {alternarGrafico ? (
                    <>
                        {statsProdutosFiltrados.length > 0 ? (
                            <Chart
                                chartType="LineChart"
                                width={"90%"}
                                height={550}
                                loader={<div>Carregando Gráfico</div>}
                                data={dadosProdutos}
                                options={{
                                    title: "Vendas por Produto",
                                    hAxis: { title: "Mês/Ano" },
                                    vAxis: { title: "Valor Total (R$)" },
                                    legend: { position: "right" },
                                }}
                            />
                        ) : (
                            <div>Não há dados disponíveis para exibir o gráfico de vendas por produtos.</div>
                        )}
                    </>
                ) : (
                    <>
                        {statsCategoriasFiltradas.length > 0 ? (
                            <Chart
                                chartType="LineChart"
                                width={"90%"}
                                height={550}
                                loader={<div>Carregando Gráfico</div>}
                                data={dadosCategorias}
                                options={{
                                    title: "Vendas por Categoria",
                                    hAxis: { title: "Mês/Ano" },
                                    vAxis: { title: "Valor Total (R$)" },
                                    legend: { position: "right" },
                                }}
                            />
                        ) : (
                            <div>Não há dados disponíveis para exibir o gráfico de vendas por categorias.</div>
                        )}
                    </>
                )}
            </div>
            <FormFiltrarGrafico
                isOpen={abrirFormFiltrarGrafico}
                onRequestClose={() => setAbrirFormFiltrarGrafico(false)}
                data={{ dataInicio, dataFim }}
                setData={{ setDataInicio, setDataFim }}
                filtro={filtro}
                setFiltro={setFiltro}
                alternarGrafico={alternarGrafico}
                stats={{ statsProdutos, statsCategorias }}
                setStatsFiltrados={{ setStatsProdutosFiltrados, setStatsCategoriasFiltradas }}
            />
            <div className={styles.btnIconFilter}>
                <button className={styles.btnIcon} onClick={() => setAbrirFormFiltrarGrafico(true)}>
                    <img className={styles.iconFilter} src={iconFilter} alt="Filtrar" />
                </button>
            </div>
            <div className={styles.btnIconSwitch}>
                <button className={styles.btnIcon} onClick={handleAlternarGrafico}>
                    <img className={styles.iconSwitch} src={iconSwitch} alt="Alternar" />
                </button>
            </div>
        </div>
    );
};

export default AdminGrafico;