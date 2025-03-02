const request = require("supertest");
const app = require("../index.js");

describe("API de Reservas", () => {
  let reservaId;

  test("Debe crear una nueva reserva", async () => {
    const response = await request(app)
      .post("/api/reservas")
      .send({
        client_id: 1,
        check_in_date: "2024-01-15",
        check_out_date: "2024-01-20",
        room_number: 101,
        price: 300.00,
      })
      .expect(201);

    expect(response.body.ok).toBe(true);
    expect(response.body.datos).toHaveProperty("reservation_id");
    reservaId = response.body.datos.reservation_id;
  });

  test("Debe recuperar todas las reservas", async () => {
    const response = await request(app)
      .get("/api/reservas")
      .expect(200);
    
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.datos)).toBe(true);
  });

  test("Debe recuperar una reserva por ID", async () => {
    const response = await request(app)
      .get(`/api/reservas/${reservaId}`)
      .expect(200);
    
    expect(response.body.ok).toBe(true);
    expect(response.body.datos).toHaveProperty("reservation_id", reservaId);
  });

  test("Debe devolver 404 si la reserva no existe", async () => {
    const response = await request(app)
      .get("/api/reservas/99999")
      .expect(404);
    
    expect(response.body.ok).toBe(false);
  });

  test("Debe actualizar una reserva existente", async () => {
    await request(app)
      .put(`/api/reservas/${reservaId}`)
      .send({
        reservation_id: reservaId,
        client_id: 2,
        check_in_date: "2024-02-10",
        check_out_date: "2024-02-15",
        room_number: 205,
        price: 450.00,
      })
      .expect(204);
  });

  test("Debe devolver 400 si el ID en la ruta y el cuerpo no coinciden", async () => {
    const response = await request(app)
      .put(`/api/reservas/${reservaId}`)
      .send({
        reservation_id: 999,
        client_id: 2,
        check_in_date: "2024-02-10",
        check_out_date: "2024-02-15",
        room_number: 205,
        price: 455.00,
      })
      .expect(400);
    
    expect(response.body.ok).toBe(false);
  });

  test("Debe eliminar una reserva existente", async () => {
    await request(app)
      .delete(`/api/reservas/${reservaId}`)
      .expect(204);
  });

  test("Debe devolver 404 al eliminar una reserva inexistente", async () => {
    const response = await request(app)
      .delete("/api/reservas/99999")
      .expect(404);
    
    expect(response.body.ok).toBe(false);
  });
});
