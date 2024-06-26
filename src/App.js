import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, {useState} from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroEndereco from "./pages/CadastroEndereco";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout"
import Layout from "./components/layout";
import LayoutPerfil from "./components/layout_perfil"
import LayoutAdmin from "./components/layout_admin";
import LayoutCarrinhoCheckout from "./components/layout_carrinho_checkout";
import PerfilPessoais from "./pages/Perfil/Pessoais";
import PerfilConta from "./pages/Perfil/Conta";
import PerfilEnderecos from "./pages/Perfil/Enderecos";
import PerfilCartoes from "./pages/Perfil/Cartoes";
import PerfilPedidos from "./pages/Perfil/Pedidos";
import PerfilSolicitacoes from "./pages/Perfil/SolicitacoesTrocaDevolucao"
import PerfilCupons from "./pages/Perfil/Cupons"
import AdminProdutos from "./pages/Admin/Produtos"
import AdminCategorias from "./pages/Admin/Categorias";
import AdminClientes from "./pages/Admin/Clientes";
import AdminEnderecos from "./pages/Admin/Enderecos";
import AdminPedidos from "./pages/Admin/Pedidos";
import AdminSolicitacoesTrocaDevolucao from "./pages/Admin/SolicitacoesTrocaDevolucao";
import AdminCupons from "./pages/Admin/Cupons";
import AdminGrafico from "./pages/Admin/Grafico";

export default function App() {
    const [termoBusca, setTermoBusca] = useState('');

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout termoBusca={termoBusca} setTermoBusca={setTermoBusca}><Home termoBusca={termoBusca} /></Layout>} />
                <Route path="/carrinho" element={<LayoutCarrinhoCheckout><Carrinho /></LayoutCarrinhoCheckout>} />
                <Route path="/checkout" element={<LayoutCarrinhoCheckout><Checkout /></LayoutCarrinhoCheckout>} />
                <Route path="/perfil/conta" element={<LayoutPerfil><PerfilConta /></LayoutPerfil>} />
                <Route path="/perfil/pessoal" element={<LayoutPerfil><PerfilPessoais /></LayoutPerfil>} />
                <Route path="/perfil/enderecos" element={<LayoutPerfil><PerfilEnderecos /></LayoutPerfil>} />
                <Route path="/perfil/cartoes" element={<LayoutPerfil><PerfilCartoes /></LayoutPerfil>} />
                <Route path="/perfil/pedidos" element={<LayoutPerfil><PerfilPedidos /></LayoutPerfil>} />
                <Route path="/perfil/solicitacoes_troca_devolucao" element={<LayoutPerfil><PerfilSolicitacoes /></LayoutPerfil>} />
                <Route path="/perfil/cupons" element={<LayoutPerfil><PerfilCupons /></LayoutPerfil>} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro/cliente" element={<CadastroCliente />} />
                <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
                <Route path="/pagamento" />
                <Route path="/admin/produtos" element={<LayoutAdmin><AdminProdutos /></LayoutAdmin>} />
                <Route path="/admin/categorias" element={<LayoutAdmin><AdminCategorias /></LayoutAdmin>} />
                <Route path="/admin/clientes" element={<LayoutAdmin><AdminClientes /></LayoutAdmin>} />
                <Route path="/admin/enderecos" element={<LayoutAdmin><AdminEnderecos /></LayoutAdmin>} />
                <Route path="/admin/pedidos" element={<LayoutAdmin><AdminPedidos /></LayoutAdmin>} />
                <Route path="/admin/solicitacoes_troca_devolucao" element={<LayoutAdmin><AdminSolicitacoesTrocaDevolucao /></LayoutAdmin>} />
                <Route path="/admin/cupons" element={<LayoutAdmin><AdminCupons /></LayoutAdmin>} />
                <Route path="/admin/grafico" element={<LayoutAdmin><AdminGrafico /></LayoutAdmin>} />
            </Routes>
        </BrowserRouter>
    );
}
