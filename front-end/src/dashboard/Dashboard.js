import React, { useEffect } from "react";
//import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import DashboardDate from "./DashboardDate";
import DashboardAllReservations from "./DashboardAllReservations";
import DashboardTable from "../layout/Table/DashboardTable";

/**
 * Defines the dashboard page.
 * @param date
 * @param updateDate
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  date,
  updateDate,
  loadAllReservations,
  loadDashboard,
  loadTables,
  tables,
  tablesError,
  setTablesError,
  listTables,
  reservationsDate,
  reservationsDateError,
  bookedReservations,
  bookedReservationsError,
}) {
  useEffect(loadTables, []);
  useEffect(loadAllReservations, []);
  useEffect(loadDashboard, [date]);

  const query = useQuery();
  const dateQuery = query.get("date");
  if (dateQuery != null) {
    date = dateQuery;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="w-100 px-5 ">
        <DashboardDate date={date} updateDate={updateDate} />
      </div>
      <div className="d-md-flex mb-3 px-5 pt-5 ">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsDateError} />
      <div className="px-5 d-flex flex-wrap ">
        {reservationsDate.map((reservation) => (
          <div
            className="d-md-flex flex-column  p-1 border col"
            key={reservation.reservation_id}
          >
            <h4 className="mb-0">Reservation #{reservation.reservation_id}</h4>
            <h5>{reservation.status}</h5>
            <p className="mb-0">
              {reservation.first_name} {reservation.last_name} -{" "}
              {reservation.mobile_number}
            </p>
            <p className="mb-0">Date: {reservation.reservation_date}</p>
            <p className="mb-0">Time: {reservation.reservation_time}</p>
            <p className="mb-0">Party Size: {reservation.people}</p>
          </div>
        ))}
      </div>

      <div className="d-md-flex mb-3">
        <div className="column w-50 d-flex flex-wrap">
          <DashboardAllReservations
            reservations={bookedReservations}
            reservationsError={bookedReservationsError}
          />
        </div>
        <div className="column w-50  d-flex flex-wrap">
          <DashboardTable
            loadAllReservations={loadAllReservations}
            loadDashboard={loadDashboard}
            loadTables={loadTables}
            tables={tables}
            tablesError={tablesError}
            setTablesError={setTablesError}
            listTables={listTables}
          />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
