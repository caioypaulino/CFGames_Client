// Carrinho.js
import React, { useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import EnderecosCheckout from "../../components/components_checkout/enderecos_checkout";
import CartoesCheckout from "../../components/components_checkout/cartoes_checkout";
import Swal from "sweetalert2";
import { getToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
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
                        Swal.fire({ title: "Erro!", html: `Erro ao carregar carrinho de compras.<br><br>Carrinho de Compras Vazio!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/carrinho"); });
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

    return (
        <div className={styles.container}>
            <div className="resumoAndEnderecos">
                <EnderecosCheckout
                    valorCarrinho={carrinhoCompras !== undefined && carrinhoCompras.valorCarrinho || 0}
                />
                {console.log(carrinhoCompras)}
            </div>
        </div>
    );
}

export default Checkout;