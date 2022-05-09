/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
// Once teh queries are working we'll pull them out to a seperate file
//const userQueries = require('../db/maps-queries')

// maps/
const mapsRouter = (db) => {
  

  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM maps WHERE id = $1;`)
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


module.exports = mapsRouter;