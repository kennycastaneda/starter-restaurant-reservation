import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, seatTable, getPeople } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

/**
 * Defines the dashboard seat table page.
 *
 * @returns {JSX.Element}
 */

function SeatTable() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [people, setPeople] = useState(1);
  const initialFormState = {
    table_name: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });

  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    getPeople(reservation_id, abortController.signal)
      .then((response) => setPeople(response[0].people))
      .catch(setTablesError);

    return () => abortController.abort();
  }, [reservation_id]);
  console.log(people);
  useEffect(loadTables, []);

  function loadTables() {
    const abortController = new AbortController();
    listTables({ occupied: false }, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleChange = ({ target }) => {
    console.log(target.value);
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
      <option
        value={table.table_id}
        key={table.table_id}
        disabled={table.capacity < people}
      >
        Table Name: {table.table_name} - Capacity: {table.capacity}
      </option>
    );
  });
  return (
    <main>
      <h1>Assign Seat For Reservation #{reservation_id}</h1>
      <h2>Party Size is {people} People</h2>
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
              defaultValue=""
            >
              <option value="" disabled>
                --Select Free Table w/ Right Capacity--
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
