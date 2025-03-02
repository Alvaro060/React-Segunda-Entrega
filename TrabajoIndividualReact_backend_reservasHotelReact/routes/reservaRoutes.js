// reservaRoutes.js
const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

router.get('/', reservaController.getAllReserva);
router.post('/', reservaController.createReserva);
router.get('/:reservation_id', reservaController.getReservaById);  
router.delete('/:reservation_id', reservaController.deleteReserva);
router.put('/:reservation_id', reservaController.updateReserva);
// router.get('/:idtipo', tipoController.getTipoById);

// router.put('/:idtipo', tipoController.updateTipo);
// router.delete('/:idtipo', tipoController.deleteTipo);

module.exports = router;
