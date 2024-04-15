import React, { useEffect, useState } from "react";
import styles from "./CuponsCheckout.module.css";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import { getToken } from "../../../utils/storage";
import { valueMaskBR, dataHoraMaskBR } from "../../../utils/mask";

const CuponsCheckout = (props) => {
    const { valorTotal, cuponsPedido } = props;

    const [cuponsSelecionados, setCuponsSelecionados] = cuponsPedido;

    const [cuponsCliente, setCuponsCliente] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        carregarCuponsCliente();
    }, []);

    const carregarCuponsCliente = async () => {
        const token = getToken();

        try {
            const response = await fetch('http://localhost:8080/perfil/cupons', {
                headers: { Authorization: "Bearer " + token }
            });

            if (!response.ok) {
                throw new Error('Token Inválido!');
            }

            setCuponsCliente(await response.json());
        }
        catch (error) {
            console.error('Erro ao carregar dados:', error);
            Swal.fire({ title: "Erro!", html: `Erro ao carregar cupons.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
        }
    };

    const handleSelecionarCupom = (cupomSelecionado) => {
        console.log(cuponsSelecionados);
        console.log(cupomSelecionado)

        if (cuponsSelecionados.length > cupomSelecionado.length) {
            setCuponsSelecionados(cupomSelecionado);
        }
        else {
            if (valorTotal <= 0) {
                Swal.fire({ title: "Erro!", html: `Não é possível selecionar cupom.<br><br>Valor Total é R$ 0.00!`, icon: "error", confirmButtonColor: "#6085FF" });
            }
            else {
                setCuponsSelecionados(cupomSelecionado);
                Swal.fire({ title: "Sucesso!", text: "Desconto aplicado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" });
            }
        }
        // Verificar se o valor total é menor que 0
    
    };

return (
    <div className={styles.selectPagamento}>
        <h1>Selecione o(s) Cupom(ns) de Desconto</h1>
        <form className={styles.cupomList}>
            <Select
                id="cupons"
                class="swal2-select"
                styles={{
                    control: (provided) => ({
                        ...provided,
                        width: '65%',
                        marginTop: '3%'
                    }),
                    menu: (provided) => ({
                        ...provided,
                        width: '65%',
                    }),
                    option: (provided) => ({
                        ...provided,
                        fontSize: '1rem',
                    }),
                }}
                placeholder="Selecione Cupom(ns) de Desconto"
                options={cuponsCliente.map((cupomCliente) => ({ value: cupomCliente.codigoCupom, label: `Desconto: R$ ${valueMaskBR(cupomCliente.valorDesconto)}, Código: ${cupomCliente.codigoCupom}, Validade: ${dataHoraMaskBR(cupomCliente.validade)}`, desconto: cupomCliente.valorDesconto }))}
                isMulti
                isClearable
                isSearchable
                closeMenuOnSelect={false}
                value={cuponsSelecionados}
                onChange={handleSelecionarCupom}
            />
        </form>
        {cuponsSelecionados.length > 0 && (
            <div className={styles.cupomParcial}>
                {cuponsSelecionados.map(cupom => (
                    <div key={cupom.value} >
                        <p>Cupom: {cupom.value}</p>
                        <p>Valor do Cupom: R$ {valueMaskBR(cupom.desconto || 0)}</p>
                        <br></br>
                    </div>
                ))}
            </div>
        )}
    </div>
);
}

export default CuponsCheckout;
