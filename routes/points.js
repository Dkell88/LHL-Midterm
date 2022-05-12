const express = require("express");
const router = express.Router();
// Once teh queries are working we'll pull them out to a seperate file
//const userQueries = require('../db/points-queries')

const pointRouter = (db) => {
  //GET /points/
  router.get("/", (req, res) => {
    let query = `SELECT * FROM points`;
    db.query(query)
      .then((data) => {
        const points = data.rows;
        res.json({ points });
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/maps/:mapId", (req, res) => {
    let query = `
      SELECT points.latitude, points.longitude
      FROM points
      JOIN maps ON maps.id = map_id
      WHERE maps.id = $1`;

    let queryParams = req.params.mapId;

    db.query(query, [queryParams])
      .then((point) => {
        res.json(point.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    let query = `SELECT * FROM points WHERE id = $1`;
    let queryParams = [req.params.id];
    db.query(query, queryParams)
      .then((point) => {
        res.send(point.rows[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
        console.log("Get/point/:id error ", err.message);
      });
  });

  router.get("/leaflet/:leafletId", (req, res) => {
    let query = `SELECT * FROM points WHERE leaflet_id = $1`;
    let queryParams = [req.params.leafletId];

    db.query(query, queryParams)
      .then((point) => {
        res.send(point.rows[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    let queryString = `
        INSERT INTO points (map_id, title, description, image_url, latitude, longitude, leaflet_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;`;
    const queryParams = [
      req.cookies.mapID,
      req.body.title,
      req.body.description,
      req.body.image_url,
      req.body.latitude,
      req.body.longitude,
      req.body.leafletId,
    ];

    db.query(queryString, queryParams)
      .then((pointAdded) => {
        res.send(pointAdded.rows[0]);
      })
      .catch((err) => {
        console.log("This the error on the POST /popints/: ", err.message);
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:id/edit", (req, res) => {
    let queryString = `
      UPDATE points
      SET title = $2, description = $3, image_url = $4, leaflet_id = $5
      WHERE id = $1
      RETURNING *`;
    const queryParams = [
      req.params.id,
      req.body.title,
      req.body.description,
      req.body.image_url,
      req.body.leafletId,
    ];
    db.query(queryString, queryParams)
      .then((pointEdited) => {
        res.send(pointEdited.rows[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:id/delete", (req, res) => {
    let queryString = `
      DELETE FROM points
      WHERE id = $1
      RETURNING *`;
    const queryParams = [req.params.id];
    db.query(queryString, queryParams)
      .then((pointEdited) => {
        res.send(pointEdited.rows[0]);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = pointRouter;
