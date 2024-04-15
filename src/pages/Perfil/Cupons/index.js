import React, { useEffect, useState } from "react";
import LinhaDadosCupons from "../../../components/components_perfil/linhaDadosCupons";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import iconAdd from "../../../assets/buttons/add.svg"
import styles from "./Cupons.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";
import { handleCreditCard, handleNumber, removeMask } from "../../../utils/mask";

const Cupons = () => {
    const [cupons, setCupons] = useState({});

    const navigate = useNavigate(); // Usando useNavigate para navegação

    useEffect(() => {
        carregarCupons();
    }, []);

    const carregarCupons = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/perfil/cupons', {
                headers: { Authorization: "Bearer " + token }
            });

            if (!response.ok) {
                throw new Error('Token Inválido!');
            }

            setCupons(await response.json());
        } 
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar cupons.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tbActions}>
                <TabelaActions />
            </div>
            <div className={styles.tbInfo}>
                {Object.entries(cupons).map(([tipo, dado], index) => (
                    <LinhaDadosCupons key={index} index={index + 1} tipo={tipo} dado={dado} />
                ))}
            </div>
        </div>
    );
};

export default Cupons;
