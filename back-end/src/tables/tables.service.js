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
    .where({ table_name: updateTable.table_name })
    .update({ occupied: true })
    .update({ reservation_id: updateTable.reservation_id })
    .returning("*");
}
module.exports = {
  list,
  create,
  update,
};
