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

  // Certificate lightbox: click to open, wheel/touch to zoom, drag to pan
  var $modal = $('#certModal');
  var $modalImg = $('#certModalImg');
  var scale = 1, minScale = 1, maxScale = 5;
  var posX = 0, posY = 0;
  var isPanning = false, startX = 0, startY = 0;
  var initPinchDist = 0, initScale = 1;

  function applyTransform() {
    $modalImg.css('transform', 'translate(' + posX + 'px, ' + posY + 'px) scale(' + scale + ')');
  }

  function resetTransform() {
    scale = 1; posX = 0; posY = 0; applyTransform();
  }

  $('.cert-clickable').on('click', function() {
    var src = $(this).attr('src') || $(this).data('src');
    var alt = $(this).attr('alt') || '';
    $modalImg.attr('src', src).attr('alt', alt);
    resetTransform();
    $modal.modal('show');
  });

  // mouse wheel zoom
  $modalImg.on('wheel', function(e) {
    e.preventDefault();
    var delta = e.originalEvent.deltaY;
    if (delta > 0) { // zoom out
      scale = Math.max(minScale, scale * 0.92);
    } else { // zoom in
      scale = Math.min(maxScale, scale * 1.08);
    }
    applyTransform();
  });

  // mouse drag to pan
  $modalImg.on('mousedown', function(e) {
    e.preventDefault();
    isPanning = true;
    startX = e.clientX - posX;
    startY = e.clientY - posY;
    $modalImg.css('cursor', 'grabbing');
  });
  $(window).on('mousemove', function(e) {
    if (!isPanning) return;
    posX = e.clientX - startX;
    posY = e.clientY - startY;
    applyTransform();
  });
  $(window).on('mouseup', function() {
    if (!isPanning) return;
    isPanning = false;
    $modalImg.css('cursor', 'grab');
  });

  // touch: pan and pinch-to-zoom
  $modalImg.on('touchstart', function(e) {
    if (e.originalEvent.touches.length === 1) {
      var t = e.originalEvent.touches[0];
      isPanning = true;
      startX = t.clientX - posX;
      startY = t.clientY - posY;
    } else if (e.originalEvent.touches.length === 2) {
      isPanning = false;
      var t1 = e.originalEvent.touches[0];
      var t2 = e.originalEvent.touches[1];
      initPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      initScale = scale;
    }
  });
  $modalImg.on('touchmove', function(e) {
    e.preventDefault();
    if (e.originalEvent.touches.length === 1 && isPanning) {
      var t = e.originalEvent.touches[0];
      posX = t.clientX - startX;
      posY = t.clientY - startY;
      applyTransform();
    } else if (e.originalEvent.touches.length === 2) {
      var t1 = e.originalEvent.touches[0];
      var t2 = e.originalEvent.touches[1];
      var curDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      var factor = curDist / initPinchDist;
      scale = Math.min(maxScale, Math.max(minScale, initScale * factor));
      applyTransform();
    }
  });
  $modalImg.on('touchend touchcancel', function(e) {
    if (e.originalEvent.touches.length === 0) {
      isPanning = false;
    }
  });

  // double click to reset
  $modalImg.on('dblclick', function() { resetTransform(); });

  // zoom controls
  $('#zoomInBtn').on('click', function(){ scale = Math.min(maxScale, scale * 1.2); applyTransform(); });
  $('#zoomOutBtn').on('click', function(){ scale = Math.max(minScale, scale * 0.8); applyTransform(); });
  $('#zoomResetBtn').on('click', function(){ resetTransform(); });

  // clear transform when modal hidden
  $modal.on('hidden.bs.modal', function() {
    resetTransform();
    $modalImg.attr('src', '');
  });

  // Typewriter loop for About section: types and erases phrases
  (function aboutTypewriter(){
    var $el = $('#typewriter');
    if (!$el.length) return; // nothing to do
    var phrases = ['Dhananjaya', 'Full Stack Developer'];
    var typeSpeed = 90; // ms per char
    var eraseSpeed = 45;
    var delayAfter = 1200; // pause after full phrase
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function tick() {
      var current = phrases[phraseIndex];
      if (!isDeleting) {
        charIndex++;
        $el.text(current.substring(0, charIndex));
        if (charIndex === current.length) {
          // finished typing
          isDeleting = true;
          setTimeout(tick, delayAfter);
        } else {
          setTimeout(tick, typeSpeed);
        }
      } else {
        // deleting
        charIndex--;
        $el.text(current.substring(0, charIndex));
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 300);
        } else {
          setTimeout(tick, eraseSpeed);
        }
      }
    }

    // small initial delay so page settles
    setTimeout(tick, 500);
  })();
});
// End of file: removed unused hero-parallax handler (no .hero-scene in markup)