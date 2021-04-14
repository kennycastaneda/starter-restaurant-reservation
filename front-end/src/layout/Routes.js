import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservation from "./Reservation/CreateReservation";
import SearchReservation from "./Reservation/SearchReservations";
import CreateTable from "./Table/CreateTable";
import SeatTable from "./Table/SeatTable";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import EditReservation from "./Reservation/EditReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [date, setDate] = useState(today());
  async function updateDate(newDate) {
    setDate(newDate);
  }
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>

      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatTable />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation today={today()} updateDate={updateDate} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <CreateReservation today={today()} updateDate={updateDate} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} updateDate={updateDate} />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTable />
      </Route>
      <Route exact={true} path="/search">
        <SearchReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
