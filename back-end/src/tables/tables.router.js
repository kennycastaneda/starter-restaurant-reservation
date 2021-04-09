/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .put(controller.finish)
  .all(methodNotAllowed);

router.route("/:table_id/seat").put(controller.update).all(methodNotAllowed);

module.exports = router;
