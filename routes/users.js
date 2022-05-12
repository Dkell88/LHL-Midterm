const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/user-queries");

const userRouter = () => {
  
  router.get("/:id", (req, res) => {
    userQueries.getUser(1) //Change 1 to req.params.id if we use user info
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/contri/:id", (req, res) => {
    userQueries.getUserContri(1)
      .then((contributions) => {
        res.json(contributions);
      })
      .catch((err) => {
        console.log("Get users contri error: ", err.message)
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/favs/:id", (req, res) => {
    userQueries.getUserFavs(1) //Change 1 to req.params.id if we use user info
      .then((favs) => {
        res.json(favs);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/fav", (req, res) => {
    userQueries.postUserFav(1, req.cookies.mapID) //Change 1 to req.cookies.userId if we use user info
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });


  return router;
};

module.exports = userRouter;
