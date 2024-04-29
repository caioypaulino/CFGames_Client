import React, { useState, useEffect } from 'react';
import banner from "../../assets/home/Banner.svg";
import styles from "./Home.module.css";
import ProdutoHome from "../../components/produtos_home";
import ProdutoService from '../../services/produtoService';

const Home = ({ termoBusca }) => {
    const [produtos, setProdutos] = useState([]);

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [produtosPorPagina] = useState(9);

    const indexUltimoProduto = paginaAtual * produtosPorPagina;
    const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;

    const produtosAtuais = produtos.slice(indexPrimeiroProduto, indexUltimoProduto);
    const totalPaginas = Math.ceil(produtos.length / produtosPorPagina);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        const response = await ProdutoService.buscarProdutos();

        setProdutos(response || []);
    }

    useEffect(() => {
        const procurarTitulo = async () => {
            const response = await ProdutoService.buscarTitulo(termoBusca, carregarProdutos);

            setProdutos(response || []);
        }

        procurarTitulo();
    }, [termoBusca]);

    const handlePaginaAnterior = () => {
        setPaginaAtual(paginaAnterior => Math.max(paginaAnterior - 1, 1));
    };

    const handleProximaPagina = () => {
        setPaginaAtual(paginaAnterior => Math.min(paginaAnterior + 1, totalPaginas));
    };

    return (
        <div className={styles.home}>
            <img className={styles.banner} src={banner} alt="Banner" />
            <h1 className={styles.titleNewProducts}>Novos produtos!</h1>
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
            <div className={styles.pagination}>
                <button className={styles.btnPaginaAnterior} onClick={handlePaginaAnterior} disabled={paginaAtual === 1}>&lt;</button>
                <span testId='paginaAtual' className={styles.paginaAtual}>{paginaAtual}</span><span className={styles.totalPaginas}>/{totalPaginas}</span>
                <button className={styles.btnPaginaProxima} onClick={handleProximaPagina} disabled={paginaAtual === totalPaginas}>&gt;</button>
            </div>
        </div>
    );
};

export default Home;