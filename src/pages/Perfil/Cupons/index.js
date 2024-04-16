import React, { useEffect, useState } from "react";
import LinhaDadosCupons from "../../../components/components_perfil/linhaDadosCupons";
import TabelaActions from "../../../components/components_perfil/tabelaActions";
import styles from "./Cupons.module.css";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

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

            const cupons = await response.json();

            // Filtrando apenas os cupons disponíveis
            const cuponsDisponiveis = cupons.filter(cupom => cupom.disponivel === true);
            setCupons(cuponsDisponiveis);
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
                {Object.entries(cupons).map(([tipo, cupom]) => (
                    <LinhaDadosCupons cupom={cupom} />
                ))}
            </div>
        </div>
    );
};

export default Cupons;
