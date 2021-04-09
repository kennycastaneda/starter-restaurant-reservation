import React, { useEffect, useState } from "react";
import { listTables, finishTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

/**
 * Defines the dashboard all tables component.
 *
 * @returns {JSX.Element}
 */
function DashboardTable() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    return loadTables();
  }, []);

  function loadTables() {
    const abortController = new AbortController();
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }
  async function finishClick(event) {
    await finishTable(event.target.value);
    loadTables();
  }

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables: </h4>
      </div>
      <ErrorAlert error={tablesError} />
      {tables.map((table) => (
        <div className="d-md-flex flex-column mb-3" key={table.table_id}>
          <h4 className="mb-0">Table #{table.table_id}</h4>
          <p className="mb-0">{table.table_name} </p>
          <p data-table-id-status={table.table_id}>
            {table.occupied
              ? `Occupied - Reservation #${table.reservation_id}`
              : "Free"}
          </p>
          <button
            className="btn btn-warning"
            onClick={finishClick}
            value={table.table_id}
            data-reservation-id-status={table.reservation_id}
            disabled={!table.occupied}
          >
            Finish
          </button>
        </div>
      ))}
    </main>
  );
}

export default DashboardTable;
