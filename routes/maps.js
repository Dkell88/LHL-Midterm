const express = require("express");
const router = express.Router();
const mapQueries = require("../db/queries/map-queries");
const bodyParser = require("body-parser");

const mapsRouter = () => {

  router.get("/:mapID", (req, res) => {
    mapQueries.getMap(req.params.mapID)
        .then((map) => {
          res.cookie("mapID", req.params.mapID);
          res.json(map);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
  });

  // router.get("/", (req, res) => {
  router.post("/area", (req, res) => {
    mapQueries.getMaps(req.body)
        .then((maps) => {;
          res.json(maps);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
  });


  router.post("/", (req, res) => {
    mapQueries.postMap(req.body)
      .then((map) => {
        res.cookie("mapID", map.id);
        res.json(map);
        res.status(200).end();
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = mapsRouter;
