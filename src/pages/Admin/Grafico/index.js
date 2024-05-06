import React, { useEffect, useState } from "react";
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

    // Função para converter os dados de stats em um formato aceito pelo gráfico
    const formatDataForChart = (dados, produto) => {
        let dadosGrafico = [];

        if(produto) {
            dadosGrafico = [["Mês/Ano", ...dados.map(item => item.produto && item.produto.titulo)]];
        }
        else {
            dadosGrafico = [["Mês/Ano", ...dados.map(item => item.categoria && item.categoria.nome)]];
        }

        const periodoStats = [...new Set(dados.flatMap(item => item.stats.map(stat => `${stat.mes}/${stat.ano}`)))];
        
        periodoStats.forEach(periodo => {
            const linhaStats = [periodo];   

            dados.forEach(item => {
                const matchPeriodo = item.stats.find(stat => `${stat.mes}/${stat.ano}` === periodo);
                linhaStats.push(matchPeriodo ? matchPeriodo.valorTotal : null);
            });

            dadosGrafico.push(linhaStats);
        });

        return dadosGrafico;
    };

    // Dados formatados para o gráfico de produtos e categorias
    const dataProdutos = formatDataForChart(statsProdutos, true);
    const dataCategorias = formatDataForChart(statsCategorias, false);

    return (
        <div className={styles.container}>
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

            <h2>Gráfico de Vendas por Produtos</h2>
            <Chart
                chartType="LineChart"
                width={"100%"}
                height={400}
                loader={<div>Loading Chart</div>}
                data={dataProdutos}
                options={{
                    hAxis: {
                        title: "Mês/Ano",
                    },
                    vAxis: {
                        title: "Valor Total",
                    },
                }}
            />

            <h2>Gráfico de Vendas por Categorias</h2>
            <Chart
                chartType="LineChart"
                width={"100%"}
                height={400}
                loader={<div>Loading Chart</div>}
                data={dataCategorias}
                options={{
                    hAxis: {
                        title: "Mês/Ano",
                    },
                    vAxis: {
                        title: "Valor Total",
                    },
                }}
            />
        </div>
    );
};

export default AdminGrafico;
