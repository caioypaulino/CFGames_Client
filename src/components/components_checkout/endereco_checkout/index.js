import React, { useEffect, useState } from "react";
import style from "./EnderecosCheckout.module.css";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { getToken } from "../../../utils/storage";
import ResumoCheckout from "../resumo_checkout";
import { cepMask, handleCep, handleNumber } from "../../../utils/mask";

const EnderecosCheckout = (props) => {
    const {valorCarrinho, quantidade} = props;
    const [enderecosCliente, setEnderecosCliente] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
    const [frete, setFrete] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const carregarEnderecosCliente = async () => {
            const token = getToken();

            try {
                const response = await fetch('http://localhost:8080/perfil/enderecos', {
                    headers: { Authorization: "Bearer " + token }
                });

                if (!response.ok) {
                    throw new Error('Token Inválido!');
                }

                setEnderecosCliente(await response.json());
            }
            catch (error) {
                console.error('Erro ao carregar dados:', error);
                Swal.fire({ title: "Erro!", html: `Erro ao carregar endereços.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
            }
        };

        carregarEnderecosCliente();
    }, []);

    // função para abrir o formulário de adição de endereço
    const abrirPopupEndereco= () => {
        Swal.fire({
            title: "Adicionar Novo Endereço",
            html: `
                <input id="apelido" type="text" placeholder="Apelido" class="swal2-input" style="width: 18rem;">
                <input id="numero" type="text" placeholder="Número" class="swal2-input" style="width: 18rem;">
                <input id="complemento" type="text" placeholder="Complemento" class="swal2-input" style="width: 18rem;">
                <select id="tipo" className="swal2-select" style="margin-top: 1rem; padding: 0.5rem; font-size: 1.25rem; border: 1px solid #ccc; border-radius: 4px; width: 18rem; height: 3.5rem; font-family: inherit; outline: none;" onfocus="this.style.borderColor = '#b1cae3'; this.style.borderWidth = '0.25rem';" onblur="this.style.borderColor = '#ccc'; this.style.borderWidth = '1px';">
                    <option value="" selected hidden>Tipo</option>
                    <option value="0">Entrega</option>
                    <option value="1">Cobrança</option>
                    <option value="2">Residencial</option>
                    <option value="3">Geral</option>
                </select>
                <input id="cep" type="text" placeholder="CEP" maxlength="9" class="swal2-input" style="width: 18rem;">
                <input id="observacao" type="text" placeholder="Observação" class="swal2-input" style="width: 18rem;">`,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const apelido = Swal.getPopup().querySelector("#apelido").value;
                const numero = Swal.getPopup().querySelector("#numero").value;
                const complemento = Swal.getPopup().querySelector("#complemento").value;
                const tipo = Swal.getPopup().querySelector("#tipo").value;
                const cep = cepMask(Swal.getPopup().querySelector("#cep").value);
                const observacao = Swal.getPopup().querySelector("#observacao").value;
                adicionarEndereco(apelido, numero, complemento, tipo, cep, observacao);
            },
        });

        // adicionando um ouvinte de evento ao campo de CEP para chamar a função handleZipCode
        const cepInput = document.getElementById('cep');
        const numberInput = document.getElementById('numero');
        cepInput.addEventListener('input', handleCep);
        numberInput.addEventListener('input', handleNumber);
    };

    // função para adicionar um novo endereço
    const adicionarEndereco = async (apelido, numero, complemento, tipo, cep, observacao) => {
        try {
            const token = getToken();
            const response = await fetch("http://localhost:8080/perfil/add/endereco", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    apelido,
                    numero,
                    complemento,
                    tipo,
                    endereco: {
                        cep,
                    },
                    observacao,
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Endereço adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao adicionar endereço:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o endereço.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    const handleChangeEndereco = (event) => {
        setEnderecoSelecionado(event.target.value);
        calcularFrete(event.target.value);
    };

    const calcularFrete = async (enderecoSelecionado) => {
        if (enderecoSelecionado === "") {
            return Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao calcular o frete.<br><br>Nenhum endereço selecionado!`, icon: "error", confirmButtonColor: "#6085FF" })
        }

        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/pedido/calcular/frete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    id: enderecoSelecionado
                }),
            });

            if (response.ok) {
                setFrete(await response.json());
                Swal.fire({ title: "Sucesso!", text: "Frete calculado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" });
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao calcular frete:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao calcular o frete.<br><br>Carrinho de compras vazio!`, icon: "error", confirmButtonColor: "#6085FF" }).then(navigate("/carrinho"));
        }
    };

    return (
        <div className={style.selectAdress}>
            <h1>Selecione o endereço de entrega</h1>
            <form className={style.enderecoList}>
                <select className={style.selectEndereco} value={enderecoSelecionado} onChange={handleChangeEndereco}>
                    <option value="" hidden>Selecione um endereço</option>
                    {enderecosCliente.map((enderecoCliente) => (
                        <option key={enderecoCliente.id} value={enderecoCliente.id}>
                            {`${enderecoCliente.tipo}, ${enderecoCliente.apelido}, ${enderecoCliente.endereco.cep}, ${enderecoCliente.endereco.rua}, ${enderecoCliente.numero}, ${enderecoCliente.endereco.bairro}, ${enderecoCliente.endereco.cidade} - ${enderecoCliente.endereco.estado}`}
                        </option>
                    ))}
                </select>
            </form>
            <p>Endereço selecionado: {enderecoSelecionado}</p>
            <div className={style.functionsEndereco}>
                <button type="submit" className={style.btnNewAddress} onClick={abrirPopupEndereco}>Novo Endereço</button>
                <button className={style.btnCalcFrete} onClick={() => calcularFrete(enderecoSelecionado)}>Calcular Frete</button>
            </div>
            <div className="resumo">
                <ResumoCheckout
                    valorCarrinho={valorCarrinho}
                    frete={frete.price}
                    prazo={frete.delivery_time}
                    quantidade={quantidade}
                />
            </div>
        </div>
    );
}

export default EnderecosCheckout;
