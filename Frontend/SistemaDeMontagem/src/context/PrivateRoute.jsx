import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLogin } from "./LoginContext";

export const PrivateRoute = () => {
  const { logado } = useLogin();

  return logado ? <Outlet /> : <Navigate to="/" />;
};
