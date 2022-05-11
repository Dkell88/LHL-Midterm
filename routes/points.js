/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
// Once teh queries are working we'll pull them out to a seperate file
//const userQueries = require('../db/points-queries')

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

    router.get("/:id", (req, res) => {
      let query = `SELECT * FROM points WHERE id = $1`;
      let queryParams = [req.params.id]
      console.log("The query parameters for the GET /points/:id is: ",queryParams);
      db.query(query, queryParams)
        .then(point => {
          console.log("Point returned by /:id query is: ", point.rows[0])
          res.send(point.rows[0])
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      });

      router.get("/leaflet/:leafletId", (req,res) => {
        let query = `SELECT * FROM points WHERE leaflet_id = $1`;
        let queryParams = [req.params.leafletId]
        console.log("The query parameters for the GET /points/leaflit/:leafletId is: ",queryParams);
        db.query(query, queryParams)
          .then(point => {
            console.log("Point returned by /points/leaflit/:leafletId query is: ", point.rows[0])
            res.send(point.rows[0])
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
        });
      

      router.post("/", (req, res) => {
        let queryString = `
        INSERT INTO points (map_id, title, description, image_url, latitude, longitude, leaflet_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`;
        const queryParams = [req.body.mapId, req.body.title, req.body.description, req.body.imageURL, req.body.latitude, req.body.longitude, req.body.leafletId];
        db.query(queryString,queryParams)
          .then(pointAdded => {  
            res.send(pointAdded.rows[0]);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
        });

    router.post("/:id/edit", (req, res) => {
      let queryString = `
      UPDATE points
      SET title = $2, description = $3, image_url = $4, leaflet_id = $5
      WHERE id = $1
      RETURNING *`
      const queryParams = [req.params.id, req.body.title, req.body.description, req.body.imageURL, req.body.leafletId];
      db.query(queryString,queryParams)
        .then(pointEdited => {
          console.log("The point editted by the POST points/:id/edit is: ", pointEdited.rows[0]);
          res.send(pointEdited.rows[0]);
        })
        .catch(err => {
          console.log("YO our shit broke!!")
          res
            .status(500)
            .json({ error: err.message });
        });
    });
    
    router.post("/:id/delete", (req, res) => {
      let queryString = `
      DELETE FROM points
      WHERE id = $1
      RETURNING *`
      const queryParams = [req.params.id];
      db.query(queryString,queryParams)
        .then(pointEdited => {
          console.log("The point editted by the POST points/:id/edit is: ", pointEdited.rows[0]);
          res.send(pointEdited.rows[0]);
        })
        .catch(err => {
          console.log("YO our shit broke!!")
          res
            .status(500)
            .json({ error: err.message });
        });
    });



  return router;
}


module.exports = pointRouter;
