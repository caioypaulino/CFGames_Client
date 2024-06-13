import React, { useState, useEffect } from 'react';
import banner from "../../assets/home/Banner.svg";
import iconFilter from "../../assets/buttons/filter.svg";
import iconGemini from "../../assets/buttons/gemini.svg";
import styles from "./Home.module.css";
import Swal from "sweetalert2";
import ProdutoHome from "../../components/produtos_home";
import ProdutoService from '../../services/produtoService';
import GeminiService from '../../services/geminiService';
import FormFiltrarProdutos from '../../components/components_filtro/FormFiltrarProdutos';

const Home = ({ termoBusca }) => {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [produtosFiltrados, setProdutosFiltrados] = useState([]);

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [produtosPorPagina] = useState(9);

    const indexUltimoProduto = paginaAtual * produtosPorPagina;
    const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;

    const produtosAtuais = produtosFiltrados.slice(indexPrimeiroProduto, indexUltimoProduto);
    const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);

    const [filtro, setFiltro] = useState({
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
    });

    const [abrirFormFiltrarProdutos, setAbrirFormFiltrarProdutos] = useState(false);

    useEffect(() => {
        carregarProdutos();
        carregarCategorias();
    }, []);

    useEffect(() => {
        const procurarTitulo = async () => {
            const response = await ProdutoService.buscarTitulo(termoBusca, carregarProdutos);

            setProdutos(response || []);
            setProdutosFiltrados(response || []);
        }

        procurarTitulo();
    }, [termoBusca]);

    const carregarProdutos = async () => {
        const response = await ProdutoService.buscarProdutos();

        setProdutos(response || []);
        setProdutosFiltrados(response || []);
    };

    const carregarCategorias = async () => {
        const response = await ProdutoService.buscarCategorias();

        setCategorias(response);
    };

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    const abrirPopupGemini= () => {
        Swal.fire({
            title: `<h3 style='color:#011640; margin-bottom:-1%; margin-top:-1%'>Saiba mais sobre seus Games Favoritos!</h3>`,
            html: `
                <input id="nomeJogo" type="text" class="swal2-input" required placeholder="Nome do Jogo">
            `,
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Fechar",
            icon: "info",
            width: '40%',
            preConfirm: () => {
                const nomeJogo = Swal.getPopup().querySelector('#nomeJogo').value;

                GeminiService.buscarGemini(nomeJogo, styles);
            },
        });
    };

    return (
        <div className={styles.home}>
            <img className={styles.banner} src={banner} alt="Banner" />
            <h1 className={styles.titleNewProducts}>Melhores Produtos!</h1>
            <div className={styles.listProducts}>
                {produtosAtuais.map((produto, index) => (
                    <div key={index}>
                        <ProdutoHome
                            imagem={"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"red\" /></svg>"}
                            produto={produto}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.filtro}>
                <FormFiltrarProdutos
                    isOpen={abrirFormFiltrarProdutos}
                    onRequestClose={() => setAbrirFormFiltrarProdutos(false)}
                    filtro={filtro}
                    setFiltro={setFiltro}
                    produtos={produtos}
                    categorias={categorias}
                    setProdutosFiltrados={setProdutosFiltrados}
                    home={true}
                />
            </div>
            <div className={styles.pagination}>
                <button className={styles.btnPaginaAnterior} onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>&lt;</button>
                <span testId='paginaAtual' className={styles.paginaAtual}>{paginaAtual}</span><span className={styles.totalPaginas}>/{totalPaginas}</span>
                <button className={styles.btnPaginaProxima} onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>&gt;</button>
            </div>
            <div className={styles.btnIconFilter}>
                <button className={styles.btnIcon} onClick={() => setAbrirFormFiltrarProdutos(true)}>
                    <img className={styles.iconFilter} src={iconFilter} alt="Filtrar" />
                </button>
            </div>
            <div className={styles.btnIconGemini}>
                <button className={styles.btnIcon} onClick={() => abrirPopupGemini()}>
                    <img className={styles.iconGemini} src={iconGemini} alt="Gemini" />
                </button>
            </div>
        </div>
    );
};

export default Home;