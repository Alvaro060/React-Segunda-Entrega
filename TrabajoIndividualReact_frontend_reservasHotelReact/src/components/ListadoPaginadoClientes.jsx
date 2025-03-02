import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

/**
 * @typedef {Object} Cliente
 * @property {number} client_id - ID único del cliente
 * @property {string} client_name - Nombre del cliente
 * @property {string} address - Dirección del cliente
 * @property {string} phone_number - Número de teléfono
 * @property {string} email - Correo electrónico
 */

/**
 * @component ListadoPaginadoClientes
 * @description Componente que muestra una tabla paginada de clientes.
 * Permite eliminar clientes, navegar a la edición y ajustar el número de filas por página.
 * @returns {JSX.Element} Tabla paginada de clientes
 */
function ListadoPaginadoClientes() {
  /** @type {[Cliente[], function]} Estado para la lista de clientes */
  const [rows, setRows] = useState([]);
  
  /** @type {[number, function]} Estado para la página actual */
  const [page, setPage] = useState(0);
  
  /** @type {[number, function]} Estado para el número de filas por página */
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  /** @type {function} Hook de navegación */
  const navigate = useNavigate();

  /**
   * Efecto que carga los clientes al montar el componente
   */
  useEffect(() => {
    /**
     * Obtiene todos los clientes del servidor
     * @async
     */
    async function getClientes() {
      try {
        const response = await fetch(apiUrl + "/clientes");
        if (response.ok) {
          const data = await response.json();
          setRows(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    }

    getClientes();
  }, []);

  /**
   * Maneja la eliminación de un cliente
   * @param {number} client_id - ID del cliente a eliminar
   * @async
   */
  const handleDelete = async (client_id) => {
    try {
      const response = await fetch(apiUrl + "/clientes/" + client_id, {
        method: "DELETE",
      });

      if (response.ok) {
        // Filtra el cliente eliminado de la lista
        const clientesTrasBorrado = rows.filter(
          (cliente) => cliente.client_id !== client_id
        );
        setRows(clientesTrasBorrado);
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  /**
   * Maneja el cambio de página en la tabla
   * @param {React.MouseEvent<HTMLButtonElement>} event - Evento del botón
   * @param {number} newPage - Número de la nueva página
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Maneja el cambio en el número de filas por página
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento del select
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Listado paginado de clientes
      </Typography>

      {/* Contenedor de la tabla */}
      <TableContainer
        component={Paper}
        sx={{
          mx: 2,
          backgroundColor: "#a2dff7",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Table aria-label="tabla paginada de clientes">
          <TableHead>
            <TableRow>
              <TableCell align="right">CLIENTE ID</TableCell>
              <TableCell>NOMBRE</TableCell>
              <TableCell>DIRECCION</TableCell>
              <TableCell align="right">TELEFONO</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>ELIMINAR</TableCell>
              <TableCell>EDITAR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Renderizado paginado de filas */}
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.client_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="right">{row.client_id}</TableCell>
                  <TableCell>{row.client_name}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell align="right">{row.phone_number}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(row.client_id)}
                      color="error"
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate("/modificarcliente/" + row.client_id)
                      }
                    >
                      <EditNoteIcon fontSize="small" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* Control de paginación */}
        <TablePagination
          rowsPerPageOptions={Array.from(
            { length: rows.length },
            (_, i) => i + 1
          )}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </TableContainer>
    </Box>
  );
}

export default ListadoPaginadoClientes;