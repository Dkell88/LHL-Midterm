/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


const pointRouter = (db) => {


  //GET /points/
  router.get("/", (req, res) => {
    let query = `SELECT * FROM points`;
    console.log(query);
    db.query(query)
      .then(data => {
        const points = data.rows;
        res.json({ points });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    });

    router.post("/", (req, res) => {
      let query = `
      INSERT INTO points (map_id, title, description, image_url, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
      const queryParams = [req.body.mapId, req.body.title, req.body.descritpion, req.body.imageURL, req.body.latitude, req.body.longitude];
      // console.log(req.body);
      // console.log(query);
      // console.log(queryParams);
      db.query(query,queryParams)
        .then(pointAdded => {  
          return pointAdded.rows;
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      });


  return router;
}


module.exports = pointRouter;
