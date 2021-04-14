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
async function peopleIsNumber(req, res, next) {
  const methodName = "hasValidDate And Time";
  req.log.debug({ __filename, methodName, body: req.body });
  const people = req.body.data.people;

  if (typeof people != "number") {
    return next({ status: 400, message: "people is not a number" });
  }
  next();
}

async function hasValidDate(req, res, next) {
  const methodName = "hasValidDate And Time";
  req.log.debug({ __filename, methodName, body: req.body });
  const date = req.body.data.reservation_date;
  const checkDate = new Date(date);
  const time = req.body.data.reservation_time;
  const [hour, minute] = time.split(":");
  if (isNaN(hour) || isNaN(minute)) {
    const message = "reservation_time is not valid time type";
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({ status: 400, message: message });
  }

  if (checkDate == "Invalid Date") {
    const message = "reservation_date is not valid date type";
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({ status: 400, message: message });
  }

  if (!checkTuesday(date) || !checkInPast(date)) {
    const message =
      "reservation_date is not valid...either in the past (needs to be current or future day) or Tuesday closed";
    req.log.trace({ __filename, methodName, valid: false }, message);
    return next({ status: 400, message: message });
  }
  req.log.trace({ __filename, methodName, valid: true });
  next();
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
    data: newReservation[0],
  });
}
async function update(req, res) {
  const updatedReservation = await ReservationService.update(req.body.data);

  res.status(201).json({
    data: updatedReservation[0],
  });
}

async function list(req, res) {
  const methodName = "list";
  req.log.debug({ __filename, methodName });

  const { date = null } = req.query;
  const { mobile_number = null } = req.query;
  const { reservation_id = null } = req.query;
  const data = await ReservationService.list(
    date,
    mobile_number,
    reservation_id
  );
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
async function reservationStatus(req, res) {
  const methodName = "reservationStatus";
  req.log.debug({ __filename, methodName });
  const { reservation_id = null } = req.params;
  const { new_status = null } = req.body.data;

  if (reservation_id === null || new_status === null) {
    const message = "Reservation ID param or Status datum is missing";
    next({ status: 400, message: message });
    req.log.debug({ __filename, methodName, valid: false }, message);
  }
  const reservationStatusData = await ReservationService.reservationStatus(
    reservation_id,
    new_status
  );
  res.json({ data: reservationStatusData });
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
    asyncErrorBoundary(peopleIsNumber),
    asyncErrorBoundary(hasValidDate),
    asyncErrorBoundary(create),
  ],
  update: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasPeople,
    asyncErrorBoundary(peopleIsNumber),
    asyncErrorBoundary(hasValidDate),
    asyncErrorBoundary(update),
  ],
  listPeople: asyncErrorBoundary(listPeople),
  list: asyncErrorBoundary(list),
  reservationStatus: asyncErrorBoundary(reservationStatus),
};
