
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect(() => {
  console.log("db is connected");
});

module.exports = db;