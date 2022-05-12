const express = require("express");
const router = express.Router();
// Once teh queries are working we'll pull them out to a seperate file
const pointQueries = require('../db/queries/points-queries')

const pointRouter = () => {
  //GET /points/
  router.get("/", (req, res) => {
    pointQueries.getPoints()
      .then((points) => {
        res.json(points);
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/maps/:mapId", (req, res) => { 
    pointQueries.getMapPoints(req.params.mapId)
      .then((points) => {
        res.json(points);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    pointQueries.getPoint(req.params.id)
      .then((point) => {
        res.send(point);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
        console.log("Get/point/:id error ", err.message);
      });
  });


  router.post("/", (req, res) => {
    pointQueries.postPoint(req.cookies.mapID, req.body)
      .then((pointAdded) => {
        res.send(pointAdded);
      })
      .catch((err) => {
        console.log("This the error on the POST /point/: ", err.message);
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:id/edit", (req, res) => {
    pointQueries.editPoint(req.params.id, req.body)
      .then((pointEdited) => {
        res.send(pointEdited);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:id/delete", (req, res) => {
    pointQueries.deletePoint(req.params.id)
      .then((pointDeleted) => {
        res.send(pointDeleted);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = pointRouter;
