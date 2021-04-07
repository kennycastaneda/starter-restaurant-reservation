const knex = require("../db/connection");
const tableName = "reservations";
const query = knex(tableName).select("*");
function list(date) {
  if (date != null) {
    query.where({ reservation_date: date });
  }
  return query.orderBy("reservation_time");
}

function create(newReservation) {
  return knex(tableName).insert(newReservation).returning("*");
}
module.exports = {
  list,
  create,
};
