// Importar libreria para respuestas
const Respuesta = require("../utils/respuesta.js");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
const models = initModels(sequelize);
const Cliente = models.clientes;
const Reserva = models.reservas;

class ReservaController {
  async createReserva(req, res) {
    // Implementa la lógica para crear una nueva reserva
    const reserva = req.body;

    try {
      const reservaNueva = await Reserva.create(reserva);

      res.status(201).json(Respuesta.exito(reservaNueva, "Reserva insertada"));
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(null, `Error al crear una reserva nueva: ${reserva}`)
        );
    }
  }

  async getAllReserva(req, res) {
    try {
      const data = await Reserva.findAll({
        include: [
          {
            model: Cliente,
            as: "client_id_cliente",
          },
        ],
      }); // Recuperar todos las reservas
      res.json(Respuesta.exito(data, "Datos de reservas recuperadas"));
    } catch (err) {
      // Handle errors during the model call
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos de las reservas: ${req.originalUrl}`
          )
        );
    }
  }

  async deleteReserva(req, res) {
    const reservation_id = req.params.reservation_id;
    try {
      const numFilas = await Reserva.destroy({
        where: {
          reservation_id: reservation_id,
        },
      });
      if (numFilas == 0) {
        // No se ha encontrado lo que se quería borrar
        res
          .status(404)
          .json(Respuesta.error(null, "No encontrado: " + reservation_id));
      } else {
        res.status(204).json(Respuesta.exito(null, "Reserva eliminada"));
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al eliminar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  async getReservaById(req, res) {
    // El id plato viene en la ruta /api/platos/:idplato
    const reservation_id = req.params.reservation_id;
    try {
      const fila = await Reserva.findByPk(reservation_id); 
      if(fila){ // Si se ha recuprado una reserva
        res.json(Respuesta.exito(fila, "Reserva recuperado"));
      } else {
        res.status(404).json(Respuesta.error(null, "Reserva no encontrado"));
      }

    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al recuperar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  async updateReserva(req, res) {
    const reserva = req.body; // Recuperamos datos para actualizar
    const reservation_id = req.params.reservation_id; // dato de la ruta

    // Petición errónea, no coincide el id del plato de la ruta con el del objeto a actualizar
    if (reservation_id != reserva.reservation_id) {
      return res
        .status(400)
        .json(Respuesta.error(null, "El id de la reserva no coincide"));
    }

    try {
      const numFilas = await Reserva.update({ ...reserva }, { where: { reservation_id } });

      if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        res
          .status(404)
          .json(Respuesta.error(null, "No encontrada o no modificada: " + reservation_id));
      } else {
        // Al dar status 204 no se devuelva nada
        // res.status(204).json(Respuesta.exito(null, "Plato actualizado"));
        res.status(204).send();
      }
    } catch (err) {
      logMensaje("Error :" + err);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            `Error al actualizar los datos: ${req.originalUrl}`
          )
        );
    }
  }

  

  // // Handles retrieval of a single type by its ID (implementation pending)
  // async getTipoById(req, res) {
  //   // Implementa la lógica para obtener un dato por ID (pendiente de implementar)
  //   const idtipo = req.params.idtipo;
  //   try {
  //     const data = await tipoService.getTipoById(idtipo); // Fetch all types from the service
  //     if(data.length > 0 ){
  //       res.json(Respuesta.exito(data, "Tipo recuperado"));
  //     } else {
  //       res.status(404).json(Respuesta.error(null, "Tipo no encontrado"));
  //     }

  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }

  // // Handles creation of a new type
  // async createTipo(req, res) {
  //   // Implementa la lógica para crear un nuevo dato
  //   const tipo = req.body;
  //   try {
  //     const idtipo = await tipoService.createTipo(tipo);
  //     // Relleno en el objeto que tenía el idtipo asignado
  //     // al insertar en la base de datos
  //     tipo.idtipo = idtipo;
  //     res.status(201).json(Respuesta.exito(tipo, "Tipo insertado"));
  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }

  // }

  // // Handles updating of a type by its ID (implementation pending)
  // async updateTipo(req, res) {
  //   const tipo = req.body; // Recuperamos datos para actualizar
  //   const idtipo = req.params.idtipo; // dato de la ruta
  //   try {
  //     const numFilas = await tipoService.updateTipo(tipo);

  //     if(numFilas == 0){ // No se ha encontrado lo que se quería actualizar
  //       res.status(404).json(Respuesta.error(null, "No encontrado: " + idtipo))
  //     } else{
  //       // Al dar status 204 no se devuelva nada
  //       res.status(204).json(Respuesta.exito(null, "Tipo actualizado"));
  //     }

  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al actualizar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }

  // }

  // // Handles deletion of a type by its ID (implementation pending)
  // async deleteTipo(req, res) {

  //   const idtipo = req.params.idtipo;
  //   try {
  //     const numFilas = await tipoService.deleteTipo(idtipo);
  //     if(numFilas == 0){ // No se ha encontrado lo que se quería borrar
  //       res.status(404).json(Respuesta.error(null, "No encontrado: " + idtipo))
  //     } else{
  //       res.status(204).json(Respuesta.exito(null, "Tipo eliminado"));
  //     }

  //   } catch (err) {
  //     // Handle errors during the service call
  //     res
  //       .status(500)
  //       .json(
  //         Respuesta.error(
  //           null,
  //           `Error al recuperar los datos: ${req.originalUrl}`
  //         )
  //       );
  //   }
  // }
}

module.exports = new ReservaController();

// Structure of result (MySQL)
// {
//   fieldCount: 0,
//   affectedRows: 1, // Number of rows affected by the query
//   insertId: 1,     // ID generated by the insertion operation
//   serverStatus: 2,
//   warningCount: 0,
//   message: '',
//   protocol41: true,
//   changedRows: 0   // Number of rows changed by the query
// }
