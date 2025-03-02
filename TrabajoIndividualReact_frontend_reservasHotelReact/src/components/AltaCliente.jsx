import { Typography, TextField, Stack, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from '../config';

/**
 * @component AltaCliente
 * @description Componente que maneja el formulario de alta de nuevos clientes.
 * Permite registrar clientes con nombre, dirección, teléfono y email.
 * Incluye validación de campos y envío de datos al servidor.
 * @returns {JSX.Element} Formulario de alta de clientes
 */
function AltaCliente() {
  // Estado para almacenar los datos del formulario
  /**
   * @typedef {Object} ClienteData
   * @property {string} client_name - Nombre del cliente
   * @property {string} address - Dirección del cliente
   * @property {string} phone_number - Número de teléfono
   * @property {string} email - Correo electrónico
   */
  /**
   * @type {[ClienteData, function]} Estado y setter para los datos del cliente
   */
  const [datos, setDatos] = useState({
    client_name: "",
    address: "",
    phone_number: "",
    email: "",
  });
  
  // Estado para manejar la validación de cada campo
  /**
   * @typedef {Object} ValidationState
   * @property {boolean} client_name - Error en validación del nombre
   * @property {boolean} address - Error en validación de la dirección
   * @property {boolean} phone_number - Error en validación del teléfono
   * @property {boolean} email - Error en validación del email
   */
  /**
   * @type {[ValidationState, function]} Estado y setter para los errores de validación
   */
  const [validacion, setValidacion] = useState({
    client_name: false,
    address: false,
    phone_number: false,
    email: false,
  });
  
  // Hook para navegación
  const navigate = useNavigate();

  /**
   * Valida todos los campos del formulario
   * @returns {boolean} true si todos los campos son válidos, false si hay errores
   */
  const validarDatos = () => {
    let validado = true;
    const validacionAux = {
      client_name: false,
      address: false,
      phone_number: false,
      email: false,
    };

    // Validación del nombre (mínimo 3 caracteres)
    if (datos.client_name.length < 3) {
      validacionAux.client_name = true;
      validado = false;
    }

    // Validación de la dirección (mínimo 5 caracteres)
    if (datos.address.length < 5) {
      validacionAux.address = true;
      validado = false;
    }

    // Validación del teléfono (9 dígitos)
    const expPhone = /^\d{9}$/;
    if (!expPhone.test(datos.phone_number)) {
      validacionAux.phone_number = true;
      validado = false;
    }

    // Validación del email (formato correcto)
    const expEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!expEmail.test(datos.email)) {
      validacionAux.email = true;
      validado = false;
    }

    setValidacion(validacionAux);
    return validado;
  };

  /**
   * Maneja el envío del formulario
   * @param {React.FormEvent<HTMLFormElement>} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    if (!validarDatos()) {
      return;
    }

    try {
      // Enviar datos al servidor
      const response = await fetch(apiUrl + "/clientes", {
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
          navigate("/"); // Redirigir al inicio tras éxito
        }
      } else {
        const data = await response.json();
        alert(data.mensaje);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
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
        Alta de clientes
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
              backgroundColor: "#a2dff7",
              padding: 2,
              borderRadius: 2,
            }}
          >
            {/* Campo Nombre */}
            <TextField
              id="outlined-basic"
              label="Nombre"
              variant="outlined"
              name="client_name"
              value={datos.client_name}
              onChange={handleChange}
              error={validacion.client_name}
              helperText={validacion.client_name && "Mínimo 3 caracteres"}
            />
            {/* Campo Dirección */}
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
            {/* Campo Teléfono */}
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
            {/* Campo Email */}
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

export default AltaCliente;