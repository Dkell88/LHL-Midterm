const toggleList = (class1, class2) => {
  const classOne = document.querySelector(class1);
  const nextSibling = document.querySelector(class2).nextElementSibling;
  classOne.addEventListener("click", () => {
    if (!nextSibling.classList.contains("closed")) {
      nextSibling.classList.add("closed");
    }
    const list = document.querySelector(`${class1} + .list`);
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

  const map = document.querySelector("#map");
  map.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    showcase.classList.remove("active");
    savemap.classList.remove("active");
  });

  toggleList(".favourites", ".contributions");
  toggleList(".contributions", ".favourites");
});
