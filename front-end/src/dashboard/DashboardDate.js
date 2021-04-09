import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

function DashboardDate({ date, updateDate }) {
  const history = useHistory();
  const handlePastDay = () => {
    updateDate(previous(date));
    history.push(`/dashboard?date=${previous(date)}`);
  };
  const handleNextDay = () => {
    updateDate(next(date));
    history.push(`/dashboard?date=${next(date)}`);
  };
  const handleToday = () => {
    updateDate(today());
    history.push(`/dashboard`);
  };
  return (
    <div className="d-flex row justify-content-around">
      <button className="w-25 btn btn-secondary" onClick={handlePastDay}>
        Past Day
      </button>
      <button className="w-25 btn btn-secondary" onClick={handleNextDay}>
        Next Day
      </button>
      <button className="w-25 btn btn-success" onClick={handleToday}>
        Today
      </button>
    </div>
  );
}

export default DashboardDate;
