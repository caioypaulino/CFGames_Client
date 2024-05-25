import React, { useEffect, useState } from "react";
import styles from "./Checkout.module.css";
import Swal from "sweetalert2";
import EnderecosCheckout from "../../components/components_checkout/enderecos_checkout";
import { useNavigate } from "react-router-dom";
import CarrinhoService from "../../services/carrinhoService";

const Checkout = () => {
    const [carrinhoCompras, setCarrinhoCompras] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const carregarCarrinhoCompras = async () => {
            const response = await CarrinhoService.buscarCarrinhoComprasCheckout(navigate);

            setCarrinhoCompras(response);
        }

        carregarCarrinhoCompras();
    }, []);

    return (
        <div className={styles.container}>
            {console.log(carrinhoCompras)}
            <div className="resumoAndEnderecos">
                <EnderecosCheckout
                    valorCarrinho={carrinhoCompras !== undefined && carrinhoCompras.valorCarrinho || 0}
                />
            </div>
        </div>
    );
}

export default Checkout;