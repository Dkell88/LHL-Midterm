const createFavElement = (data) => {
  const $fav = `<li>
  <h3>${data.user.name}</h3>
  <div class="tweet">${escape(data.content.text)}</div>
  </li>`;
  return $fav;
};

const renderFav = function (tweets) {
  for (const fav of favs) {
    $("#tweet-container").prepend(createFavElement(tweet));
  }
};

const loadFav = () => {
  $.ajax({
    type: "GET",
    url: "/favs/",
    success: (response) => {
      renderFav(response);
    },
  });
};

$(() => {
  loadFav();
});
