-- Creación de la base de datos 'reservasHotel'
CREATE DATABASE IF NOT EXISTS reservasHotelReact;

-- Selección de la base de datos 'reservasHotel' para usarla
USE reservasHotelReact;

-- Creación de la tabla 'clientes'
CREATE TABLE clientes (
    client_id INT AUTO_INCREMENT PRIMARY KEY,  -- Identificador único para cada cliente
    client_name VARCHAR(100) NOT NULL,         -- Nombre del cliente
    address VARCHAR(255),                      -- Dirección del cliente
    phone_number VARCHAR(20),                  -- Número de teléfono del cliente
    email VARCHAR(100)                         -- Correo electrónico del cliente
);

-- Creación de la tabla 'reservas'
CREATE TABLE reservas (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,  -- Identificador único para cada reserva
    client_id INT,                                  -- ID del cliente (relacionado con la tabla 'clientes')
    check_in_date DATE,                             -- Fecha de llegada de la reserva
    check_out_date DATE,                            -- Fecha de salida de la reserva
    room_number INT,                                -- Número de habitación reservada
    price DECIMAL(10, 2),                           -- Precio de la reserva
    FOREIGN KEY (client_id) REFERENCES clientes(client_id)  -- Relación con la tabla 'clientes'
);

-- Inserción de registros en la tabla 'clientes'
INSERT INTO clientes (client_name, address, phone_number, email) VALUES
('Juan Pérez', 'Calle Falsa 123, Madrid', '612345678', 'juan.perez@mail.com'),
('María López', 'Av. Gran Vía 45, Barcelona', '634567890', 'maria.lopez@mail.com'),
('Ana Martínez', 'Calle Real 789, Valencia', '654321098', 'ana.martinez@mail.com'),
('Carlos Sánchez', 'Plaza Mayor 2, Sevilla', '611223344', 'carlos.sanchez@mail.com'),
('Laura García', 'Calle del Sol 56, Málaga', '677889900', 'laura.garcia@mail.com'),
('Pedro Gómez', 'Calle Luna 34, Bilbao', '611223455', 'pedro.gomez@mail.com'),
('Beatriz Fernández', 'Av. de la Constitución 1, Madrid', '623445566', 'beatriz.fernandez@mail.com'),
('Sergio Ruiz', 'Calle del Mar 22, Valencia', '698774455', 'sergio.ruiz@mail.com'),
('Patricia Díaz', 'Paseo de la Castellana 88, Madrid', '655433221', 'patricia.diaz@mail.com'),
('Jorge Martín', 'Calle de la Paz 13, Barcelona', '612334455', 'jorge.martin@mail.com');

-- Inserción de registros en la tabla 'reservas'
INSERT INTO reservas (client_id, check_in_date, check_out_date, room_number, price) VALUES
(1, '2024-01-15', '2024-01-20', 101, 300.00),
(2, '2024-02-10', '2024-02-15', 205, 450.00),
(3, '2024-03-05', '2024-03-07', 303, 200.00),
(4, '2024-04-01', '2024-04-05', 402, 500.00),
(5, '2024-05-12', '2024-05-18', 109, 350.00),
(6, '2024-06-22', '2024-06-25', 306, 400.00),
(7, '2024-07-10', '2024-07-15', 212, 250.00),
(8, '2024-08-15', '2024-08-18', 413, 320.00),
(9, '2024-09-01', '2024-09-05', 110, 420.00),
(10, '2024-10-20', '2024-10-22', 502, 550.00);
