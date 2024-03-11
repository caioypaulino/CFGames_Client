// qtd_product.js
import React, { useState } from "react";
import style from "./Qtd_produto.module.css";
import polygon_icon from "../../../assets/buttons/Polygon 14.svg";

const qtd_product = (props) => {
  const { nameGame, price, developed, id, image, quantidade, atualizarQuantidade } = props;
  const [valor, setValor] = useState(quantidade); // Inicializa a variável valor com a quantidade inicial

  const incrementar = () => {
    setValor((prevValor) => prevValor + 1);
    atualizarQuantidade(id, valor + 1); // Chama a função atualizarQuantidade para atualizar a quantidade
  };

  const decrementar = () => {
    if (valor > 1) {
      setValor((prevValor) => prevValor - 1);
      atualizarQuantidade(id, valor - 1); // Chama a função atualizarQuantidade para atualizar a quantidade
    }
  };

  return (
    <div className={style.qtd_product}>
      <div
        className={style.productImageCart}
        dangerouslySetInnerHTML={{ __html: image }}
      />
      <div className={style.productInfo}>
        <p className={style.nameGame}>{nameGame}</p>
        <p>{developed}</p>
        <p className={style.price}>R$ {price * quantidade}</p>
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

export default qtd_product;
