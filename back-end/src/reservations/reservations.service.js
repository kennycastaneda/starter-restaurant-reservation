const knex = require("../db/connection");
const tableName = "reservations";

function list(date, mobile_number, reservation_id) {
  const query = knex(tableName).select("*");
  if (date != null) {
    query.where({ reservation_date: date });
  }
  if (mobile_number != null) {
    query.whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    );
  }
  if (reservation_id != null) {
    query.where({ reservation_id: reservation_id });
  }
  return query.orderBy("reservation_date").orderBy("reservation_time");
}

function listPeople(reservation_id) {
  return knex(tableName)
    .select("people")
    .where({ reservation_id: reservation_id });
}
function reservationStatus(reservation_id, new_status) {
  return knex(tableName)
    .select("*")
    .update({ reservation_status: new_status })
    .where({ reservation_id: reservation_id });
}

function create(newReservation) {
  return knex(tableName).insert(newReservation).returning("*");
}
function update(updatedReservation) {
  return knex(tableName)
    .where({
      reservation_id: updatedReservation.reservation_id,
    })
    .update(updatedReservation)
    .returning("*");
}

module.exports = {
  list,
  create,
  listPeople,
  reservationStatus,
  update,
};
