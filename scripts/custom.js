(function ($) {
  "use strict";

  // AOS ANIMATIONS
  AOS.init();

  // NAVBAR
  $(".navbar-nav .nav-link").click(function () {
    $(".navbar-collapse").collapse("hide");
  });

  // travel IMAGE RESIZE
  function travelImageResize() {
    $(".navbar").scrollspy({ offset: -76 });

    var LargeImage = $(".large-travel-image").height();

    var MinusHeight = LargeImage - 6;

    $(".travel-two-column").css({
      height: MinusHeight - LargeImage / 2 + "px",
    });
  }

  $(window).on("resize", travelImageResize);
  $(document).on("ready", travelImageResize);

  $('a[href*="#"]').click(function (event) {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        event.preventDefault();
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 66,
          },
          1000
        );
      }
    }
  });
})(window.jQuery);
