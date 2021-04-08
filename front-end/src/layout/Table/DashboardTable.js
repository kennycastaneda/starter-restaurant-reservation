import React, { useEffect, useState } from "react";
import { listTables } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

/**
 * Defines the dashboard all tables component.
 *
 * @returns {JSX.Element}
 */
function DashboardTable() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadTables, []);

  function loadTables() {
    console.log("getting tables");
    const abortController = new AbortController();
    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const listOfTables = tables.map((table) => (
    <div className="d-md-flex flex-column mb-3" key={table.table_id}>
      <h4 className="mb-0">Table #{table.table_id}</h4>
      <p className="mb-0">{table.table_name} </p>
      <p data-table-id-status={table.table_id}>
        {table.occupied
          ? `Occupied - Reservation #${table.reservation_id}`
          : "Free"}
      </p>
    </div>
  ));

  return (
    <main>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables: </h4>
      </div>
      <ErrorAlert error={tablesError} />
      {listOfTables}
    </main>
  );
}

export default DashboardTable;
