/**
 * List handler for reservation resources
 */
const ReservationService = require("./reservations.service");
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
const hasFirstName = dataHas("first_name");
const hasLastName = dataHas("last_name");
const hasMobileNumber = dataHas("mobile_number");
const hasReservationDate = dataHas("reservation_date");
const hasReservationTime = dataHas("reservation_time");
const hasPeople = dataHas("people");

async function create(req, res) {
  const newReservation = await ReservationService.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  });
}

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });
  //console.log(req.query);
  const { date = null } = req.query;
  const data = await ReservationService.list(date);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

module.exports = {
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasPeople,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
};
