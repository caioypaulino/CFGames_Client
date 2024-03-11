import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Home from "./pages/Home/index.js";
import Login from "./pages/Login/index.js";
import Cadastro from "./pages/Cadastro/index.js";
import Carrinho from "./pages/Carrinho/index";
import Layout from "./components/layout/index.js";
import Perfil from "./pages/Perfil/index.js";
import PerfilEnderecos from "./pages/Enderecos/index.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/carrinho" element={<Layout><Carrinho /></Layout>} />
        <Route path="/perfil" element={<Layout><Perfil/></Layout>} />
        <Route path="/enderecos" element={<Layout><PerfilEnderecos/></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pagamento" />
        <Route path="/Admin" />
      </Routes>
    </BrowserRouter>
  );
}
