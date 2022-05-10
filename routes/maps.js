const express = require("express");
const router = express.Router();

// maps/
const mapsRouter = (db) => {
  router.get("/:mapID", (req, res) => {
    db.query(`SELECT * FROM maps WHERE id = ${req.params.mapID};`)
      .then((data) => {
        const maps = data.rows[0];
        res.json(maps);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = mapsRouter;
