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
  SELECT users.*,
  favourites.map_id,
  map
   FROM users WHERE id = $1;`
  )
    .then((data) => {
      const users = data.rows[0];
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

$.get(`/userrs/${USER_ID}`);
