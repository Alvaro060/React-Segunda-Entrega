import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import AltaCliente from "./components/AltaCliente";
import AltaReserva from "./components/AltaReserva";
import Home from "./pages/Home";
import ListadoClientes from "./components/ListadoClientes";
import ListadoReservas from "./components/ListadoReservas";
import ListadoParametrizadoReservas from "./components/ListadoParametrizadoReservas";
import ListadoPaginadoReservas from "./components/ListadoPaginadoReservas";
import ListadoPaginadoClientes from "./components/ListadoPaginadoClientes";
import ModificarCliente from "./components/ModificarCliente";
import ModificarReserva from "./components/ModificarReserva";
import PaginaError from "./pages/PaginaError";
import GraficoReservas from "./components/GraficoReservas";
import GraficoReservas2 from "./components/GraficoReservas2";

let router = createBrowserRouter([
  {
    path: "/",
    element : <Home />,
    errorElement : <PaginaError />,
    children: [   // Los hijos se renderizan en el elemento <Outlet /> del padre
      {
        path: "altaCliente",
        element: <AltaCliente />,
      },
      {
        path: "listadoclientes",
        element: <ListadoClientes />,
      },
      {
        path: "modificarcliente/:client_id",
        element: <ModificarCliente />,
      },
      {
        path: "listadopaginadoclientes",
        element: <ListadoPaginadoClientes />,
      },
      {
        path: "altareserva",
        element: <AltaReserva />,
      },
      {
        path: "listadoreservas",
        element: <ListadoReservas />,
      },
      {
        path: "modificarreserva/:reservation_id",
        element: <ModificarReserva />,
      },
      {
        path: "listadopaginadoreservas",
        element: <ListadoPaginadoReservas />,
      },
      {
        path: "listadoparametrizadoreservas",
        element: <ListadoParametrizadoReservas />,
      },
      {
        path: "graficoreservas",
        element: <GraficoReservas />,
      },
      {
        path: "graficoreservas2",
        element: <GraficoReservas2 />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);