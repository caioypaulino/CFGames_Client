// Carrinho.js
import React, { useEffect, useState } from "react";
import styles from "./Carrinho.module.css";
import ItemCarrinho from "../../components/components_carrinho/item_carrinho";
import ResumoCarrinho from "../../components/components_carrinho/resumo_carrinho";
import Swal from "sweetalert2";
import { getToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import { valueMaskBR } from "../../utils/mask";
import { buscarCarrinhoCompras, removerItemCarrinho } from "../../services/carrinhoService";

const Carrinho = () => {
    const [carrinhoCompras, setCarrinhoCompras] = useState({});
    const { itensCarrinho } = carrinhoCompras;

    const navigate = useNavigate();

    useEffect(() => {
        const carregarCarrinhoCompras = async () => {
            const result = await buscarCarrinhoCompras(navigate);

            setCarrinhoCompras(result);
        }

        carregarCarrinhoCompras();
    }, []);

    return (
        <div className={styles.container}>
            <div className="resumo">
                <ResumoCarrinho
                    valorCarrinho={carrinhoCompras !== undefined && carrinhoCompras.valorCarrinho || 0}
                />
            </div>
            <div className="listProducts">
                {itensCarrinho !== undefined && itensCarrinho.sort((a, b) => a.id - b.id).map((item) => (
                    <div className={styles.containerListProduct} key={item.id}>
                        <ItemCarrinho
                            itemId={item.id}
                            produtoId={item.produto.id}
                            image={"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"red\" /></svg>"}
                            titulo={item.produto.titulo}
                            preco={valueMaskBR(item.valorItem)}
                            publisher={item.produto.publisher}
                            quantidade={item.quantidade}
                        />
                        <input className={styles.btnRemove} type="submit" value="Remover" onClick={() => removerItemCarrinho(item.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carrinho;
