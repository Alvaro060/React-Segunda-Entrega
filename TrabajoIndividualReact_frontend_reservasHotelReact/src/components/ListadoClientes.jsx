import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, TextField, Box, Button } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useEffect, useState } from "react";
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
 * @component ListadoClientes
 * @description Componente que muestra una tabla con el listado de clientes.
 * Permite buscar clientes por ID, eliminar clientes y navegar a la edición.
 * @returns {JSX.Element} Tabla con listado de clientes
 */
function ListadoClientes() {
  /** @type {[Cliente[], function]} Estado para todos los clientes */
  const [rows, setRows] = useState([]);
  
  /** @type {[Cliente[], function]} Estado para clientes filtrados */
  const [filteredRows, setFilteredRows] = useState([]);
  
  /** @type {[string, function]} Estado para el ID de búsqueda */
  const [searchId, setSearchId] = useState("");
  
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
          setFilteredRows(data.datos);
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
        // Actualiza ambos estados eliminando el cliente
        const clientesTrasBorrado = rows.filter(
          (cliente) => cliente.client_id !== client_id
        );
        setRows(clientesTrasBorrado);
        setFilteredRows(clientesTrasBorrado);
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  /**
   * Maneja la búsqueda de clientes por ID
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del campo de búsqueda
   * @async
   */
  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setSearchId(searchValue);

    if (searchValue === "") {
      setFilteredRows(rows);
      return;
    }

    try {
      const response = await fetch(apiUrl + "/clientes/" + searchValue);
      if (response.ok) {
        const data = await response.json();
        setFilteredRows(data.datos ? [data.datos] : []);
      } else {
        setFilteredRows([]);
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setFilteredRows([]);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de clientes
      </Typography>

      {/* Campo de búsqueda */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          label="Buscar por Cliente ID"
          variant="outlined"
          value={searchId}
          onChange={handleSearch}
          sx={{ width: "300px", backgroundColor: "#a2dff7", borderRadius: 2 }}
        />
      </Box>

      {/* Tabla de clientes */}
      <TableContainer
        component={Paper}
        sx={{
          mx: 2,
          backgroundColor: "#a2dff7",
          padding: 2,
          borderRadius: 2,
        }}
      >
        <Table aria-label="tabla de clientes">
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
            {filteredRows.map((row) => (
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
                    sx={{ marginRight: 1 }}
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
      </TableContainer>
    </Box>
  );
}

export default ListadoClientes;