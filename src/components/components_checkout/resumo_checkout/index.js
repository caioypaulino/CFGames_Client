import React, { useState, useEffect } from "react";
import style from "./ResumoCheckout.module.css";
import Swal from "sweetalert2";
import cuponsData from "../../../utils/cupons.json";
import { valueMaskBR } from "../../../utils/mask";
import CartoesCheckout from "../cartoes_checkout";
import { getToken } from "../../../utils/storage";
import { useNavigate } from "react-router-dom";

const ResumoCheckout = (props) => {
    const { valorCarrinho, frete, prazo, enderecoEntrega } = props;
    const [inputValue, setInputValue] = useState("");
    const [cupons, setProducts] = useState([]);
    const [desconto, setDesconto] = useState("");
    const [valorTotal, setValorTotal] = useState(0);

    const [cartoesSelecionados, setCartoesSelecionados] = useState([]);
    const [valorParcialPorCartao, setValorParcialPorCartao] = useState({});
    const [parcelasPorCartao, setParcelasPorCartao] = useState({});
    const [valorParcialEditado, setValorParcialEditado] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setProducts(cuponsData);
    }, []);

    // Atualizando o valor total sempre que houver mudanças nos valores do carrinho, frete ou desconto
    useEffect(() => {
        const total = valorCarrinho + parseFloat(frete || 0) - desconto;

        setValorTotal(total);
    }, [valorCarrinho, frete, desconto]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const verificaCupom = (codeToCheck) => {
        return cupons.some((cupom) => cupom.code === codeToCheck);
    };

    const aplicaDesconto = (code) => {
        if (verificaCupom(code)) {
            const cupomEncontrado = cupons.find((cupom) => cupom.code === code);
            if (cupomEncontrado) {
                setDesconto(cupomEncontrado.discount);
            } else {
                window.alert(`Cupom ${cupons} encontrado, mas inválido`);
            }
        } else {
            window.alert(`Cupom ${cupons} não encontrado ou inválido`);
        }
    };

    const abrirPopupConfirmarPedido = () => {
        // Verificando se o endereço de entrega foi selecionado
        if (!enderecoEntrega) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, selecione um endereço de entrega.',
                icon: 'error',
                confirmButtonColor: "#6085FF",
            });

            return; // Return para evitar a abertura do popup de confirmação
        }

        // Verificando se pelo menos um cartão foi selecionado
        if (cartoesSelecionados.length === 0) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, selecione ao menos um método de pagamento.',
                icon: 'error',
                confirmButtonColor: "#6085FF",
            });

            return; // Return para evitar a abertura do popup de confirmação
        }

        const detalhesPedido =
            `
            <h2>Detalhes</h2>
            <div class=${style.justifyText}>
                <p><strong>Valor Total:</strong> R$ ${valueMaskBR(valorTotal)}</p>
                <p><strong>Valor Carrinho:</strong> R$ ${valueMaskBR(valorCarrinho)}</p>
                <p><strong>Frete:</strong> R$ ${valueMaskBR(parseFloat(frete) || 0)}</p>
                <p><strong>Desconto:</strong> R$ ${valueMaskBR(desconto || 0)}</p>
                <h2>Pagamento:</h2>
                ${cartoesSelecionados && cartoesSelecionados.map(cartao => {
                const valorParcial = valorParcialPorCartao[cartao.value];
                const parcelas = parcelasPorCartao[cartao.value];

                return `
                            <p><strong>Cartão:</strong> ${cartao.label}</p>
                            <p><strong>Valor Parcial:</strong> R$ ${valueMaskBR(valorParcial || 0)}</p>
                            <p><strong>Parcelas:</strong> ${parcelas}x R$ ${(valueMaskBR(valorParcial / parcelas) || 0)}</p>
                        `;
            }).join("<br>") || 'Não Selecionado'}
                <h2>Entrega:</h2>
                <p><strong>Endereço:</strong> ${(enderecoEntrega && enderecoEntrega.label) || 'Não selecionado'}</p>
                <p><strong>Prazo:</strong> ${prazo !== undefined && prazo + ' Dia(s)' || 'Indefinido'}</p>
            </div>
        `;

        Swal.fire({
            title: "<h3 style='margin-bottom:-5%; color:#011640;'>Deseja Finalizar o Pedido?</h3>",
            html: detalhesPedido,
            confirmButtonText: 'Confirmar',
            confirmButtonColor: "#6085FF",
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            showCloseButton: true,
            icon: 'warning',
            preConfirm: () => {
                adicionarPedido(enderecoEntrega, cartoesSelecionados, valorParcialPorCartao, parcelasPorCartao);
            },
        });
    };

    // função para adicionar um novo cartão
    const adicionarPedido = async (enderecoEntrega, cartoesSelecionados, valorParcialPorCartao, parcelasPorCartao) => {
        try {
            const token = getToken();

            const response = await fetch("http://localhost:8080/pedido/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    enderecoCliente: {
                        id: enderecoEntrega.value
                    },
                    cupons: [],
                    cartoes: cartoesSelecionados.map(cartaoSelecionado => {
                        const cartaoObj = {
                            cartao: {
                                numeroCartao: cartaoSelecionado ? cartaoSelecionado.value : ''
                            },
                            parcelas: parcelasPorCartao[cartaoSelecionado.value] || 1
                        };

                        // Adiciona valorParcial somente se valorParcialEditado for verdadeiro
                        if (valorParcialEditado) {
                            cartaoObj.valorParcial = valorParcialPorCartao[cartaoSelecionado.value] || 0;
                        }

                        return cartaoObj;
                    })
                }),
            });

            if (response.ok) {
                Swal.fire({ title: "Sucesso!", text: "Pedido adicionado com sucesso.", icon: "success", confirmButtonColor: "#6085FF" }).then(() => { navigate('/perfil/pedidos'); });
            }
            else {
                // buscando mensagem de erro que não é JSON
                const errorMessage = await response.text();

                throw new Error(errorMessage);
            }
        }
        catch (error) {
            // tratando mensagem de erro
            console.error("Erro ao adicionar pedido:", error);
            Swal.fire({ title: "Erro!", html: `Ocorreu um erro ao adicionar o pedido.<br><br>${error.message}`, icon: "error", confirmButtonColor: "#6085FF" })
        }
    };

    return (
        <>
            <div className={style.resumo}>
                <h1>Resumo</h1>
                <p>Valor Carrinho: R$ {valueMaskBR(valorCarrinho)}</p>
                <p>Frete: R$ {frete !== undefined && parseFloat(frete) || '0.00'}</p>
                <p>Prazo de Entrega: {prazo !== undefined && prazo + ' Dia(s)' || 'Indefinido'}</p>
                <p>Desconto: R$ {(desconto !== undefined && desconto || '0.00')}</p><br></br>
                <p>Total: R$ {valueMaskBR(valorTotal)}</p>
                <button className={style.btn} onClick={abrirPopupConfirmarPedido}>Confirmar Pedido</button>
                <button className={style.btnContinuar}><a className={style.link} href="/carrinho">Voltar ao Carrinho</a></button>
            </div>
            <div className={style.cupom}>
                <h1>Desconto</h1>
                <input className={style.inputTextCupom} type="text" value={inputValue} onChange={handleInputChange} placeholder="Código do cupom" />
                <button className={style.btnCupom} onClick={() => aplicaDesconto(inputValue)}>Aplicar cupom</button>
            </div>
            <div className={style.pagamento}>
                <CartoesCheckout
                    valorTotal={valorTotal}
                    cartoesPedido={[cartoesSelecionados, setCartoesSelecionados]} // passando como props
                    valorParcialPedido={[valorParcialPorCartao, setValorParcialPorCartao]}
                    valorParcialEdit={[valorParcialEditado, setValorParcialEditado]}
                    parcelasPedido={[parcelasPorCartao, setParcelasPorCartao]}
                />
            </div>
        </>
    );
};

export default ResumoCheckout;
