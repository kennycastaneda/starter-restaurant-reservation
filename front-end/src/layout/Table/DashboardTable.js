import React from "react";
import { finishTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

/**
 * Defines the dashboard all tables component.
 *
 * @returns {JSX.Element}
 */
function DashboardTable({
  loadAllReservations,
  loadDashboard,
  loadTables,
  tables,
  tablesError,
  setTablesError,
}) {
  async function finishClick(event) {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      const reservationTableIds = event.target.value.split(",");
      console.log(reservationTableIds);
      Promise.all([
        // reservationStatusUpdate(
        //   reservationTableIds[1], //reservation_id
        //   "finished",
        //   abortController.signal
        // ),

        finishTable(
          reservationTableIds[0], //table_id
          reservationTableIds[1], //reservation_id
          abortController.signal
        ),
      ])
        .then(loadTables)
        .then(loadAllReservations)
        .then(loadDashboard)
        .catch(setTablesError);

      return () => abortController.abort();
    } else {
      //do nothing
    }
  }

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables: </h4>
      </div>
      <ErrorAlert error={tablesError} />
      <div className="d-flex flex-wrap ">
        {tables.map((table) => (
          <div
            className="d-md-flex flex-column border p-3 col"
            key={table.table_id}
          >
            <h4 className="mb-0">
              Table {table.table_name} - {table.capacity}
            </h4>

            <p data-table-id-status={table.table_id}>
              {table.occupied ? "Occupied" : "Free"}
            </p>
            <p>
              {table.occupied ? `Reservation #${table.reservation_id}` : null}
            </p>
            <button
              className="btn btn-warning"
              onClick={finishClick}
              value={[table.table_id, table.reservation_id]}
              data-table-id-finish={table.table_id}
              data-reservation-id-status={table.reservation_id}
              disabled={!table.occupied}
            >
              Finish
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default DashboardTable;
