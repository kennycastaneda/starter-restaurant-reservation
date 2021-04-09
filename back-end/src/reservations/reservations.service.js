const knex = require("../db/connection");
const tableName = "reservations";

function list(date) {
  const query = knex(tableName).select("*");
  if (date != null) {
    query.where({ reservation_date: date });
  }
  return query.orderBy("reservation_time");
}

function listPeople(reservation_id) {
  return knex(tableName)
    .select("people")
    .where({ reservation_id: reservation_id });
}

function create(newReservation) {
  return knex(tableName).insert(newReservation).returning("*");
}
module.exports = {
  list,
  create,
  listPeople,
};
