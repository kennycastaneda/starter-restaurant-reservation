import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../../layout/ErrorAlert";
import { createReservation } from "../../utils/api";
import {
  checkInPast,
  checkTime,
  checkTodayTime,
  checkTuesday,
} from "../../utils/date-time";

/**
 * Defines the create reservation page.
 * @param today date of today
 * @param updateDate function to update date displayed on dashboard
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function CreateReservation({ today, updateDate }) {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: today,
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState({ ...initialFormState });
  const [reservationsError, setReservationsError] = useState([]);
  const history = useHistory();

  const handleChange = ({ target }) => {
    setReservationsError([]);
    setFormData({
      ...formData,
      [target.name]: target.value,
    });

    if (target.name === "reservation_date") {
      try {
        checkInPast(target.value);
      } catch (error) {
        setReservationsError((reservationsError) => [
          ...reservationsError,
          <ErrorAlert error={error} key={error} />,
        ]);
      }
      try {
        checkTuesday(target.value);
      } catch (error) {
        setReservationsError((reservationsError) => [
          ...reservationsError,
          <ErrorAlert error={error} key={error} />,
        ]);
      }
    }
    if (target.name === "reservation_time") {
      try {
        checkTime(target.value);
      } catch (error) {
        setReservationsError((reservationsError) => [
          ...reservationsError,
          <ErrorAlert error={error} key={error} />,
        ]);
      }
      if (formData.reservation_date === today) {
        try {
          checkTodayTime(target.value);
        } catch (error) {
          setReservationsError((reservationsError) => [
            ...reservationsError,
            <ErrorAlert error={error} key={error} />,
          ]);
        }
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const abortController = new AbortController();
      createReservation(formData, abortController.signal);
      console.log("new reservation date: ", formData.reservation_date);
      updateDate(formData.reservation_date);
      history.push(`/dashboard`);
    } catch (error) {
      setReservationsError((reservationsError) => [
        ...reservationsError,
        <ErrorAlert error={error} key={error} />,
      ]);
    }
  };
  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <main>
      <h1>Create New Reservation</h1>
      <div className="d-md-flex mb-3">
        <form onSubmit={handleSubmit} className="column">
          <label>
            First Name
            <br />
            <input
              type="text"
              id="first_name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-100"
              placeholder="Enter First Name"
            />
          </label>
          <br />
          <label>
            Last Name
            <br />
            <input
              type="text"
              id="last_name"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-100"
              placeholder="Enter Last Name"
            />
          </label>
          <br />
          <label>
            Mobile Number
            <br />
            <input
              type="tel"
              id="mobile_number"
              name="mobile_number"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              required
              minLength="10"
              maxLength="15"
              value={formData.mobile_number}
              onChange={handleChange}
              className="w-100"
              placeholder="555-555-1234"
            />
          </label>

          <small>Format 555-555-1234</small>
          <br />
          <label>
            Reservation Date
            <br />
            <input
              type="date"
              id="reservation_date"
              name="reservation_date"
              required
              value={formData.reservation_date}
              onChange={handleChange}
              className="w-100"
              min="2018-01-01"
              max="2030-12-31"
            />
          </label>
          <br />
          <label>
            Reservation Time
            <br />
            <input
              type="time"
              id="reservation_time"
              name="reservation_time"
              required
              value={formData.reservation_time}
              onChange={handleChange}
              className="w-100"
              min="10:29"
              max="21:31"
            />
            <small>Reservation hours are 10am to Midnight</small>
          </label>
          <br />
          <label>
            Party Size
            <br />
            <input
              type="number"
              id="people"
              name="people"
              required
              value={formData.people}
              onChange={handleChange}
              className="w-100"
              min="1"
              max="24"
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
              Submit
            </button>
          </div>
        </form>
      </div>
      {reservationsError}
    </main>
  );
}
export default CreateReservation;
