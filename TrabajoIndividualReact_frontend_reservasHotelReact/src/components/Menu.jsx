import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { useState } from "react";
import logo from "../assets/images/logoHotel.png";
import { Link } from "react-router";

/**
 * @typedef {Object} MenuLink
 * @property {string} to - Ruta de destino
 * @property {string} text - Texto a mostrar en el menú
 */

/**
 * @component Menu
 * @description Componente de navegación principal que muestra una barra de menú responsive
 * con opciones para gestionar clientes y reservas. Incluye un logo, menús desplegables
 * y soporte para visualización móvil.
 * @returns {JSX.Element} Barra de navegación con menús desplegables
 */
function Menu() {
  /**
   * Estado para controlar la apertura/cierre del menú en modo móvil
   * @type {[boolean, function]} Estado y setter para la visibilidad del menú
   */
  const [openBasic, setOpenBasic] = useState(false);

  /** 
   * @type {MenuLink[]} Enlaces del menú de clientes
   */
  const clienteLinks = [
    { to: "/altacliente", text: "Alta de clientes" },
    { to: "/listadoclientes", text: "Listado de clientes" },
    { to: "/listadopaginadoclientes", text: "Listado paginado de clientes" }
  ];

  /** 
   * @type {MenuLink[]} Enlaces del menú de reservas
   */
  const reservaLinks = [
    { to: "/altareserva", text: "Alta de reservas" },
    { to: "/listadoreservas", text: "Listado de reservas" },
    { to: "/listadopaginadoreservas", text: "Listado paginado de reservas" },
    { to: "/listadoparametrizadoreservas", text: "Listado parametrizado de reservas" },
    { to: "/graficoreservas", text: "Gráfico de reservas Barras" },
    { to: "/graficoreservas2", text: "Gráfico de reservas Circulo" }
  ];

  return (
    <MDBNavbar expand="lg" light bgColor="info">
      <MDBContainer fluid>
        {/* Logo y nombre del hotel */}
        <MDBNavbarBrand href="#">
          <img 
            src={logo} 
            height="30" 
            alt="Logo del hotel" 
            loading="lazy" 
          />
          Reservas Hotel
        </MDBNavbarBrand>

        {/* Botón hamburguesa para móvil */}
        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded={openBasic}
          aria-label="Toggle navigation"
          onClick={() => setOpenBasic(!openBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        {/* Contenido del menú colapsable */}
        <MDBCollapse navbar open={openBasic}>
          <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
            {/* Menú desplegable de Clientes */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag="a" className="nav-link" role="button">
                  Clientes
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  {clienteLinks.map(link => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      style={{ color: "#4f4f4f" }}
                    >
                      <MDBDropdownItem link>
                        {link.text}
                      </MDBDropdownItem>
                    </Link>
                  ))}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Menú desplegable de Reservas */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag="a" className="nav-link" role="button">
                  Reservas
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  {reservaLinks.map(link => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      style={{ color: "#4f4f4f" }}
                    >
                      <MDBDropdownItem link>
                        {link.text}
                      </MDBDropdownItem>
                    </Link>
                  ))}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default Menu;