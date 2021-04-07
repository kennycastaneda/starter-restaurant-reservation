import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardDate from "./DashboardDate";

/**
 * Defines the dashboard page.
 * @param date
 * @param updateDate
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, updateDate }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
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
    </div>
  ));

  return (
    <main>
      <h1>Dashboard</h1>
      <DashboardDate date={date} updateDate={updateDate} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {listOfReservations}
    </main>
  );
}

export default Dashboard;
