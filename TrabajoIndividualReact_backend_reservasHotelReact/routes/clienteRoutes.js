// clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.getAllCliente);
router.post('/', clienteController.createCliente);
router.get('/:client_id', clienteController.getClienteById);
router.delete('/:client_id', clienteController.deleteCliente);
router.put('/:client_id', clienteController.updateCliente);
// router.get('/:idtipo', tipoController.getTipoById);
// router.post('/', tipoController.createTipo);
// router.put('/:idtipo', tipoController.updateTipo);
// router.delete('/:idtipo', tipoController.deleteTipo);

module.exports = router;
