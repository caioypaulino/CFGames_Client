import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Carrinho from "./pages/Carrinho";
import Layout from "./components/layout/index.js";
import PerfilPessoal from "./pages/Perfil/Pessoal";
import PerfilEnderecos from "./pages/Perfil/Enderecos";
import PerfilCartoes from "./pages/Perfil/Cartoes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/carrinho" element={<Layout><Carrinho /></Layout>} />
        <Route path="/perfil/pessoal" element={<Layout><PerfilPessoal/></Layout>} />
        <Route path="/perfil/enderecos" element={<Layout><PerfilEnderecos/></Layout>} />
        <Route path="/perfil/cartoes" element={<Layout><PerfilCartoes/></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pagamento" />
        <Route path="/Admin" />
      </Routes>
    </BrowserRouter>
  );
}
