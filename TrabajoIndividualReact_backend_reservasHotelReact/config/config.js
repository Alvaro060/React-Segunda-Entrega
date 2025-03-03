require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

module.exports = {
  port: process.env.PORT || 8083,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "test",
    name: process.env.DB_NAME || "reservasHotelReact",
    port: process.env.DB_PORT || 54577,
  },
  secretKey: process.env.SECRET_KEY || "default_secret",
};
