// qtd_product.js
import React, { useState } from "react";
import style from "./ItemCarrinho.module.css";
import polygon_icon from "../../../assets/buttons/Polygon 14.svg";

const ItemCarrinho = (props) => {
    const { itemId, produtoId, titulo, preco, publisher, image, quantidade, atualizarQuantidade } = props;
    const [valor, setValor] = useState(quantidade); // Inicializa a variável valor com a quantidade inicial

    const incrementar = () => {
        setValor((prevValor) => prevValor + 1);
        atualizarQuantidade(itemId, produtoId, valor + 1); // Chama a função atualizarQuantidade para atualizar a quantidade
    };

    const decrementar = () => {
        if (valor > 1) {
            setValor((prevValor) => prevValor - 1);
            atualizarQuantidade(itemId, produtoId, valor - 1); // Chama a função atualizarQuantidade para atualizar a quantidade
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
                <button
                    className={style.btnMinus}
                    onClick={decrementar}
                    disabled={valor === 1}
                >
                    <img className={style.polygon} src={polygon_icon} alt="minus" />
                </button>
                <p>{valor}</p>
                <button className={style.btnPlus} onClick={incrementar}>
                    <img className={style.polygon} src={polygon_icon} alt="plus" />
                </button>
            </div>
        </div>
    );
};

export default ItemCarrinho;