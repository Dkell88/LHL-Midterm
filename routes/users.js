/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const db = require('../db/db');
const express = require("express");
const router = express.Router();
// const userQueries = require("../db/user-queries");
const userRouter = () => {
  router.get("/contri/:id", (req, res) => {
    db.query(
      `
      SELECT maps.*
      FROM maps
      WHERE user_id = ${req.params.id};`
    )
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/favs/:id", (req, res) => {
    db.query(
      `
      SELECT users.name,
      favourites.map_id,
      favourites.user_id,
      maps.title
      FROM users
      JOIN favourites ON users.id = favourites.user_id
      JOIN maps ON maps.id = favourites.map_id
      WHERE favourites.user_id = 1;
      `
    )
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/fav", (req, res) => {
    db.query(
      `
      INSERT INTO favourites (user_id,map_id )
      VALUES ($1,$2);
      `,
      [1, req.cookies.mapID]
    ).catch((err) => {
      res.status(500).json({ error: err.message });
    });
  });

  router.get("/:id", (req, res) => {
    console.log("req.params", req.params);
    db.query(
      `
      SELECT *
      FROM users
      WHERE users.id = $1
      `,
      [req.params.id]
    )
      .then((data) => {
        const users = data.rows[0];
        console.log("users", users);
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = userRouter;
