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

  useEffect(loadAllReservations, []);

  function loadAllReservations() {
    const abortController = new AbortController();
    listReservations({}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">All Reservations: </h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.map((reservation) =>
        reservation.reservation_status === "finished" ? null : (
          <div
            className="d-md-flex flex-column mb-3"
            key={reservation.reservation_id}
            display={
              reservation.reservation_status === "finished" ? "none" : "block"
            }
          >
            <h4 className="mb-0">Reservation #{reservation.reservation_id}</h4>
            <p className="mb-0">
              {reservation.first_name} {reservation.last_name} -{" "}
              {reservation.mobile_number}
            </p>
            <p className="mb-0">Date: {reservation.reservation_date}</p>
            <p className="mb-0">Time: {reservation.reservation_time}</p>
            <p className="mb-0">Party Size: {reservation.people}</p>
            <p data-reservation-id-status={reservation.reservation_id}>
              Status: {reservation.reservation_status}
            </p>
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
              className="btn btn-primary m-1"
              hidden={!(reservation.reservation_status === "booked")}
            >
              Seat
            </a>
          </div>
        )
      )}
    </main>
  );
}

export default DashboardAllReservations;
