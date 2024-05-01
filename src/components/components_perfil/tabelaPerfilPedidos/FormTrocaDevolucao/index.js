import React, { useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import styles from "./FormTrocaDevolucao.module.css"; // Certifique-se de ajustar o caminho do arquivo CSS
import SolicitacaoService from "../../../../services/solicitacaoService";
import { plataformaMask } from "../../../../utils/mask";

// Abrir o modal de troca/devolução do pedido
const FormTrocaDevolucao = ({
    isOpen,
    onRequestClose,
    pedido,
    itensTroca,
    setItensTroca,
}) => {
    // Esvaziar itensTroca quando o modal for aberto
    useEffect(() => {
        if (isOpen) {
            setItensTroca([]); // Define itensTroca como um array vazio
        }
    }, [isOpen, setItensTroca]);

    // Definindo quantidades por itemTroca
    const getOpcoesQuantidadeTroca = (quantidade) => {
        const opcoes = [];

        for (let i = 1; i <= quantidade; i++) {
            opcoes.push({ value: i, label: `${i}` });
        }

        return opcoes;
    };

    // Função para consumir a API quando o botão "Confirmar" for clicado
    const handleConfirmar = async () => {
        SolicitacaoService.confirmarSolicitacao(pedido, itensTroca)
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Troca/Devolução Modal"
            className={`${styles.modal} ${isOpen ? styles["modal-blowup"] : ""}`}
            overlayClassName={styles.overlay}
        >
            <h1>Solicitar Troca/Devolução</h1><br></br>
            <form>
                <h3>Informe todos os detalhes:</h3>
                <textarea
                    className={styles.textArea}
                    id="motivo"
                    type="text"
                    placeholder="Digite o(s) motivo(s) da solicitação."
                />
                <h3>Selecione o(s) Item(nas) para Troca/Devolução</h3>
                <Select
                    id="itensTroca"
                    className="swal2-select"
                    classNamePrefix="swal2-select"
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            width: "100%",
                            marginBottom: "5%",
                        }),
                        menu: (provided) => ({
                            ...provided,
                            width: "100%",
                        }),
                        option: (provided) => ({
                            ...provided,
                            fontSize: "1rem",
                        }),
                    }}
                    placeholder="Selecione o(s) Item(ns)."
                    options={pedido.carrinhoCompra && pedido.carrinhoCompra.itensCarrinho.map((itemPedido) => ({ value: itemPedido.id, label: `${itemPedido.produto.titulo}, ${plataformaMask(itemPedido.produto.plataforma)}, ${itemPedido.produto.publisher}`, quantidade: itemPedido.quantidade, quantidadeTroca: 1 }))}
                    isMulti
                    isClearable
                    isSearchable
                    closeMenuOnSelect={false}
                    onChange={(itemSelecionado) => {
                        const novosItensTroca = (itemSelecionado || []).map((itemSelecionado) => {
                            const itemExistente = itensTroca.find((item) => item.value === itemSelecionado.value);
                            return itemExistente ? itemExistente : itemSelecionado;
                        });
                        setItensTroca(novosItensTroca);
                    }}
                />
            </form>
            {itensTroca.length > 0 && (
                <div className={styles.quantidadeTroca}>
                {itensTroca.map((itemTroca) => (
                    <div key={itemTroca.value} className={styles.itemTroca}>
                        <p>Produto: {itemTroca.label}</p>
                        <div className={styles.quantidadeSelect}>
                            <p>Quantidade para Troca/Devolução:</p>
                            <Select
                                id="quantidadeItens"
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                    }),
                                    menu: (provided) => ({
                                        ...provided,
                                    }),
                                    option: (provided) => ({
                                        ...provided,
                                        fontSize: "1rem",
                                    }),
                                }}
                                options={getOpcoesQuantidadeTroca(itemTroca.quantidade)}
                                placeholder="Selecione a quantidade"
                                value={{ value: itemTroca.quantidadeTroca, label: `${itemTroca.quantidadeTroca}` }}
                                onChange={(quantidadeSelecionada) => {
                                    setItensTroca(prevState => {
                                        // Cria uma nova cópia do array de itens
                                        const index = prevState.findIndex(item => item.value === itemTroca.value);
            
                                        // Se o item existir no array, atualiza sua quantidadeTroca
                                        if (index !== -1) {
                                            const novosItensTroca = [...prevState];
                                            novosItensTroca[index] = {
                                                ...novosItensTroca[index],
                                                quantidadeTroca: quantidadeSelecionada.value
                                            };
                                            return novosItensTroca;
                                        }
            
                                        // Se o item não existir, retorna o estado inalterado
                                        return prevState;
                                    });
                                }}
                            />
                        </div>
                        <br></br>
                    </div>
                ))}
            </div>
            )}
            <div className={styles.buttonsContainer}>
                {itensTroca.length > 0 && (
                    <>
                        <button onClick={handleConfirmar} className={styles.confirmButton}>Confirmar</button>
                    </>
                )}
                <button onClick={onRequestClose} className={styles.cancelButton}>Cancelar</button>
            </div>
        </Modal>
    );
};

export default FormTrocaDevolucao;
