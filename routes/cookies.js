const express = require("express");
const router = express.Router();

const cookieRouter = () => {
  router.post("/", (req, res) => {
    //CHange hard coded user id later
    console.log("req", req);
    const userID = 1;
    users[userID] = {
      id: userID,
      // email,
      // password: hashedPassword,
    };
    req.session.userID = users[userID].id;
  });
  return router;
};
module.exports = cookieRouter;
