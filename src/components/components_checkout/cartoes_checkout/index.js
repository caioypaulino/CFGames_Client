import React, { useEffect, useState } from "react";
import styles from "./CartoesCheckout.module.css";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import { creditCardXXXXMask, removeMask, handleCreditCard, handleNumber, valueMaskBR } from "../../../utils/mask";
import CartaoService from "../../../services/cartaoService";

const CartoesCheckout = (props) => {
    const { valorTotal, cartoesPedido, valorParcialPedido, valorParcialEdit, parcelasPedido, cartoesAdded } = props;

    const [cartoesSelecionados, setCartoesSelecionados] = cartoesPedido;
    const [valorParcialPorCartao, setValorParcialPorCartao] = valorParcialPedido;
    const [valorParcialEditado, setValorParcialEditado] = valorParcialEdit;
    const [cartoesAdicionados, setCartoesAdicionados] = cartoesAdded;

    const [parcelasPorCartao, setParcelasPorCartao] = parcelasPedido;

    const [cartoesCliente, setCartoesCliente] = useState([]);

    const [parcelas, setParcelas] = useState([]);
    const [parcelasSelecionadas, setParcelasSelecionadas] = useState({});

    const [editarValorParcial, setEditarValorParcial] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        carregarCartoesCliente();
    }, []);

    // Verifica se a página está sendo fechada ou recarregada
    useEffect(() => {
        const handleUnload = async () => {
            if (cartoesAdicionados.length > 0) {
                CartaoService.excluirCartoes(cartoesAdicionados);
            }
        };
    
        const handleBeforeUnload = () => {
            if (cartoesAdicionados.length > 0) {
                CartaoService.excluirCartoes(cartoesAdicionados);
            }
        };
    
        window.addEventListener('unload', handleUnload);
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            window.removeEventListener('unload', handleUnload);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [cartoesAdicionados]);

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
                setValorParcialEditado(false);
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

    const carregarCartoesCliente = async () => {
        const response = await CartaoService.buscarCartoes(navigate);

        setCartoesCliente(response);
    }

    const handleSelecionarCartao = (cartaoSelecionado) => {
        // Verificar se o valor total é menor que 0
        if (valorTotal <= 0) {
            Swal.fire({ title: "Erro!", html: `Não é possível selecionar cartão.<br><br>Valor Total é R$ 0.00!`, icon: "error", confirmButtonColor: "#6085FF" });
        } 
        else {
            // Permitir a seleção do cartão
            setCartoesSelecionados(cartaoSelecionado);
        }
    };

    const abrirPopupCartao = () => {
        Swal.fire({
            title: "Adicionar Novo Cartão",
            html: `
                <input id="numeroCartao" type="text" placeholder="Número do Cartão" inputmode="numeric" maxlength="19" class="swal2-input">
                <input id="nomeCartao" type="text" placeholder="Nome do Titular" class="swal2-input">
                <input id="mesVencimento" type="number" placeholder="Mês de Vencimento" max="12" class="swal2-input">
                <input id="anoVencimento" type="number" placeholder="Ano de Vencimento" min="2024" class="swal2-input">
                <input id="cvc" type="text" placeholder="CVC" inputmode="numeric" maxlength="4" class="swal2-input">
                <div>
                    <input id="salvarNoPerfil" type="checkbox" checked style="margin-top:1rem; margin-right: 0.5rem;">
                    <label for="salvarNoPerfil">Salvar no Perfil</label>
                </div>
            `,
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
                const salvarNoPerfil = document.getElementById('salvarNoPerfil').checked;

                CartaoService.adicionarCartaoCheckout({
                    numeroCartao, 
                    nomeCartao, 
                    mesVencimento, 
                    anoVencimento, 
                    cvc, 
                    salvarNoPerfil, 
                    cartoesAdicionados,
                    setCartoesAdicionados, 
                    carregarCartoesCliente
                });
            },
        });

        const numeroCartaoInput = document.getElementById('numeroCartao');
        const cvcInput = document.getElementById('cvc');
        numeroCartaoInput.addEventListener('input', handleCreditCard);
        cvcInput.addEventListener('input', handleNumber);
    };

    const handleEditValorParcial = () => {
        setEditarValorParcial(true);
    };

    const handleSaveValorParcial = () => {
        setEditarValorParcial(false);
    };

    const handleValorParcialChange = (numeroCartao, newValue) => {
        // Verificar se o valor é um número válido
        if (!isNaN(newValue)) {
            const novoValorParcialPorCartao = { ...valorParcialPorCartao };
            novoValorParcialPorCartao[numeroCartao] = parseFloat(newValue);

            setValorParcialPorCartao(novoValorParcialPorCartao);
            setValorParcialEditado(true);
        }
        else {
            Swal.fire({ title: "Erro!", html: `Valor Parcial Inválido.<br><br>`, icon: "error", confirmButtonColor: "#6085FF" });
        }
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
        <div className={styles.selectPagamento}>
            <h1>Selecione o(s) Método(s) de Pagamento</h1>
            <form className={styles.cartaoList}>
                <Select
                    id="cartoesSelect"
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
                    value={cartoesSelecionados}
                    onChange={handleSelecionarCartao}
                />
            </form>
            {cartoesSelecionados.length > 0 && (
                <div className={styles.cartaoParcial}>
                    {cartoesSelecionados.map(cartao => (
                        <div key={cartao.value} >
                            <p>Cartão: {cartao.label}</p>
                            <p>Valor Parcial: {editarValorParcial ?
                                <input
                                    type="number"
                                    className={styles.inputEditValorParcial}
                                    value={valorParcialPorCartao[cartao.value]}
                                    onChange={(e) => handleValorParcialChange(cartao.value, e.target.value)}
                                    title="Apenas números, pontos e vírgulas são permitidos"
                                />
                                : `R$ ${valueMaskBR(valorParcialPorCartao[cartao.value] || 0)}`}</p>
                            <p>Valor da Parcela: R$ {valueMaskBR((valorParcialPorCartao[cartao.value] / parcelasPorCartao[cartao.value]) || 0)}</p>
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

            <div className={styles.functionsCartoes}>
                <button type="button" className={styles.btnNovoCartao} onClick={abrirPopupCartao}>Novo Cartão</button>

                {cartoesSelecionados.length > 0 && (
                    <>
                        {editarValorParcial ? (
                            <button type="button" className={styles.btnEditValorParcial} onClick={handleSaveValorParcial}>Salvar</button>
                        ) : (
                            <button type="button" className={styles.btnEditValorParcial} onClick={handleEditValorParcial}>Editar Valor Parcial</button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CartoesCheckout;
