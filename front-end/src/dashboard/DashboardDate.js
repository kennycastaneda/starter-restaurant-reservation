import React from "react";
import { previous, next } from "../utils/date-time";

function DashboardDate({ date, updateDate }) {
  const handlePastDay = () => {
    updateDate(previous(date));
  };
  const handleNextDay = () => {
    updateDate(next(date));
  };
  return (
    <div className="d-flex row">
      <button onClick={handlePastDay}>Past Day</button>

      <button onClick={handleNextDay}>Next Day</button>
    </div>
  );
}

export default DashboardDate;
