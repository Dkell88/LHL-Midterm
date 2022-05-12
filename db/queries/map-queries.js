const db = require('../db');

const getMap = (id) => {
  const query = `
  SELECT * 
  FROM maps 
  WHERE id = $1`;
  let queryParams = [id];

  return db.query(query, queryParams) 
    .then((map) => {
      return map.rows[0];
    })
}

const postMap = (map) => {
  const query =  `
  INSERT INTO maps (user_id,title,city,country,created_at,latitude, longitude )
  VALUES (1,$1,'winnipeg','canada',NOW(),$2,$3) RETURNING *;
  `;
  let queryParams = [map.title, map.lat, map.lng];
  return db.query(query, queryParams) 
    .then((map) => {
      return map.rows[0];
    })
}

module.exports = { 
  getMap,
  postMap
};
