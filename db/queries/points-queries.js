
const db = require('../db');

const getPoints = () => {
  const query = `SELECT * FROM points`;
  return db.query(query)
    .then((points) => {
      return points.rows;
    });
  };

const getMapPoints = (id) => {
  const query = `
    SELECT points.latitude, points.longitude
    FROM points
    JOIN maps ON maps.id = map_id
    WHERE maps.id = $1`;

  let queryParams = [id];

  return db.query(query, queryParams)
    .then((point) => {
      return point.rows;
    })
};

const getPoint = (id) => {
  const query = `SELECT * FROM points WHERE id = $1`;
  const queryParams = [id];
  return db.query(query, queryParams)
    .then((point) => {
      console.log("The then return from get point: ", point.rows[0])
      return point.rows[0];
    })
};

const postPoint = (id, pointObj) => {
  const queryString = `
      INSERT INTO points (map_id, title, description, image_url, latitude, longitude, leaflet_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`;
  const queryParams = [
    id,
    pointObj.title,
    pointObj.description,
    pointObj.image_url,
    pointObj.latitude,
    pointObj.longitude,
    pointObj.leafletId,
  ];
  console.log("Post point query, query Params: ", queryParams)
  return db.query(queryString, queryParams)
    .then((pointAdded) => {
      return pointAdded.rows[0];
    })
};

const editPoint = (id, pointObj) => {
  const queryString = `
    UPDATE points
    SET title = $2, description = $3, image_url = $4, leaflet_id = $5
    WHERE id = $1
    RETURNING *`;
  const queryParams = [
    id,
    pointObj.title,
    pointObj.description,
    pointObj.image_url,
    pointObj.leafletId,
  ];
  return db.query(queryString, queryParams)
    .then((pointEdited) => {
      return pointEdited.rows[0];
    })
};

const deletePoint = (id) => {
  const queryString = `
    DELETE FROM points
    WHERE id = $1
    RETURNING *`;
  const queryParams = [id];
  return db.query(queryString, queryParams)
    .then((pointEdited) => {
      return pointEdited.rows[0];
    })
};

module.exports = { 
  getPoint,
  getPoints,
  getMapPoints,
  postPoint,
  editPoint,
  deletePoint
 }