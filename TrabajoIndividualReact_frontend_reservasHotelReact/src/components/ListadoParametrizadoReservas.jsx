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
 * @property {number} client_id - ID del cliente
 * @property {string} client_name - Nombre del cliente
 */

/**
 * @typedef {Object} Reserva
 * @property {number} reservation_id - ID de la reserva
 * @property {number} client_id - ID del cliente
 * @property {Cliente} client_id_cliente - Datos del cliente asociado
 * @property {string} check_in_date - Fecha de entrada
 * @property {string} check_out_date - Fecha de salida
 * @property {number} room_number - Número de habitación
 * @property {number} price - Precio de la reserva
 */

/**
 * @component ListadoPaginadoReservas
 * @description Componente que muestra una tabla paginada de reservas.
 * Permite eliminar reservas, navegar a la edición y ajustar el número de filas por página.
 * @returns {JSX.Element} Tabla paginada de reservas
 */
function ListadoPaginadoReservas() {
  /** @type {[Reserva[], function]} Estado para la lista de reservas */
  const [rows, setRows] = useState([]);
  
  /** @type {[number, function]} Estado para la página actual */
  const [page, setPage] = useState(0);
  
  /** @type {[number, function]} Estado para el número de filas por página */
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  /** @type {function} Hook de navegación */
  const navigate = useNavigate();

  /**
   * Efecto que carga las reservas al montar el componente
   */
  useEffect(() => {
    /**
     * Obtiene todas las reservas del servidor
     * @async
     */
    async function getReservas() {
      try {
        const response = await fetch(apiUrl + "/reservas");
        if (response.ok) {
          const data = await response.json();
          setRows(data.datos);
        }
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      }
    }
    getReservas();
  }, []);

  /**
   * Maneja la eliminación de una reserva
   * @param {number} reservation_id - ID de la reserva a eliminar
   * @async
   */
  const handleDelete = async (reservation_id) => {
    try {
      const response = await fetch(apiUrl + "/reservas/" + reservation_id, {
        method: "DELETE",
      });

      if (response.ok) {
        // Filtra la reserva eliminada de la lista
        const reservasTrasBorrado = rows.filter(
          (reserva) => reserva.reservation_id !== reservation_id
        );
        setRows(reservasTrasBorrado);
      }
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
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
        Listado paginado de reservas
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
        <Table aria-label="tabla paginada de reservas">
          <TableHead>
            <TableRow>
              <TableCell align="right">RESERVAS ID</TableCell>
              <TableCell>CLIENTE ID</TableCell>
              <TableCell>NOMBRE CLIENTE</TableCell>
              <TableCell>FECHA DE ENTRADA</TableCell>
              <TableCell>FECHA DE SALIDA</TableCell>
              <TableCell align="right">HABITACION</TableCell>
              <TableCell align="right">PRECIO</TableCell>
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
                  <TableCell align="right">{row.reservation_id}</TableCell>
                  <TableCell align="right">{row.client_id}</TableCell>
                  <TableCell>{row.client_id_cliente.client_name}</TableCell>
                  <TableCell>{row.check_in_date}</TableCell>
                  <TableCell>{row.check_out_date}</TableCell>
                  <TableCell align="right">{row.room_number}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleDelete(row.reservation_id)}
                      color="error"
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate("/modificarreserva/" + row.reservation_id)
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

export default ListadoPaginadoReservas;