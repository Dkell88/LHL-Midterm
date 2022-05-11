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

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
  });

  toggleList(".favourites");
  toggleList(".contributions");
});
