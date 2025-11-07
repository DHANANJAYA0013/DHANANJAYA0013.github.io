$(document).ready(function() {
  // Smooth scroll for nav links and get-in-touch button
  $('.navbar-nav .nav-link, .get-in-touch-btn').on('click', function(e) {
    var target = $(this).attr('href');
    if (target && target.charAt(0) === '#') {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(target).offset().top - $('.navbar').outerHeight()
      }, 600);
      $('.navbar-collapse').collapse('hide');
    }
  });
});