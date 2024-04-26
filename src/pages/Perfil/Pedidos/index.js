import React, { useEffect, useState } from "react";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import TabelaPerfilPedidos from "../../../components/components_perfil/tabelaPerfilPedidos";
import styles from "./Pedidos.module.css";
import { useNavigate } from "react-router-dom";
import { buscarPedidos } from "../../../services/pedidoService";

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarPedidos = async () => {
            const result = await buscarPedidos(navigate);

            setPedidos(result);
        }

        carregarPedidos();
    }, []); 

    return (
        <div className={styles.container}>
            <div className={styles.tbActions}>
                <TabelaActions />
            </div>
            <div className={styles.tbInfo}>
                <TabelaPerfilPedidos pedidos={pedidos} />
            </div>
        </div>
    );
};

export default Pedidos;
