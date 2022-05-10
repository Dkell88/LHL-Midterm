$(() => {
  const menuToggle = document.querySelector(".toggle");
  const showcase = document.querySelector(".showcase");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
  });

  const dropDown = document.querySelector(".favourites");
  dropDown.addEventListener("click", () => {
    loadFav(1);
  });
});
