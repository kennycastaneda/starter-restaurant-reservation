import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard all reservations component.
 *
 * @returns {JSX.Element}
 */
function DashboardAllReservations() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, []);

  function loadDashboard() {
    const abortController = new AbortController();
    listReservations({}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const listOfReservations = reservations.map((reservation) => (
    <div
      className="d-md-flex flex-column mb-3"
      key={reservation.reservation_id}
    >
      <h4 className="mb-0">Reservation #{reservation.reservation_id}</h4>
      <p className="mb-0">
        {reservation.first_name} {reservation.last_name} -{" "}
        {reservation.mobile_number}
      </p>
      <p className="mb-0">Date: {reservation.reservation_date}</p>
      <p className="mb-0">Time: {reservation.reservation_time}</p>
      <p className="mb-0">Party Size: {reservation.people}</p>
      <a
        href={`/reservations/${reservation.reservation_id}/seat`}
        className="btn btn-primary m-1"
      >
        Seat
      </a>
    </div>
  ));

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">All Reservations: </h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {listOfReservations}
    </main>
  );
}

export default DashboardAllReservations;
