import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, seatTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

/**
 * Defines the dashboard seat table page.
 *
 * @returns {JSX.Element}
 */

function SeatTable() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const initialFormState = {
    table_name: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    listTables({ occupied: false }, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const abortController = new AbortController();

      seatTable(formData.table_name, reservation_id, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setTablesError(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const listOfTableNames = tables.map((table) => {
    return (
      <option value={table.table_name} key={table.table_id}>
        {table.table_name}
      </option>
    );
  });
  return (
    <main>
      <h1>Assign Seat</h1>
      <div className="d-md-flex mb-3">
        <form onSubmit={handleSubmit} className="column">
          <label>
            Table Name
            <br />
            <select
              id="table_name"
              name="table_name"
              required
              onChange={handleChange}
              className="w-100"
              //   multiple
            >
              <option defaultValue="" disabled>
                Select free table
              </option>
              {listOfTableNames}
            </select>
          </label>

          <br />

          <div className="container">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary m-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary m-1">
              Submit
            </button>
          </div>
        </form>
        <ErrorAlert error={tablesError} />
      </div>
    </main>
  );
}

export default SeatTable;
