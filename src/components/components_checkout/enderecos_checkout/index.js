import React, { useEffect, useState } from "react";
import style from "./EnderecosCheckout.module.css";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import ResumoCheckout from "../resumo_checkout";
import { cepMask, handleCep, handleNumber } from "../../../utils/mask";
import EnderecoService from "../../../services/enderecoService";
import CheckoutService from "../../../services/checkoutService";

const EnderecosCheckout = (props) => {
    const { valorCarrinho } = props;
    
    const [enderecosCliente, setEnderecosCliente] = useState([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState("");
    const [frete, setFrete] = useState({});

    const [enderecoAdicionado, setEnderecoAdicionado] = useState({});

    const navigate = useNavigate();

    // carregando enderecosCliente por padrão
    useEffect(() => {
        carregarEnderecosCliente();
    }, []);

    // Verifica se a página está sendo fechada ou recarregada
    useEffect(() => {
        const handleUnload = async () => {
            if (enderecoAdicionado.id && !enderecoAdicionado.salvar) {
                await EnderecoService.excluirEnderecoCheckout(enderecoAdicionado.id, carregarEnderecosCliente);
            }
        };
    
        const handleBeforeUnload = async () => {
            if (enderecoAdicionado.id && !enderecoAdicionado.salvar) {
                await EnderecoService.excluirEnderecoCheckout(enderecoAdicionado.id, carregarEnderecosCliente);
            }
        };
    
        window.addEventListener('unload', handleUnload);
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('unload', handleUnload);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [enderecoAdicionado]);

    useEffect(() => {
        const novoEndereco = enderecosCliente.find(endereco => endereco.id === enderecoAdicionado.id);

        if (enderecoAdicionado.id && novoEndereco) {
            const enderecoSelecionadoObj = {
                value: novoEndereco.id,
                label: `${novoEndereco.tipo}, ${novoEndereco.apelido}, ${novoEndereco.endereco.cep}, ${novoEndereco.endereco.rua}, ${novoEndereco.numero}, ${novoEndereco.endereco.bairro}, ${novoEndereco.endereco.cidade} - ${novoEndereco.endereco.estado}`
            };

            setEnderecoSelecionado(enderecoSelecionadoObj);

            CheckoutService.calcularFrete(enderecoSelecionadoObj, setFrete, navigate);
        }
    }, [enderecoAdicionado, enderecosCliente]);

    const carregarEnderecosCliente = async () => {
        const response = await EnderecoService.buscarEnderecos(navigate);

        setEnderecosCliente(response);
    }

    // função para abrir o formulário de adição de endereço
    const abrirPopupEndereco = () => {
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
                <input id="observacao" type="text" placeholder="Observação" class="swal2-input" style="width: 18rem;">
                <div>
                    <input id="salvarNoPerfil" type="checkbox" checked style="margin-top:1rem; margin-right: 0.5rem;">
                    <label for="salvarNoPerfil">Salvar ao Perfil</label>
                </div>
            `,
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
                const salvarNoPerfil = document.getElementById('salvarNoPerfil').checked;

                const adicionarEndereco = async () => {
                    if (!enderecoAdicionado.salvar && enderecoAdicionado.id) {
                        EnderecoService.excluirEnderecoCheckout(enderecoAdicionado.id, carregarEnderecosCliente);
                    }

                    const novoEnderecoId = await EnderecoService.adicionarEnderecoCheckout(apelido, numero, complemento, tipo, cep, observacao);
                    
                    if (novoEnderecoId) {
                        setEnderecoAdicionado({ id: novoEnderecoId, salvar: salvarNoPerfil });
                        carregarEnderecosCliente();
                    }
                }

                adicionarEndereco();
            },
        });

        // adicionando um ouvinte de evento ao campo de CEP para chamar a função handleZipCode
        const cepInput = document.getElementById('cep');
        const numberInput = document.getElementById('numero');
        cepInput.addEventListener('input', handleCep);
        numberInput.addEventListener('input', handleNumber);
    };

    const handleChangeEndereco = (enderecoCliente) => {
        setEnderecoSelecionado(enderecoCliente);

        CheckoutService.calcularFrete(enderecoCliente, setFrete, navigate);
    };
    
    return (
        <div className={style.selectAdress}>
            <h1>Selecione o Endereço para Entrega</h1>
            <form className={style.enderecoList}>
                <Select
                    id="enderecosSelect"
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
                    placeholder="Selecione um endereço"
                    options={enderecosCliente.map((enderecoCliente) => ({ value: enderecoCliente.id, label: `${enderecoCliente.tipo}, ${enderecoCliente.apelido}, ${enderecoCliente.endereco.cep}, ${enderecoCliente.endereco.rua}, ${enderecoCliente.numero}, ${enderecoCliente.endereco.bairro}, ${enderecoCliente.endereco.cidade} - ${enderecoCliente.endereco.estado}` }))}
                    isSearchable
                    closeMenuOnSelect={true}
                    onChange={handleChangeEndereco}
                    value={enderecoSelecionado}
                />
            </form>
            <div className={style.functionsEndereco}>
                <button type="submit" className={style.btnNewAddress} onClick={abrirPopupEndereco}>Novo Endereço</button>
                <button className={style.btnCalcFrete} onClick={() => CheckoutService.calcularFrete(enderecoSelecionado, setFrete, navigate)}>Calcular Frete</button>
            </div>
            <div className="resumo">
                <ResumoCheckout
                    valorCarrinho={valorCarrinho}
                    frete={frete.price}
                    prazo={frete.delivery_time}
                    enderecoEntrega={enderecoSelecionado}
                    enderecoAdicionado={enderecoAdicionado}
                    carregarEnderecosCliente={carregarEnderecosCliente}
                />
            </div>
        </div>
    );
}

export default EnderecosCheckout;
