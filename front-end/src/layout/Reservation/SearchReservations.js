import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../../layout/ErrorAlert";
import { searchReservation } from "../../utils/api";

/**
 * Defines the create reservation page.
 * @param today date of today
 * @param updateDate function to update date displayed on dashboard
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function SearchReservation() {
  const initialFormState = {
    mobile_number: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();

  const handleChange = ({ target }) => {
    setReservationsError([]);
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const abortController = new AbortController();
      searchReservation(formData, abortController.signal);
    } catch (error) {
      setReservationsError(error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <main>
      <h1>Search Reservations</h1>
      <div className="d-md-flex mb-3">
        <form onSubmit={handleSubmit} className="column">
          <label>
            Enter Mobile Number
            <br />
            <input
              type="tel"
              id="mobile_number"
              name="mobile_number"
              required
              minLength="1"
              maxLength="15"
              value={formData.mobile_number}
              onChange={handleChange}
              className="w-100"
              placeholder="555-555-1234"
            />
          </label>

          <div className="container">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary m-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary m-1">
              Find
            </button>
          </div>
        </form>
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}
export default SearchReservation;
