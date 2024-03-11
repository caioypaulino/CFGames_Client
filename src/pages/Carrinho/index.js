// Carrinho.js
import React, { useState } from "react";
import styles from "./Carrinho.module.css";
import Qtd_product from "../../components/components_carrinho/qtd_produto";
import Enderecos from "../../components/components_carrinho/endereco";
import Resumo from "../../components/components_carrinho/resumo";

const Carrinho = () => {
  const localCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const [jogos, setJogos] = useState(localCarrinho);

  const removeFromCart = (id) => {
    const updatedCart = localCarrinho.filter((product) => product.id !== id);
    localStorage.setItem('carrinho', JSON.stringify(updatedCart));
    setJogos(updatedCart);
  }

  const atualizarQuantidade = (id, quantidade) => {
    const updatedCart = jogos.map((jogo) => {
      if (jogo.id === id) {
        return {...jogo, quantidade: quantidade};
      }
      return jogo;
    });
    localStorage.setItem('carrinho', JSON.stringify(updatedCart));
    setJogos(updatedCart);
  }

  return (
    <div className={styles.container}>
      <div className="resumoAndEnderecos">
        <Enderecos/>
      </div>
      <div className="">
        <Resumo
          price={jogos.reduce((accumulator, jogo) => accumulator + jogo.preco * jogo.quantidade, 0)}
          frete={22}
          quantidade={jogos.reduce((accumulator, jogo) => accumulator + jogo.quantidade, 0)}
        />
      </div>
      <div className="listqtdProducts">
        {jogos.map((jogo) => (
          <div className={styles.containerListProduct}>
            <Qtd_product
              key={jogo.id}
              id={jogo.id}
              image={jogo.svgString}
              nameGame={jogo.nome}
              price={jogo.preco}
              developed={jogo.desenvolvedora}
              availability={jogo.availability}
              quantidade={jogo.quantidade}
              atualizarQuantidade={atualizarQuantidade} // Passando a função atualizarQuantidade como prop
            />
            <input className={styles.btnRemove} type="submit" value="Remover" onClick={() => removeFromCart(jogo.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carrinho;
