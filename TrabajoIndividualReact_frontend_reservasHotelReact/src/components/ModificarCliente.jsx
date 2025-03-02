import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../config";

/**
 * @typedef {Object} ClienteData
 * @property {string} client_id - ID del cliente
 * @property {string} client_name - Nombre del cliente
 * @property {string} address - Dirección del cliente
 * @property {string} phone_number - Número de teléfono
 * @property {string} email - Correo electrónico
 */

/**
 * @typedef {Object} ValidationState
 * @property {boolean} client_name - Error en validación del nombre
 * @property {boolean} address - Error en validación de la dirección
 * @property {boolean} phone_number - Error en validación del teléfono
 * @property {boolean} email - Error en validación del email
 */

/**
 * @component ModificarCliente
 * @description Componente que permite modificar los datos de un cliente existente.
 * Carga los datos del cliente, permite su edición y validación antes de guardar.
 * @returns {JSX.Element} Formulario de modificación de cliente
 */
function ModificarCliente() {
  /** @type {Object} Parámetros de la URL, incluyendo el ID del cliente */
  const params = useParams();

  /** @type {[ClienteData, function]} Estado para los datos del cliente */
  const [datos, setDatos] = useState({
    client_id: params.client_id,
    client_name: "",
    address: "",
    phone_number: "",
    email: "",
  });

  /** @type {[ValidationState, function]} Estado para los errores de validación */
  const [validacion, setValidacion] = useState({
    client_name: false,
    address: false,
    phone_number: false,
    email: false,
  });

  /** @type {function} Hook de navegación */
  const navigate = useNavigate();

  /**
   * Efecto que carga los datos del cliente al montar el componente
   */
  useEffect(() => {
    /**
     * Obtiene los datos del cliente por su ID
     * @async
     */
    async function getClienteById() {
      try {
        const response = await fetch(apiUrl + "/clientes/" + datos.client_id);
        if (response.ok) {
          const data = await response.json();
          setDatos(data.datos);
        } else if (response.status === 404) {
          const data = await response.json();
          alert(data.mensaje);
          navigate("/");
        }
      } catch (error) {
        console.error("Error al obtener cliente:", error);
      }
    }

    getClienteById();
  }, []);

  /**
   * Maneja el envío del formulario
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validarDatos()) {
      try {
        const response = await fetch(apiUrl + "/clientes/" + datos.client_id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        });

        if (response.ok) {
          alert("Actualización correcta");
          navigate(-1);
        } else {
          const data = await response.json();
          alert(data.mensaje);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error:" + error);
      }
    }
  };

  /**
   * Valida los datos del formulario
   * @returns {boolean} true si los datos son válidos, false si hay errores
   */
  const validarDatos = () => {
    let validado = true;
    const validacionAux = {
      client_name: false,
      address: false,
      phone_number: false,
      email: false,
    };

    // Validación del nombre
    if (datos.client_name.length < 3) {
      validacionAux.client_name = true;
      validado = false;
    }

    // Validación de la dirección
    if (datos.address.length < 5) {
      validacionAux.address = true;
      validado = false;
    }

    // Validación del teléfono
    const expPhone = /^\d{9}$/;
    if (!expPhone.test(datos.phone_number)) {
      validacionAux.phone_number = true;
      validado = false;
    }

    // Validación del email
    const expEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!expEmail.test(datos.email)) {
      validacionAux.email = true;
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

  // JSX del componente con sus comentarios respectivos...
  return (
    <Box sx={{ backgroundColor: "#5fe1e7", minHeight: "100vh", padding: 3 }}>
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Modificar cliente
      </Typography>
      {/* Contenedor del formulario */}
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
              backgroundColor: "#a2dff7",
              padding: 2,
              borderRadius: 2,
            }}
          >
            {/* Nombre */}
            <TextField
              label="Nombre"
              variant="outlined"
              name="client_name"
              value={datos.client_name}
              onChange={handleChange}
              error={validacion.client_name}
              helperText={validacion.client_name && "Nombre incorrecto. Mínimo 3 caracteres"}
            />
            {/* Direccion */}
            <TextField
              id="outlined-basic"
              label="Direccion"
              variant="outlined"
              name="address"
              value={datos.address}
              onChange={handleChange}
              error={validacion.address}
              helperText={
                validacion.address && "Direccion incorrecto. Mínimo 5 caracteres"
              }
            />
            {/* Telefono */}
            <TextField
              id="outlined-basic"
              label="Telefono"
              variant="outlined"
              name="phone_number"
              value={datos.phone_number}
              onChange={handleChange}
              error={validacion.phone_number}
              helperText={
                validacion.phone_number && "Telefono incorrecto. Mínimo 9 números"
              }
            />
            {/* Email */}
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              value={datos.email}
              onChange={handleChange}
              error={validacion.email}
              helperText={
                validacion.email && "Email incorrecto. Debe parecerse a un email normal"
              }
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

export default ModificarCliente;
