import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroEndereco from "./pages/CadastroEndereco";
import Carrinho from "./pages/Carrinho";
import Layout from "./components/layout/index.js";
import LayoutAdmin from "./components/layout_admin/index.js";
import PerfilPessoais from "./pages/Perfil/Pessoais";
import PerfilConta from "./pages/Perfil/Conta";
import PerfilEnderecos from "./pages/Perfil/Enderecos";
import PerfilCartoes from "./pages/Perfil/Cartoes";
import AdminProdutos from "./pages/Admin/Produtos"
import AdminCategorias from "./pages/Admin/Categorias";
import AdminClientes from "./pages/Admin/Clientes";
import AdminEnderecos from "./pages/Admin/Enderecos";
 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/carrinho" element={<Layout><Carrinho /></Layout>} />
        <Route path="/perfil/conta" element={<Layout><PerfilConta/></Layout>} />
        <Route path="/perfil/pessoal" element={<Layout><PerfilPessoais/></Layout>} />
        <Route path="/perfil/enderecos" element={<Layout><PerfilEnderecos/></Layout>} />
        <Route path="/perfil/cartoes" element={<Layout><PerfilCartoes/></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro/cliente" element={<CadastroCliente />} />
        <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
        <Route path="/pagamento" />
        <Route path="/admin/produtos" element={<LayoutAdmin><AdminProdutos /></LayoutAdmin>} />
        <Route path="/admin/categorias" element={<LayoutAdmin><AdminCategorias /></LayoutAdmin>} />
        <Route path="/admin/clientes" element={<LayoutAdmin><AdminClientes /></LayoutAdmin>} />
        <Route path="/admin/enderecos" element={<LayoutAdmin><AdminEnderecos /></LayoutAdmin>} />
        <Route path="/admin/pedidos" />
      </Routes>
    </BrowserRouter>
  );
}
