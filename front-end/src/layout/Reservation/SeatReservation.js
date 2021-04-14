import React from "react";
import { reservationStatusUpdate } from "../../utils/api";

function SeatReservation({ reservation }) {
  function handleCancle(event) {
    console.log("to do: Setup condition window: ");
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      reservationStatusUpdate(
        event.target.value,
        "cancelled",
        abortController.signal
      );
      window.location.reload();
      return () => abortController.abort();
    } else {
      //do nothing
    }
  }
  return (
    <div>
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
      <div className="d-flex">
        <a
          href={`/reservations/${reservation.reservation_id}/seat`}
          className="btn btn-primary m-1"
          hidden={!(reservation.reservation_status === "booked")}
        >
          Seat
        </a>
        <a
          href={`/reservations/${reservation.reservation_id}/edit`}
          className="btn btn-secondary m-1"
          hidden={!(reservation.reservation_status === "booked")}
        >
          Edit
        </a>
        <button
          onClick={handleCancle}
          className="btn btn-danger m-1"
          value={reservation.reservation_id}
          data-reservation-id-cancel={reservation.reservation_id}
          hidden={reservation.reservation_status === "cancelled"}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
export default SeatReservation;
