import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Recorte } from "../pages/Home/index.jsx";
import { AtualizarPeca } from "../pages/AtualizarPeca/index.jsx";
import { MontarModelo } from "../pages/MontarModelo/index.jsx";
import { MontagemCompleta } from "../pages/MontagemCompleta/index.jsx";
import { CadastrarPeca } from "../pages/RegistrarPeca/index.jsx";
import { PrivateRoute } from "../context/PrivateRoute.jsx";
import { ModelosFinais } from "../pages/VisualizarMontagemPronta/index.jsx";

export const Rotas = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/visualizacaoMontagensProntas"
          element={<ModelosFinais />}
        />

        <Route element={<PrivateRoute />}>
          <Route path="/recorte" element={<Recorte />} />
          <Route path="/atualizarPeca" element={<AtualizarPeca />} />
          <Route path="/visualizacao" element={<MontarModelo />} />
          <Route path="/montagemCompleta" element={<MontagemCompleta />} />
          <Route path="/cadastrarPeca" element={<CadastrarPeca />} />
        </Route>
      </Routes>
    </>
  );
};
