import React, { useState } from "react";
import style from "./ItemCarrinho.module.css";
import polygon_icon from "../../../assets/buttons/Polygon 14.svg";
import { atualizarQuantidade } from "../../../services/carrinhoService";

const ItemCarrinho = (props) => {
    const { itemId, produtoId, titulo, preco, publisher, image, quantidade } = props;
    const [quantidadeAtual, setQuantidadeAtual] = useState(quantidade); // Inicializa a variável valor com a quantidade inicial

    const incrementarQuantidade = () => {
        setQuantidadeAtual((prevValor) => prevValor + 1);
        atualizarQuantidade(itemId, produtoId, quantidadeAtual + 1); // Chama a função service atualizarQuantidade para atualizar a quantidade
    };

    const decrementarQuantidade = () => {
        if (quantidadeAtual > 1) {
            setQuantidadeAtual((prevValor) => prevValor - 1);
            atualizarQuantidade(itemId, produtoId, quantidadeAtual - 1); // Chama a função service atualizarQuantidade para atualizar a quantidade
        }
    };

    return (
        <div className={style.qtd_product}>
            <div
                className={style.productImageCart}
                dangerouslySetInnerHTML={{ __html: image }}
            />
            <div className={style.productInfo}>
                <p className={style.nameGame}>{titulo}</p>
                <p>{publisher}</p>
                <p className={style.price}>R$ {preco}</p>
            </div>
            <div className={style.qtdChange}>
                <p>Quantidade</p>
                <button testid="btnMinus" className={style.btnMinus} onClick={decrementarQuantidade} disabled={quantidadeAtual === 1}>
                    <img className={style.polygon} src={polygon_icon} alt="minus" />
                </button>
                <p>{quantidadeAtual}</p>
                <button testid="btnPlus" className={style.btnPlus} onClick={incrementarQuantidade}>
                    <img className={style.polygon} src={polygon_icon} alt="plus" />
                </button>
            </div>
        </div>
    );
};

export default ItemCarrinho;