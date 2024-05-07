import React, { useEffect, useState } from "react";
import iconSwitch from "../../../assets/buttons/switch.svg";
import iconFilter from "../../../assets/buttons/filter.svg";
import styles from "./AdminGrafico.module.css";
import { dateTimeMask2 } from "../../../utils/mask";
import { useNavigate } from "react-router-dom";
import FormFiltrarClientes from "../../../components/components_filtro/FormFiltrarClientes";
import AdminGraficoService from "../../../services/Admin/adminGraficoService";
import { Chart } from "react-google-charts";

const AdminGrafico = () => {
    const [statsProdutos, setStatsProdutos] = useState([]);
    const [statsCategorias, setStatsCategorias] = useState([]);

    const [dataProdutos, setDataProdutos] = useState([]);
    const [dataCategorias, setDataCategorias] = useState([]);

    const [filtro, setFiltro] = useState({
        id: "",
        nome: "",
        cpf: "",
        diaNascimento: "",
        mesNascimento: "",
        anoNascimento: "",
        generos: [],
        telefone: "",
        email: ""
    });

    const [alternarGrafico, setAlternarGrafico] = useState(true);
    const [abrirFormFiltrarClientes, setAbrirFormFiltrarClientes] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const carregarStats = async () => {
            const responseProdutos = await AdminGraficoService.buscarStatsProdutos(dateTimeMask2(new Date(2024, 0, 1, 0, 0)), dateTimeMask2(new Date()), navigate);
            const responseCategorias = await AdminGraficoService.buscarStatsCategorias(dateTimeMask2(new Date(2024, 0, 1, 0, 0)), dateTimeMask2(new Date()), navigate);

            setStatsProdutos(responseProdutos);
            setStatsCategorias(responseCategorias);

        };

        carregarStats();

    }, []);

    useEffect(() => {
        const carregarData = async () => {
            // Dados formatados para o gráfico de produtos e categorias
            const responseProdutos = await AdminGraficoService.adequarDadosGrafico(statsProdutos, true);
            const responseCategorias = await AdminGraficoService.adequarDadosGrafico(statsCategorias, false);

            setDataProdutos(responseProdutos);
            setDataCategorias(responseCategorias);
        };

        carregarData();

    }, [statsProdutos, statsCategorias]);

    function handleAlternarGrafico() {
        setAlternarGrafico(!alternarGrafico); // Alternando entre exibição de produtos e categorias
    }

    return (
        <div className={styles.container}>
            {console.log(dataProdutos)}
            <div className={styles.grafic}>
                {alternarGrafico ? (
                    <>
                        {statsProdutos.length > 0 ? (
                            <Chart
                                chartType="LineChart"
                                width={"90%"}
                                height={550}
                                loader={<div>Loading Chart</div>}
                                data={dataProdutos}
                                options={{
                                    title: "Vendas por Produto",
                                    hAxis: { title: "Mês/Ano" },
                                    vAxis: { title: "Valor Total" },
                                    legend: { position: "bottom" },
                                }}
                            />
                        ) : (
                            <div>Não há dados disponíveis para exibir o gráfico de vendas por produtos.</div>
                        )}
                    </>
                ) : (
                    <>
                        {statsCategorias.length > 0 ? (
                            <Chart
                                chartType="LineChart"
                                width={"90%"}
                                height={550}
                                loader={<div>Loading Chart</div>}
                                data={dataCategorias}
                                options={{
                                    title: "Vendas por Categoria",
                                    hAxis: { title: "Mês/Ano" },
                                    vAxis: { title: "Valor Total" },
                                    legend: { position: "bottom" },
                                }}
                            />
                        ) : (
                            <div>Não há dados disponíveis para exibir o gráfico de vendas por categorias.</div>
                        )}
                    </>
                )}
            </div>
            <FormFiltrarClientes
                isOpen={abrirFormFiltrarClientes}
                onRequestClose={() => setAbrirFormFiltrarClientes(false)}
                filtro={filtro}
                setFiltro={setFiltro}
            />
            <div className={styles.btnIconFilter}>
                <button className={styles.btnIcon} onClick={() => setAbrirFormFiltrarClientes(true)}>
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