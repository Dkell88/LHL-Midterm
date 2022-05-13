const db = require('../db');

const getUser = (id) => {
  const query = `
  SELECT *
  FROM users
  WHERE users.id = $1`;
  let queryParams = [id];

  return db.query(query, queryParams) 
    .then((user) => {
      return user.rows[0];
    })
}

const getUserContri = (id) => {
  const query = `
  SELECT maps.*
  FROM maps
  WHERE user_id = $1;`;
  let queryParams = [id];

  return db.query(query, queryParams) 
    .then((contributions) => {
      return contributions.rows;
    })
};

const getUserFavs = (id) => {
  const query = `
  SELECT users.name,
  favourites.map_id as id,
  favourites.user_id,
  maps.title
  FROM users
  JOIN favourites ON users.id = favourites.user_id
  JOIN maps ON maps.id = favourites.map_id
  WHERE favourites.user_id = $1;`;
  let queryParams = [id]; 

  return db.query(query, queryParams) 
    .then((favourites) => {
      return favourites.rows;
    });
};
 
const postUserFav = (id, fav) => {
  const query = `
  INSERT INTO favourites (user_id,map_id )
  VALUES ($1,$2)`;
  let queryParams = [id, fav]; 

  return db.query(query, queryParams); 

};

const deleteUserFav = (user, map) => {
  const queryString = `
    DELETE FROM favourites
    WHERE user_id = $1 AND map_id = $2`;
  const queryParams = [user, map];
  return db.query(queryString, queryParams)
};

module.exports = { 
  getUser,
  getUserContri,
  getUserFavs,
  postUserFav,
  deleteUserFav
};
