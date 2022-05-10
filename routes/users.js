/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const userQueries = require("../db/user-queries");

//already looking at /users/
router.get("/:id", (req, res) => {
  db.query(
    `
    SELECT users.name,
    favourites.map_id,
    favourites.user_id
    maps.title

    FROM users
    JOIN maps ON maps.id = favourites.map_id
    JOIN favourites ON users.id = favourites.user_id
    WHERE user_id = $1;`
  )
    .then((data) => {
      const users = data.rows;
      res.send({ users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});
// router.get("/:id", (req,res) => {
// ``
// })
modules.exports = router;

$.get(`/users/${USER_ID}`);
