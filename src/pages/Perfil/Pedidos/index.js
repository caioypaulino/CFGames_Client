import React, { useEffect, useState } from "react";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import TabelaPerfilPedidos from "../../../components/components_perfil/tabelaPerfilPedidos";
import styles from "./Pedidos.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        carregarPedidos();
    }, []); 

    const carregarPedidos = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/perfil/pedidos', {
                headers: { Authorization: "Bearer " + token }
            });

            if (response.ok) {
                const json = await response.json()
                const sortedPedidos = json.sort((a, b) => a.id - b.id); // Ordena os pedidos por ID

                setPedidos(sortedPedidos);
            }
            else {
                if (response.status === 500) {
                    throw new Error('Token Inválido!');
                }
                else if (response.status === 400) {
                    Swal.fire({ title: "Erro!", html: `Erro ao carregar pedidos!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
                }
            }
        } 
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar pedidos.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

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
