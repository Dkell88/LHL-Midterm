/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

// Once teh queries are working we'll pull them out to a seperate file
//const userQueries = require('../db/user-queries')

// users/
const usersRouter = (db) => {
  router.get("/:id", (req, res) => {
    db.query(
      `SELECT users.name, favourites.user_id, favourites.map_id, maps.title  FROM users JOIN favourites ON  users.id = user_id JOIN maps ON users.id = maps.user_id WHERE users.id = $1;`
    )
      .then((usersInfo) => {
        const users = usersInfo.rows;
        res.send(users);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = usersRouter;
