// If we aren't going to pass the DB connection to the router then we'll need to require teh db here// constdb = require()'../dbConnection'
);
const getUserById = (id) => {
  return db
    .query("SELECT * FROM users WHERE id = $1;", [id])
    .then((response) => {
      return response.rows[0];
    });
};
