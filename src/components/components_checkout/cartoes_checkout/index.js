import React, { useEffect, useState } from "react";
import style from "./CartoesCheckout.module.css";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import { getToken } from "../../../utils/storage";
import { creditCardXXXXMask, removeMask, handleCreditCard, handleNumber, valueMaskBR } from "../../../utils/mask";

const CartoesCheckout = (props) => {
    const { valorTotal, cartoesPedido, valorParcialPedido, parcelasPedido } = props;

    const [cartoesSelecionados, setCartoesSelecionados] = cartoesPedido;
    const [valorParcialPorCartao, setValorParcialPorCartao] = valorParcialPedido;
    const [parcelasPorCartao, setParcelasPorCartao] = parcelasPedido;

    const [cartoesCliente, setCartoesCliente] = useState([]);

    const [parcelas, setParcelas] = useState([]);
    const [parcelasSelecionadas, setParcelasSelecionadas] = useState({});

    

    const [editarValorParcial, setEditarValorParcial] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const carregarCartoesCliente = async () => {
            const token = getToken();

            try {
                const response = await fetch('http://localhost:8080/perfil/cartoes', {
                    headers: { Authorization: "Bearer " + token }
                });

                if (!response.ok) {
                    throw new Error('Token Inválido!');
                }

                setCartoesCliente(await response.json());
            }
            catch (error) {
                console.error('Erro ao carregar dados:', error);
                Swal.fire({ title: "Erro!", html: `Erro ao carregar cartões.<br><br>Faça login novamente!`, icon: "error", confirmButtonColor: "#6085FF" }).then(() => { navigate("/login"); });
            }
        };

        carregarCartoesCliente();
    }, []);

    // Calculando automaticamente o valorParcial e definindo parcelas por cartoesSelecionados
    useEffect(() => {
        const calcularParcelasValorParcial = () => {
            if (cartoesSelecionados.length > 0) {
                const valorParcialPorCartao = valorTotal / cartoesSelecionados.length;
                const valorParcialPorCartaoFormatado = valorParcialPorCartao;
                const novoValorParcialPorCartao = {};
                const novoParcelasPorCartao = {};

                cartoesSelecionados.forEach(cartao => {
                    novoValorParcialPorCartao[cartao.value] = valorParcialPorCartaoFormatado;
                    novoParcelasPorCartao[cartao.value] = 1;
                });

                setValorParcialPorCartao(novoValorParcialPorCartao);
                setParcelasPorCartao(novoParcelasPorCartao);
            }
            else {
                setValorParcialPorCartao({});
            }

            const opcoes = [];
            for (let i = 1; i <= 12; i++) {
                opcoes.push({ value: i, label: `${i}x` });
            }
            setParcelas(opcoes);
        };

        calcularParcelasValorParcial();
    }, [cartoesSelecionados, valorTotal]);

    // Resetando parcelas selecionadas quando o valor total muda
    useEffect(() => {
        setParcelasSelecionadas({});
    }, [valorTotal]);

    const abrirPopupCartao = () => {
        Swal.fire({
            title: "Adicionar Novo Cartão",
            html: `
                <input id="numeroCartao" type="text" placeholder="Número do Cartão" inputmode="numeric" maxlength="19" class="swal2-input">
                <input id="nomeCartao" type="text" placeholder="Nome do Titular" class="swal2-input">
                <input id="mesVencimento" type="number" placeholder="Mês de Vencimento" max="12" class="swal2-input">
                <input id="anoVencimento" type="number" placeholder="Ano de Vencimento" min="2024" class="swal2-input">
                <input id="cvc" type="text" placeholder="CVC" inputmode="numeric" maxlength="4" class="swal2-input">`,
            showCancelButton: true,
            confirmButtonText: "Adicionar",
            confirmButtonColor: "#6085FF",
            cancelButtonText: "Cancelar",
            icon: "info",
            preConfirm: () => {
                const numeroCartao = removeMask(Swal.getPopup().querySelector("#numeroCartao").value);
                const nomeCartao = Swal.getPopup().querySelector("#nomeCartao").value;
                const mesVencimento = Swal.getPopup().querySelector("#mesVencimento").value;
                const anoVencimento = Swal.getPopup().querySelector("#anoVencimento").value;
                const cvc = Swal.getPopup().querySelector("#cvc").value;
                adicionarCartao(numeroCartao, nomeCartao, mesVencimento, anoVencimento, cvc);
            },
        });

        const numeroCartaoInput = document.getElementById('numeroCartao');
        const cvcInput = document.getElementById('cvc');
        numeroCartaoInput.addEventListener('input', handleCreditCard);
        cvcInput.addEventListener('input', handleNumber);
    };

    const adicionarCartao = async (numeroCartao, nomeCartao, mesVencimento, anoVencimento, cvc) => {
        try {
            const token = getToken();
            const response = await fetch("http://localhost:8080/perfil/add/cartao", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    numeroCartao,
                    nomeCartao,
                    mesVencimento,
                    anoVencimento,
                    cvc,
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Cartão adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { window.location.reload(); });
            }
            else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        }
        catch (error) {
            console.error("Erro ao adicionar cartão:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o cartão.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    const handleEditValorParcial = () => {
        setEditarValorParcial(true);
    };

    const handleSaveValorParcial = () => {
        setEditarValorParcial(false);
    };

    const handleValorParcialChange = (numeroCartao, newValue) => {
        const novoValorParcialPorCartao = { ...valorParcialPorCartao };
        novoValorParcialPorCartao[numeroCartao] = newValue;

        setValorParcialPorCartao(novoValorParcialPorCartao);
    };

    const handleParcelasChange = (numeroCartao, parcelaSelecionada) => {
        const novoParcelasPorCartao = { ...parcelasPorCartao };

        novoParcelasPorCartao[numeroCartao] = parcelaSelecionada;

        setParcelasPorCartao(novoParcelasPorCartao);
    };

    const getParcelaSelecionada = (numeroCartao) => {
        return parcelasSelecionadas[numeroCartao] || { value: 1, label: '1x' };
    };

    return (
        <div className={style.selectPagamento}>
            <h1>Selecione o(s) Método(s) de Pagamento</h1>
            <form className={style.cartaoList}>
                <Select
                    id="cartoes"
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
                    placeholder="Selecione Cartão(ões) de Crédito"
                    options={cartoesCliente.map((cartaoCliente) => ({ value: cartaoCliente.numeroCartao, label: `${cartaoCliente.bandeira}, ${creditCardXXXXMask(cartaoCliente.numeroCartao)}, ${cartaoCliente.nomeCartao}  [${cartaoCliente.mesVencimento}/${cartaoCliente.anoVencimento}]` }))}
                    isMulti
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    isOptionDisabled={() => cartoesSelecionados.length >= 2}
                    defaultValue={cartoesCliente.map((cartaoCliente) => ({ value: cartaoCliente.numeroCartao, label: `${cartaoCliente.bandeira}, ${creditCardXXXXMask(cartaoCliente.numeroCartao)}, ${cartaoCliente.nomeCartao}  [${cartaoCliente.mesVencimento}/${cartaoCliente.anoVencimento}]` }))}
                    onChange={(cartaoSelecionado) => setCartoesSelecionados(cartaoSelecionado)}
                />
            </form>
            {cartoesSelecionados.length > 0 && (
                <div className={style.cartaoParcial}>
                    {cartoesSelecionados.map(cartao => (
                        <div key={cartao.value} >
                            <p>Cartão: {cartao.label}</p>
                            <p>Valor Parcial: {editarValorParcial ? <input type="text" className={style.inputEditValorParcial} value={valorParcialPorCartao[cartao.value]} onChange={(e) => handleValorParcialChange(cartao.value, e.target.value)} /> : `R$ ${valueMaskBR(valorParcialPorCartao[cartao.value] || 0)}`}</p>
                            <p>Valor da Parcela: R$ {valueMaskBR(valorParcialPorCartao[cartao.value] / parcelasPorCartao[cartao.value])}</p>
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        width: '65%',
                                        marginTop: '3%',
                                        marginLeft: '2%'
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
                                options={parcelas}
                                placeholder="Selecione o número de parcelas"
                                value={getParcelaSelecionada(cartao.value)}
                                onChange={(parcelaSelecionada) => {
                                    setParcelasSelecionadas(prevState => ({
                                        ...prevState,
                                        [cartao.value]: parcelaSelecionada
                                    }));
                                    handleParcelasChange(cartao.value, parcelaSelecionada.value);
                                }}
                            /><br></br>
                        </div>
                    ))}
                </div>
            )}

            <div className={style.functionsCartoes}>
                <button type="button" className={style.btnNovoCartao} onClick={abrirPopupCartao}>Novo Cartão</button>

                {cartoesSelecionados.length > 0 && (
                    <>
                        {editarValorParcial ? (
                            <button type="button" className={style.btnEditValorParcial} onClick={handleSaveValorParcial}>Salvar</button>
                        ) : (
                            <button type="button" className={style.btnEditValorParcial} onClick={handleEditValorParcial}>Editar Valor Parcial</button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CartoesCheckout;
