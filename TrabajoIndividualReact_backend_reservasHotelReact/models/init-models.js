var DataTypes = require("sequelize").DataTypes;
var _reservas = require("./reservas");
var _clientes = require("./clientes");

function initModels(sequelize) {
  var reservas = _reservas(sequelize, DataTypes);
  var clientes = _clientes(sequelize, DataTypes);

  reservas.belongsTo(clientes, { as: "client_id_cliente", foreignKey: "client_id"});
  clientes.hasMany(reservas, { as: "reservas", foreignKey: "client_id"});

  return {
    reservas,
    clientes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
