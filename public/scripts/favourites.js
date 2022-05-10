//favourites
const createFavElement = (data) => {
  const $fav = `<li class="show-map">
  <a><h3>${data.title}</h3></a>
  </li>`;
  return $fav;
};

const renderFav = function (favs) {
  for (const fav of favs.users) {
    console.log("FAV", fav);
    $(".favs").prepend(createFavElement(fav));
  }
};

//contirbutions

const renderContri = function (data) {
  for (const fav of data.users) {
    console.log("FAV", fav);
    $(".contri").prepend(createFavElement(fav));
  }
};

/*
1. login screen => store data as cookies or local storage

2. Home Screen / Favourites screen =>
    a. get the user data
    b. load the favourite maps of the user
    c. render the maps


3. Clicking maps points
4. Manipulating points
5. other routes => cotributions, account settings
*/

const loadFav = (id) => {
  $.ajax({
    type: "GET",
    url: `/users/${id}`,
    success: (response) => {
      // { users }
      console.log(response);
      renderFav(response);
      renderContri(response);
    },
  });
  // $.ajax({
  //   type: "GET",
  //   url: `/users/contri/${id}`,
  //   success: (response) => {
  //     // { users }
  //     console.log(response);
  //     renderContri(response);
  //   },
  // });
};

$(() => {
  // load jquery before you do this
  // get the user data using the cookies = userId = 1
  const userId = 1; // change it cookies after login impl
  // if the user is logged then load his fav's
  if (userId) {
    loadFav(userId);
  }
});
