import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

/**
 * @typedef {Object} ReservaData
 * @property {string} reservation_id - ID de la reserva
 * @property {string} client_id - ID del cliente
 * @property {string} check_in_date - Fecha de entrada (formato YYYY-MM-DD)
 * @property {string} check_out_date - Fecha de salida (formato YYYY-MM-DD)
 * @property {string} room_number - Número de habitación
 * @property {string} price - Precio de la reserva
 */

/**
 * @typedef {Object} ValidationState
 * @property {boolean} client_id - Error en validación del ID de cliente
 * @property {boolean} check_in_date - Error en validación de fecha de entrada
 * @property {boolean} check_out_date - Error en validación de fecha de salida
 * @property {boolean} room_number - Error en validación del número de habitación
 * @property {boolean} price - Error en validación del precio
 */

/**
 * @component ModificarReserva
 * @description Componente que permite modificar los datos de una reserva existente.
 * Carga los datos de la reserva, permite su edición y validación antes de guardar.
 * @returns {JSX.Element} Formulario de modificación de reserva
 */
function ModificarReserva() {
  /** @type {Object} Parámetros de la URL, incluyendo el ID de la reserva */
  const params = useParams();

  /** @type {[ReservaData, function]} Estado para los datos de la reserva */
  const [datos, setDatos] = useState({
    reservation_id: params.reservation_id,
    client_id: "",
    check_in_date: "",
    check_out_date: "",
    room_number: "",
    price: "",
  });

  /** @type {[ValidationState, function]} Estado para los errores de validación */
  const [validacion, setValidacion] = useState({
    client_id: false,
    check_in_date: false,
    check_out_date: false,
    room_number: false,
    price: false,
  });

  /** @type {function} Hook de navegación */
  const navigate = useNavigate();

  /**
   * Efecto que carga los datos de la reserva al montar el componente
   */
  useEffect(() => {
    /**
     * Obtiene los datos de la reserva por su ID
     * @async
     */
    async function getReservaById() {
      let response = await fetch(apiUrl + "/reservas/" + datos.reservation_id);
      if (response.ok) {
        let data = await response.json();
        setDatos(data.datos);
      } else if (response.status === 404) {
        let data = await response.json();
        alert(data.mensaje);
        navigate("/"); // Volver a la página principal por ruta erronea
      }
    }

    getReservaById();
  }, []); // Se ejecuta solo en el primer renderizado

  /**
   * Maneja el envío del formulario
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario
   * @async
   */
  const handleSubmit = async (e) => {
    // No hacemos submit
    e.preventDefault();
    console.log("Vamos a validar");
    if (validarDatos()) {
      // Enviamos los datos mediante fetch
      try {
        console.log("Vamos a hacer fetch");
        const response = await fetch(
          apiUrl + "/reservas/" + datos.reservation_id,
          {
            method: "PUT", // "PATCH"
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datos), // JSON.stringify({blocked: true})
          }
        );

        if (response.ok) {
          // 204 No content
          alert("Actualización correcta");
          navigate(-1); // Volver a la ruta anterior
        } else {
          // 404 Not Found reserva no modificada o no encontrada
          const data = await response.json();
          alert(data.mensaje);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error:", error);
      }
    }
  };

  /**
   * Valida todos los campos del formulario
   * @returns {boolean} true si todos los campos son válidos, false si hay errores
   */
  function validarDatos() {
    // En principio, damos por bueno el formulario
    let validado = true;
    // Estado de la validación auxiliar
    let validacionAux = {
      client_id: false,
      check_in_date: false,
      check_out_date: false,
      room_number: false,
      price: false,
    };

    if (!datos.client_id) {
      validacionAux.client_id = true; // Error en client_id (vacío)
      validado = false;
    } else {
      validacionAux.client_id = false; // client_id válido
    }

    let expDate = /^\d{4}-\d{2}-\d{2}$/; // Expresión regular para validar formato YYYY-MM-DD

    // Validación de check_in_date
    if (!datos.check_in_date || !expDate.test(datos.check_in_date)) {
      validacionAux.check_in_date = true; // Error en check_in_date (vacío o formato incorrecto)
      validado = false;
    } else {
      validacionAux.check_in_date = false; // check_in_date válido
    }

    // Validación de check_out_date
    if (!datos.check_out_date || !expDate.test(datos.check_out_date)) {
      validacionAux.check_out_date = true; // Error en check_out_date (vacío o formato incorrecto)
      validado = false;
    } else {
      validacionAux.check_out_date = false; // check_out_date válido
    }

    // Validación adicional para asegurarse de que la fecha de check_out no sea anterior a check_in
    if (datos.check_in_date && datos.check_out_date) {
      let checkIn = new Date(datos.check_in_date);
      let checkOut = new Date(datos.check_out_date);
      if (checkOut < checkIn) {
        validacionAux.check_out_date = true; // Error: check_out_date es anterior a check_in_date
        validado = false;
      }
    }

    let expRoomNumber = /^\d+$/; // Expresión regular para validar solo números

    // Validación de room_number
    if (
      !datos.room_number ||
      !expRoomNumber.test(datos.room_number) ||
      parseInt(datos.room_number) <= 0
    ) {
      validacionAux.room_number = true; // Error en room_number (vacío, no es un número, o es menor o igual a 0)
      validado = false;
    } else {
      validacionAux.room_number = false; // room_number válido
    }

    let expPrice = /^\d+(\.\d{1,2})?$/; // Expresión regular para validar un número positivo con hasta dos decimales

    // Validación de price
    if (
      !datos.price ||
      !expPrice.test(datos.price) ||
      parseFloat(datos.price) <= 0
    ) {
      validacionAux.price = true; // Error en price (vacío, no es un número válido o es menor o igual a 0)
      validado = false;
    } else {
      validacionAux.price = false; // price válido
    }

    // Actualizo el estado de la validacion de los Textfields
    setValidacion(validacionAux);
    console.log("Formulario valido:", validado);
    return validado;
  }

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
        Modificar reserva
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ mt: 2, justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            sx={{
              mx: 2,
              backgroundColor: "#a2dff7", // Fondo blanco para el formulario
              padding: 2,
              borderRadius: 2,
            }}
          >
            <TextField
              id="outlined-basic"
              label="Cliente Id"
              variant="outlined"
              name="client_id"
              value={datos.client_id}
              onChange={handleChange}
              error={validacion.client_id}
              helperText={validacion.client_id && "Id incorrecto."}
            />
            <TextField
              id="outlined-basic"
              label="Fecha De Entrada"
              variant="outlined"
              type="date"
              name="check_in_date"
              value={datos.check_in_date}
              onChange={handleChange}
              error={validacion.check_in_date}
              helperText={
                validacion.check_in_date && "Fecha de Entrada incorrecta."
              }
            />
            <TextField
              id="outlined-basic"
              label="Fecha De Salida"
              variant="outlined"
              type="date"
              name="check_out_date"
              value={datos.check_out_date}
              onChange={handleChange}
              error={validacion.check_out_date}
              helperText={
                validacion.check_out_date && "Fecha de Salida incorrecta."
              }
            />
            <TextField
              id="outlined-basic"
              label="Habitación"
              variant="outlined"
              name="room_number"
              value={datos.room_number}
              onChange={handleChange}
              error={validacion.room_number}
              helperText={validacion.room_number && "Habitación incorrecta."}
            />
            <TextField
              id="outlined-basic"
              label="Precio"
              variant="outlined"
              name="price"
              value={datos.price}
              onChange={handleChange}
              error={validacion.price}
              helperText={validacion.price && "Precio incorrecto."}
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

export default ModificarReserva;
