import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Carrinho from "./pages/Carrinho";
import Layout from "./components/layout/index.js";
import Perfil from "./pages/Perfil/Pessoal/index.js";
import PerfilEnderecos from "./pages/Perfil/Enderecos/index.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/carrinho" element={<Layout><Carrinho /></Layout>} />
        <Route path="/perfil/pessoal" element={<Layout><Perfil/></Layout>} />
        <Route path="/perfil/enderecos" element={<Layout><PerfilEnderecos/></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pagamento" />
        <Route path="/Admin" />
      </Routes>
    </BrowserRouter>
  );
}