# Capstone: Restaurant Reservation System
>  _Periodic Tables_, a startup that is creating a reservation system for fine dining restaurants.
> The software is used only by restaurant personnel when a customer calls to request a reservation.

## Link to live application: 
- [Front-end](https://starter-restaurant-reservation-front.vercel.app/dashboard)
- [Back-end](https://starter-restaurant-reservation.vercel.app/)

## API:
### Back-end Routes:
  * /reservations
  ... -get (list of reservations from db)
  ... -post (add reservation with body, check for all necessary data)
  ... -put (update existing reservation, check for all necessary data)
  * /reservations/:reservation_id
  ... -put (update existing reservation, check for all necessary data)
  ... -get (list specific reservation)
  * /:reservations/:reservation_id/status
  ... -get (list the party size of a reservation)
  ... -put (update a reservation's status)
  * /tables
  ... -get (list of tables from db)
  ... -post (add a new table, check for all necessary data)
  * /tables/:table_id/seat
  ... - put (update table with occupied status)
  ... - delete (open up a table after reservation is over)

## Screenshots:
![Alt text](https://github.com/kennycastaneda/starter-restaurant-reservation/blob/main/reservation%20screenshot.PNG "Reservation Dashboard")
## What it does:
The end user is a restaurant manager or host who takes calls for reservations. They are able to input new reservations, look up and edit existing reservations, and seat reservations when parties arrive. They are also able to add tables with given capacity. There is no current features to edit or delete tables.
## Technologies used:
App utilizes React and Bootstrap for front-end. Utilizes Next.js, knex, and PostgreSQL for back-end.
## Testing instructions:
Once cloned, run "npm run test" to run all tests.
