const knex = require("../db/connection");
const tableName = "tables";
const query = knex(tableName).select("*");
function list(occupied) {
  const query = knex(tableName).select("*");
  if (occupied != null) {
    query.where({ occupied: occupied });
  }
  return query.orderBy("table_name");
}

function create(newTable) {
  return knex(tableName).insert(newTable).returning("*");
}
function update(updateTable) {
  console.log(updateTable);
  return knex(tableName)
    .where({ table_id: updateTable.table_id })
    .update({ occupied: true })
    .update({ reservation_id: updateTable.reservation_id })
    .returning("*");
}

function finish(table_id) {
  console.log(table_id);
  return knex(tableName)
    .where({ table_id: table_id })
    .update({ occupied: false })
    .update({ reservation_id: null })
    .returning("*");
}
module.exports = {
  list,
  create,
  update,
  finish,
};
