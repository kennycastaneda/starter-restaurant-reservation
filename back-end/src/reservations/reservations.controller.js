/**
 * List handler for reservation resources
 */
function checkInPast(currentDate) {
  let [year, month, day] = currentDate.split("-");
  month -= 1;
  const versusToday = new Date(year, month, day);
  versusToday.setHours(23);
  versusToday.setMinutes(59);
  const today = new Date();

  if (versusToday.getTime() < today.getTime()) {
    return false;
  }
  return true;
}
function checkTuesday(currentDate) {
  let [year, month, day] = currentDate.split("-");
  month -= 1;
  const tuesdayDate = new Date(year, month, day);

  if (tuesdayDate.getDay() === 2) {
    return false;
  }
  return true;
}
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

async function hasValidDate(req, res, next) {
  const methodName = "hasValidDate";
  req.log.debug({ __filename, methodName, body: req.body });
  const date = req.body.data.reservation_date;

  if (checkTuesday(date) && checkInPast(date)) {
    req.log.trace({ __filename, methodName, valid: true });
    return next();
  }
  const message = "Date is not valid...either in the past or falls on Tuesday";
  next({ status: 400, message: message });
  req.log.trace({ __filename, methodName, valid: false }, message);
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

  const { date = null } = req.query;
  const data = await ReservationService.list(date);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}
async function listPeople(req, res) {
  const methodName = "listPeople";
  req.log.debug({ __filename, methodName });

  const { reservation_id = null } = req.params;
  if (reservation_id === null) {
    const message = "Reservation ID param is missing";
    next({ status: 400, message: message });
    req.log.trace({ __filename, methodName, valid: false }, message);
  }

  const data = await ReservationService.listPeople(reservation_id);
  res.json({ data });
  req.log.trace({ __filename, methodName, return: true, data });
}

module.exports = {
  create: [
    hasData,
    asyncErrorBoundary(hasValidDate),
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasPeople,
    asyncErrorBoundary(create),
  ],
  listPeople: asyncErrorBoundary(listPeople),
  list: asyncErrorBoundary(list),
};
