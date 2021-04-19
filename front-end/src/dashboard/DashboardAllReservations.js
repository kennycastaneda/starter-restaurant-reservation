import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import SeatReservation from "../layout/Reservation/SeatReservation";

/**
 * Defines the dashboard all reservations component.
 *
 * @returns {JSX.Element}
 */
function DashboardAllReservations({ reservations, reservationsError }) {
  return (
    <main>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">All Booked Or Seated Reservations: </h4>
      </div>

      <ErrorAlert error={reservationsError} />
      <div className="d-flex flex-wrap ">
        {reservations.map((reservation) =>
          reservation.status === "finished" ||
          reservation.status === "cancelled" ? null : (
            <div
              className="d-md-flex flex-column border p-3 col"
              key={reservation.reservation_id}
            >
              <SeatReservation reservation={reservation} />
            </div>
          )
        )}
      </div>
    </main>
  );
}

export default DashboardAllReservations;
