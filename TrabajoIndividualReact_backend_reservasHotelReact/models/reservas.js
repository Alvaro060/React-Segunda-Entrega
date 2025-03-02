const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "reservas",
    {
      reservation_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      client_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clientes",
          key: "client_id",
        },
      },
      check_in_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      room_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "reservas",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "reservation_id" }],
        },
        {
          name: "FK_CLIENTES",
          using: "BTREE",
          fields: [{ name: "client_id" }],
        },
      ],
    }
  );
};
