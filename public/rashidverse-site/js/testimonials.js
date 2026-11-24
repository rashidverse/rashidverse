(function ($) {
  "use strict";
  function esc(value) { return String(value || "").replace(/[&<>'"]/g, function (character) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]; }); }
  function url(value) { value = String(value || "").trim(); return /^(https?:\/\/|\/|\.\/|\.\.\/|#|[a-z0-9][a-z0-9._\/-]*$)/i.test(value) ? value : "#"; }
  function excerpt(value, limit) { var words = String(value || "").trim().split(/\s+/).filter(Boolean); return words.length > limit ? words.slice(0, limit).join(" ") + "..." : words.join(" "); }

  $(document).on("init reInit", ".text-carousel", function () {
    $(this).find(".card-popup-rainingvis").each(function () { var rating = $(this), count = Math.max(1, Math.min(5, Number(rating.attr("data-starrating2")) || 5)); rating.empty(); for (var index = 0; index < count; index += 1) rating.append('<i class="fas fa-star" aria-hidden="true"></i>'); });
    $(this).find(".text-carousel-item").each(function () { var card = $(this); card.find(".testimonial-quote-icon").remove(); card.append('<img class="testimonial-quote-icon testimonial-quote-start" src="/rashidverse-site/images/quote-card-2.svg" alt="" aria-hidden="true">'); card.append('<img class="testimonial-quote-icon testimonial-quote-end" src="/rashidverse-site/images/quote-card-2.svg" alt="" aria-hidden="true">'); });
  });

  $(function () {
    $.when($.getJSON("/api/content/testimonials/"), $.getJSON("/api/content/testimonialsettings/")).done(function (testimonialResponse, settingsResponse) {
      var items = testimonialResponse[0] || [], settings = (settingsResponse[0] || [])[0] || {}, section = $("[data-dynamic-testimonials-section]"), slider = section.find(".text-carousel");
      if (!section.length) return;
      section.find(".section-title h3").text(settings.eyebrow || "Reviews");
      section.find(".section-title h2").text(settings.heading || "My Clients and Testimonials");
      section.find(".section-title p").text(settings.description || "");
      if (!items.length || !slider.length) return;
      if (slider.hasClass("slick-initialized")) slider.slick("unslick");
      slider.html(items.map(function (item) { var stars = Math.max(1, Math.min(5, Number(item.rating) || 5)), quote = excerpt(item.quote, 40); return '<div class="slick-item"><div class="text-carousel-item"><div class="popup-avatar"><img src="' + esc(item.avatar) + '" alt="' + esc(item.name) + '"></div><div class="listing-rating card-popup-rainingvis" data-starrating2="' + stars + '"></div><div class="review-owner fl-wrap">' + esc(item.name) + ' - <span>' + esc(item.role || "Happy Client") + '</span></div><p>“' + esc(quote) + '”</p>' + (item.sourceLabel ? '<a href="' + esc(url(item.sourceLink)) + '" class="testim-link" target="_blank" rel="noopener noreferrer">' + esc(item.sourceLabel) + '</a>' : '') + '</div></div>'; }).join(""));
      slider.slick({ infinite:true, variableWidth:true, slidesToScroll:1, dots:true, arrows:false, centerPadding:"0", centerMode:true, responsive:[{ breakpoint:768, settings:{ variableWidth:false, slidesToShow:1, centerMode:false } }] });
    }).fail(function () {});
  });
}(jQuery));
