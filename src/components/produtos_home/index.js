import React from "react";
import style from "./ProdutosHome.module.css";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import { dataMaskBR2 } from "../../utils/mask";
import imagemExemplo from "../../assets/products/image 3.svg";
import { getToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

function ProdutoHome(props) {

    const { key, imagem, produto } = props;

    const navigate = useNavigate();
    const SwalJSX = withReactContent(Swal)

    // Abre um modal com os detalhes do produto usando o SweetAlert2
    const abrirPopupInfo = (produto) => {
        let nomesCategorias = produto.categorias.map(categoria => categoria.nome).join(', ');

        // Quantidade Select
        let opcoesQuantidade = [];

        for (let i = 1; i <= produto.quantidade; i++) {
            opcoesQuantidade.push(<option value={i}>{i}</option>);
        }

        const InfoProduto = () => (
            <div className={style.productContainer}>
                <div className={style.imgContainer}>
                    {/* Aqui você pode substituir pela URL da imagem do produto */}
                    <img className={style.productImage} src={imagemExemplo} alt="Imagem do Produto" />
                </div>
                <div className={style.productInfo}>
                    <p className={style.precoProduto}>R$ {produto.preco}</p>
                    <p>Quantidade Disponível: {produto.quantidade}</p>
                    <p>Plataforma: {produto.plataforma}</p>
                    <p>Descrição: {produto.descricao}</p>
                    <p>Categoria(s): {produto.categorias.length > 0 ? nomesCategorias : ''}</p>
                    <p>Marca: {produto.marca}</p>
                    <p>Editora: {produto.publisher}</p>
                    <p>Data de Lançamento: {dataMaskBR2(produto.dataLancamento)}</p>
                    <p>Peso: {produto.peso + 'g'}</p>
                    <p>Dimensões (C x L x A): {produto.comprimento}cm x {produto.largura}cm x {produto.altura}cm</p>
                </div>
            </div>
        );

        SwalJSX.fire({
            title: `<h2 style='color:#011640'>${produto.titulo}</h2>`,
            html: (
                <InfoProduto />
            ),
            showCancelButton: true,
            confirmButtonText: "Comprar",
            confirmButtonColor: "#011640",
            cancelButtonText: "Fechar",
            showDenyButton: true,
            denyButtonText: "Adicionar ao Carrinho",
            denyButtonColor: "#6085FF",
            width: '80rem'
        }).then((result) => {
            if (result.isConfirmed) {
                adicionarCarrinho(produto, 1);
                navigate("/carrinho");
            }
            else if (result.isDenied) { // Se o botão "Adicionar ao Carrinho" for clicado
                SwalJSX.fire({
                    title: `<h2 style='color:#011640'>Adicionar ao Carrinho</h2><h5 style='margin-bottom:-1rem'>Selecione a quantidade</h5>`,
                    html: (
                        <select id="quantidadeSelect" className="swal2-select" style={{ marginTop: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: '1px solid #ccc', borderRadius: '4px', width: '16.3rem', height: '3.5rem', fontFamily: 'inherit', outline: 'none' }} defaultValue={produto.status} onFocus={(e) => e.target.style.borderColor = '#b1cae3'} onBlur={(e) => e.target.style.borderColor = '#ccc'}>
                            <option value="1" selected hidden>1</option>
                            {opcoesQuantidade}
                        </select>
                    ),
                    showCancelButton: true,
                    confirmButtonText: "Adicionar",
                    confirmButtonColor: "#6085FF",
                    cancelButtonText: "Voltar",
                    preConfirm: () => {
                        const quantidadeSelecionada = Swal.getPopup().querySelector("#quantidadeSelect").value;

                        adicionarCarrinho(produto, quantidadeSelecionada);
                    },
                }).then((result) => {
                    if (result.isDismissed) {
                        abrirPopupInfo(produto);
                    }
                })
            }
        });
    };

    // função para adicionar um carrinho de compras
    const adicionarCarrinho = async (produto, quantidadeSelecionada) => {
        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/carrinhodecompra/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    itensCarrinho: [
                        {
                            produto: {
                                id: produto.id
                            },
                            quantidade: quantidadeSelecionada
                        }
                    ]
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Item(ns) adicionado(s) com sucesso ao carrinho de compras.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                adicionarItemCarrinho(produto, quantidadeSelecionada);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao adicionar item:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar item(ns) ao carrinho de compras.<br><br>Faça login novamente!<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

    const adicionarItemCarrinho = async (produto, quantidadeSelecionada) => {
        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/carrinhodecompra/add/itemcarrinho", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    produto: {
                        id: produto.id
                    },
                    quantidade: quantidadeSelecionada
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Item(ns) adicionado(s) com sucesso ao carrinho de compras.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao adicionar item:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar item(ns) ao carrinho de compras.<br><br>Faça login novamente!<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    return (
        <div className={style.productGame}>
            <div dangerouslySetInnerHTML={{ __html: imagem }} />
            <p className={style.paragraph}>{produto.titulo}</p>
            <p className={style.paragraph}>{produto.plataforma}</p>
            <p className={style.price}>R$ {produto.preco}</p>
            <input testid={`btnComprar`} className={style.btnComprar} value="Comprar" type="submit" onClick={() => abrirPopupInfo(produto)} />
        </div>
    );
}

export default ProdutoHome;
