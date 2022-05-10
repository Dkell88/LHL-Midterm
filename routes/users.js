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
  
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows[0];
        res.send( users );
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    });

  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM users WHERE id = $1;`)
      .then((data) => {
        const users = data.rows[0];
        res.send( users );
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
    });



    
  return router;
};


module.exports = usersRouter;