// $(() => {
//   $("#account").on("click", () => {
//     $(".popup-overlay, .popup-content").addClass("in-view");
//   });
// });

$(() => {
  const account = document.querySelector("#account");
  const popupOverlay = document.querySelector(".popup-overlay");
  const popupContent = document.querySelector(".popup-content");
  const close = document.querySelector(".close");

  account.addEventListener("click", () => {
    popupOverlay.classList.toggle("in-view");
    popupContent.classList.toggle("in-view");
    close.classList.toggle("in-view");

    if ($(popupOverlay).hasClass("in-view")) {
      $.ajax({
        type: "get",
        url: "/users/1",
        success: function (response) {
          console.log("response", response);
          $(".name").text(response.users.name);
          $(".email").text(response.users.email);
          $(".password").text(response.users.password);
        },
      });
    }
  });
  close.addEventListener("click", () => {
    popupOverlay.classList.toggle("in-view");
    popupContent.classList.toggle("in-view");
    close.classList.toggle("in-view");
  });
});
