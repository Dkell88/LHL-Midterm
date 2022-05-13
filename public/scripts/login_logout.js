$(() => {
  const menuToggle = document.querySelector(".toggle");
  menuToggle.style.display = "none";

  $("#save-map").hide();

  $("#logout").click(() => {
    const menuToggle = document.querySelector(".toggle");
    const showcase = document.querySelector(".showcase");
    const savemap = document.querySelector("#save-map");

    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
    savemap.classList.toggle("active");
    menuToggle.style.display = "none";

    $("#save-map").hide();
    $("#login").css("display", "inline");
    markerLayerGroup.clearLayers();
    getCurrentUserLocation(map);

    $(".register").css("display", "inline");

    $(".heart").css("visibility", "hidden");
    $(".map-title").css("display", "none");
  });

  $("#login").click(() => {
    $(".register").css("display", "none");
    $("#login").css("display", "none");
    $("#save-map").show();

    const menuToggle = document.querySelector(".toggle");
    const showcase = document.querySelector(".showcase");
    const savemap = document.querySelector("#save-map");

    menuToggle.style.display = "block";
    menuToggle.classList.toggle("active");
    showcase.classList.toggle("active");
    savemap.classList.toggle("active");
  });
});
