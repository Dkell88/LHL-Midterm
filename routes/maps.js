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

  router.post("/", (req, res) => {
    console.log("reqqqing", req.body);
    db.query(
      `
      INSERT INTO maps (user_id,title,city,country,created_at,latitude, longitude )
      VALUES (10,$1,'winnipeg','canada',NOW(),$2,$3);
      `,
      [req.body.title, req.body.lat, req.body.lng]
    )
      .then((data) => {
        console.log("maps router", data);
        const maps = data.rows[0];
        // res.json(maps);
        res.status(200).end();
      })
      .catch((err) => {
        console.log("catch block");
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

module.exports = mapsRouter;
