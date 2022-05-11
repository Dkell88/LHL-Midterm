/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
// const userQueries = require("../db/user-queries");
const userRouter = (db) => {
  router.get("/:id", (req, res) => {
    db.query(
      `
      SELECT maps.*
      FROM maps
      WHERE user_id = ${req.params.id};`
      // JOIN users ON users.id = user_id
      // `
      // SELECT users.name,
      // favourites.map_id,
      // favourites.user_id,
      // maps.title
      // FROM users
      // JOIN favourites ON users.id = favourites.user_id
      // JOIN maps ON maps.id = favourites.map_id

      // WHERE favourites.user_id = 1;
      // `
    )
      .then((data) => {
<<<<<<< HEAD
        const users = data.rows;
        res.json({ users });
=======
        const maps = data.rows;
        // console.log("users", users);
        res.json({ maps });
>>>>>>> fix/contributions-not-adding
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = userRouter;
