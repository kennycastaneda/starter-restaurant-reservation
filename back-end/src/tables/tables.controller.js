const TableService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
function hasData(req, res, next) {
  const methodName = "hasData";
  req.log.debug({ __filename, methodName, body: req.body });

  if (req.body.data) {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message = "body must have data property";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
}
function dataHas(propertyName) {
  const methodName = `dataHas('${propertyName}')`;
  return (req, res, next) => {
    req.log.debug({ __filename, methodName, body: req.body });
    const { data = {} } = req.body;
    const value = data[propertyName];
    if (value) {
      req.log.trace({ __filename, methodName, valid: true });
      return next();
    }
    const message = `Article must include a ${propertyName}`;
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  };
}

const hasTableName = dataHas("table_name");
const hasCapacity = dataHas("capacity");

async function create(req, res) {
  const newTable = await TableService.create(req.body.data);

  res.status(201).json({
    data: newTable,
  });
}

async function update(req, res) {
  const updatedTable = await TableService.update(req.body.data);
  res.status(200).json({
    data: updatedTable,
  });
}
async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });

  const { occupied = null } = req.query;
  const data = await TableService.list(occupied);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

module.exports = {
  create: [hasData, hasTableName, hasCapacity, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  update: asyncErrorBoundary(update),
};
