import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config";

/**
 * @component AltaReserva
 * @description Componente que maneja el formulario de alta de nuevas reservas.
 * Permite crear reservas con ID de cliente, fechas de entrada/salida, número de habitación y precio.
 * Incluye validación de campos y verificación de cliente existente.
 * @returns {JSX.Element} Formulario de alta de reservas
 */
function AltaReserva() {
  /**
   * @typedef {Object} ReservaData
   * @property {string} client_id - ID del cliente que hace la reserva
   * @property {string} check_in_date - Fecha de entrada (formato YYYY-MM-DD)
   * @property {string} check_out_date - Fecha de salida (formato YYYY-MM-DD)
   * @property {string} room_number - Número de habitación
   * @property {string} price - Precio de la reserva
   */
  /**
   * @type {[ReservaData, function]} Estado y setter para los datos de la reserva
   */
  const [datos, setDatos] = useState({
    client_id: "",
    check_in_date: "",
    check_out_date: "",
    room_number: "",
    price: "",
  });

  /**
   * @typedef {Object} ValidationState
   * @property {boolean} client_id - Error en validación del ID de cliente
   * @property {boolean} check_in_date - Error en validación de fecha de entrada
   * @property {boolean} check_out_date - Error en validación de fecha de salida
   * @property {boolean} room_number - Error en validación del número de habitación
   * @property {boolean} price - Error en validación del precio
   */
  /**
   * @type {[ValidationState, function]} Estado y setter para los errores de validación
   */
  const [validacion, setValidacion] = useState({
    client_id: false,
    check_in_date: false,
    check_out_date: false,
    room_number: false,
    price: false,
  });

  // Hook para navegación
  const navigate = useNavigate();

  /**
   * Verifica si existe un cliente con el ID proporcionado
   * @param {string} clientId - ID del cliente a verificar
   * @returns {Promise<boolean>} true si el cliente existe, false en caso contrario
   */
  const validarCliente = async (clientId) => {
    try {
      const response = await fetch(`${apiUrl}/clientes/${clientId}`);
      return response.ok;
    } catch (error) {
      console.error("Error al verificar el cliente:", error);
      return false;
    }
  };

  /**
   * Maneja el envío del formulario de reserva
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!await validarDatos()) {
      return; // Detener el envío si la validación falla
    }

    try {
      const response = await fetch(apiUrl + "/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const respuesta = await response.json();
        alert(respuesta.mensaje);
        if (respuesta.ok) {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  /**
   * Valida todos los campos del formulario
   * @returns {Promise<boolean>} true si todos los campos son válidos, false si hay errores
   */
  const validarDatos = async () => {
    let validado = true;
    let validacionAux = {
      client_id: false,
      check_in_date: false,
      check_out_date: false,
      room_number: false,
      price: false,
    };

    // Validación de cliente existente
    if (!datos.client_id || !await validarCliente(datos.client_id)) {
      validacionAux.client_id = true;
      validado = false;
    }

    // Validación de formato de fechas y lógica de fechas
    const expDate = /^\d{4}-\d{2}-\d{2}$/;
    if (!datos.check_in_date || !expDate.test(datos.check_in_date)) {
      validacionAux.check_in_date = true;
      validado = false;
    }
    if (!datos.check_out_date || !expDate.test(datos.check_out_date)) {
      validacionAux.check_out_date = true;
      validado = false;
    }
    if (datos.check_in_date && datos.check_out_date) {
      const checkIn = new Date(datos.check_in_date);
      const checkOut = new Date(datos.check_out_date);
      if (checkOut < checkIn) {
        validacionAux.check_out_date = true;
        validado = false;
      }
    }

    // Validación de número de habitación
    const expRoomNumber = /^\d+$/;
    if (!datos.room_number || !expRoomNumber.test(datos.room_number) || parseInt(datos.room_number) <= 0) {
      validacionAux.room_number = true;
      validado = false;
    }

    // Validación de precio (formato decimal correcto y valor positivo)
    const expPrice = /^\d+(\.\d{1,2})?$/;
    if (!datos.price || !expPrice.test(datos.price) || parseFloat(datos.price) <= 0) {
      validacionAux.price = true;
      validado = false;
    }

    setValidacion(validacionAux);
    return validado;
  };

  /**
   * Maneja los cambios en los campos del formulario
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio
   */
  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Alta de reservas
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{ mx: 2, backgroundColor: "#a2dff7", padding: 2, borderRadius: 2 }}
          >
            {/* Campo ID Cliente */}
            <TextField
              label="Cliente Id"
              variant="outlined"
              name="client_id"
              value={datos.client_id}
              onChange={handleChange}
              error={validacion.client_id}
              helperText={validacion.client_id && "Id incorrecto o inexistente."}
            />
            {/* Campo Fecha de Entrada */}
            <TextField
              label="Fecha De Entrada"
              variant="outlined"
              type="date"
              name="check_in_date"
              value={datos.check_in_date}
              onChange={handleChange}
              error={validacion.check_in_date}
              helperText={validacion.check_in_date && "Fecha de Entrada incorrecta."}
            />
            {/* Campo Fecha de Salida */}
            <TextField
              label="Fecha De Salida"
              variant="outlined"
              type="date"
              name="check_out_date"
              value={datos.check_out_date}
              onChange={handleChange}
              error={validacion.check_out_date}
              helperText={validacion.check_out_date && "Fecha de Salida incorrecta."}
            />
            {/* Campo Número de Habitación */}
            <TextField
              label="Numero De Habitacion"
              variant="outlined"
              name="room_number"
              value={datos.room_number}
              onChange={handleChange}
              error={validacion.room_number}
              helperText={validacion.room_number && "Habitación incorrecta. Debe ser mayor que 0"}
            />
            {/* Campo Precio */}
            <TextField
              label="Precio"
              variant="outlined"
              name="price"
              value={datos.price}
              onChange={handleChange}
              error={validacion.price}
              helperText={validacion.price && "Precio incorrecto. Debe ser mayor que 0"}
            />
            <Button variant="contained" type="submit">
              Aceptar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AltaReserva;