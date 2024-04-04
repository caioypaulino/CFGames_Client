// Carrinho.js
import React, { useEffect, useState } from "react";
import styles from "./Carrinho.module.css";
import ItemCarrinho from "../../components/components_carrinho/item_carrinho";
import EnderecosCheckout from "../../components/components_checkout/endereco_checkout";
import ResumoCarrinho from "../../components/components_carrinho/resumo_carrinho";
import Swal from "sweetalert2";
import { getToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import { valueMaskBR } from "../../utils/mask";

const Carrinho = () => {
    const localCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const [jogos, setJogos] = useState(localCarrinho);

    const [carrinhoCompras, setCarrinhoCompras] = useState({});
    const { itensCarrinho } = carrinhoCompras;

    const navigate = useNavigate();

    useEffect(() => {
        const carregarCarrinhoCompras = async () => {
            const token = getToken();

            try {
                const response = await fetch('http://localhost:8080/carrinhodecompra/read', {
                    headers: { Authorization: "Bearer " + token }
                });

                if (response.ok) {
                    setCarrinhoCompras(await response.json());
                }
                else {
                    if (response.status === 500) {
                        throw new Error('Token Inválido!');
                    }
                    else if (response.status === 400) {
                        setCarrinhoCompras([]);
                    }
                }
            }
            catch (error) {
                console.error('Erro ao carregar dados:', error);
                Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
            }
        };

        carregarCarrinhoCompras();
    }, []);

    const removerItemCarrinho = async (id) => {
        const token = getToken();
    
        try {
            const response = await fetch(`http://localhost:8080/carrinhodecompra/remove/itemcarrinho/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': "Bearer " + token
                }
            });
    
            if (response.ok) {
                Swal.fire({ title: "Removido!", text: "Item removido com sucesso do carrinho.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            } 
            else {
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        } 
        catch (error) {
            console.error("Erro ao remover item:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao remover item do carrinho.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
        }
    }

    const atualizarQuantidade = async (itemId, produtoId, quantidade) => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/carrinhodecompra/update', {
                method: 'PUT',
                headers: {
                    'Authorization': "Bearer " + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemCarrinhoId: itemId,
                    produtoId,
                    quantidade
                })
            });

            if (response.ok) {
                window.location.reload();
            }
            else { 
                console.error('Erro ao atualizar quantidade:', response.status);
                Swal.fire({ title: "Erro!", html: `Erro ao atualizar quantidade.<br><br>Quantidade Indisponível em Estoque`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
        } 
        catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
        }
    }

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
                            atualizarQuantidade={atualizarQuantidade} // Passando a função atualizarQuantidade como prop
                        />
                        <input className={styles.btnRemove} type="submit" value="Remover" onClick={() => removerItemCarrinho(item.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carrinho;
