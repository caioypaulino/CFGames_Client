import React, { useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import EnderecosCheckout from "../../components/components_checkout/enderecos_checkout";
import { useNavigate } from "react-router-dom";
import CheckoutService from "../../services/checkoutService";

const Checkout = () => {
    const [carrinhoCompras, setCarrinhoCompras] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const carregarCarrinhoCompras = async () => {
            const result = await CheckoutService.buscarCarrinhoCompras(navigate);

            setCarrinhoCompras(result);
        }

        carregarCarrinhoCompras();
    }, []);

    return (
        <div className={styles.container}>
            <div className="resumoAndEnderecos">
                <EnderecosCheckout
                    valorCarrinho={carrinhoCompras !== undefined && carrinhoCompras.valorCarrinho || 0}
                />
            </div>
        </div>
    );
}

export default Checkout;