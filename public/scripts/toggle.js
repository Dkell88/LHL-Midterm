const toggleList = (className) => {
  const mapList = document.querySelector(className);
  mapList.addEventListener("click", () => {
    const list = document.querySelector(`${className} + .list`);
    list.classList.toggle("closed");
  });
};
$(() => {
  const menuToggle = document.querySelector(".toggle");
  const showcase = document.querySelector(".showcase");
  const savemap = document.querySelector("#save-map");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
    savemap.classList.toggle("active");
  });

  toggleList(".favourites");
  toggleList(".contributions");
});
