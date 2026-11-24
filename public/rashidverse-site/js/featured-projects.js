(function ($) {
  "use strict";
  function esc(value) { return String(value || "").replace(/[&<>'"]/g, function (character) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]; }); }
  function safeUrl(value) { value = String(value || "").trim(); return /^(https?:\/\/|\/|\.\/|\.\.\/|#|[a-z0-9][a-z0-9._\/-]*$)/i.test(value) ? value : "#"; }
  function openPreview(image, title) {
    $(".rv-project-viewer").remove();
    var viewer = $('<div class="rv-project-viewer" role="dialog" aria-modal="true" aria-label="' + esc(title) + ' preview"><button type="button" class="rv-project-viewer-close" aria-label="Close preview">×</button><div class="rv-project-viewer-panel"><div class="rv-project-viewer-toolbar"><strong>' + esc(title) + '</strong><button type="button" class="rv-project-scroll-arrow" aria-label="Scroll to bottom">↓</button></div><div class="rv-project-viewer-scroll"><img src="' + esc(image) + '" alt="' + esc(title) + '"></div></div></div>');
    $("body").append(viewer).addClass("rv-viewer-open");
    var scrollArea = viewer.find(".rv-project-viewer-scroll")[0], animationFrame;
    function autoScroll() { var maximum = Math.max(0, scrollArea.scrollHeight - scrollArea.clientHeight), start = performance.now(), duration = 9000; function tick(now) { var progress = Math.min(1, (now - start) / duration); scrollArea.scrollTop = maximum * progress; if (progress < 1) animationFrame = requestAnimationFrame(tick); } cancelAnimationFrame(animationFrame); animationFrame = requestAnimationFrame(tick); }
    viewer.find("img").on("load", autoScroll); if (scrollArea.querySelector("img").complete) autoScroll();
    viewer.on("click", ".rv-project-viewer-close", function () { cancelAnimationFrame(animationFrame); viewer.remove(); $("body").removeClass("rv-viewer-open"); });
    viewer.on("click", ".rv-project-scroll-arrow", function () { cancelAnimationFrame(animationFrame); $(scrollArea).stop().animate({ scrollTop: scrollArea.scrollHeight }, 700); });
    viewer.on("click", function (event) { if (event.target === viewer[0]) viewer.find(".rv-project-viewer-close").trigger("click"); });
  }
  $(function () {
    $.when($.getJSON("/api/content/portfolio/"), $.getJSON("/api/content/featured/"))
      .done(function (projectResponse, settingsResponse) {
        var projects = projectResponse[0] || [], settings = (settingsResponse[0] || [])[0] || {};
        var featured = projects.filter(function (project) { return project && project.published !== false && project.featured === true && project.title && project.thumb; }).sort(function (first, second) { return (Number(first.featuredOrder) || 0) - (Number(second.featuredOrder) || 0) || (Number(first.order) || 0) - (Number(second.order) || 0); });
        var section = $("[data-dynamic-featured-section]"), slider = section.find(".fet_pr-carousel");
        if (!section.length) return;
        section.find(".fet_pr-carousel-title-item h3").text(settings.heading || "My Featured Projects");
        section.find(".fet_pr-carousel-title-item p").text(settings.description || "In ut odio libero, at vulputate urna. Nulla tristique mi a massa convallis cursus. Nulla eu mi magna. Etiam suscipit commodo gravida.");
        section.find(".fet_pr-carousel-title-item .btn").text(settings.buttonText || "My Portfolio").attr("href", safeUrl(settings.buttonLink || "portfolio.html"));
        if (!featured.length || !slider.length) return;
        if (slider.hasClass("slick-initialized")) slider.slick("unslick");
        slider.html(featured.map(function (project) { var thumbnail = safeUrl(project.thumb), preview = safeUrl(project.hoverImg || project.thumb), projectUrl = safeUrl(project.link), category = project.subcategory || project.mainCategory || project.category || "Project"; return '<div class="slick-item"><div class="fet_pr-carousel-box" data-project-url="' + esc(projectUrl) + '"><div class="fet_pr-carousel-box-media fl-wrap"><img src="' + esc(thumbnail) + '" class="respimg" alt="' + esc(project.title) + '"><button type="button" class="fet_pr-carousel-box-media-zoom rv-project-preview-open" data-preview="' + esc(preview) + '" data-title="' + esc(project.title) + '" aria-label="Preview ' + esc(project.title) + '"><i class="fal fa-search"></i></button></div><div class="fet_pr-carousel-box-text fl-wrap"><h3><a href="' + esc(projectUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(project.title) + '</a></h3><div class="fet_pr-carousel-cat"><span>' + esc(category) + '</span></div></div></div></div>'; }).join(""));
        slider.slick({ infinite: true, slidesToShow: 4, slidesToScroll: 1, dots: true, arrows: false, centerMode: true, responsive: [{ breakpoint: 1224, settings: { slidesToShow: 3 } }, { breakpoint: 768, settings: { slidesToShow: 1, centerMode: false } }] });
        section.find(".rv-featured-nav").remove();
        section.append('<div class="rv-featured-nav"><button type="button" data-featured-prev aria-label="Previous project">←</button><button type="button" data-featured-next aria-label="Next project">→</button></div>');
        section.off("click.rvFeatured").on("click.rvFeatured", "[data-featured-prev]", function () { slider.slick("slickPrev"); }).on("click.rvFeatured", "[data-featured-next]", function () { slider.slick("slickNext"); }).on("click.rvFeatured", ".rv-project-preview-open", function (event) { event.preventDefault(); event.stopPropagation(); openPreview($(this).data("preview"), $(this).data("title")); }).on("click.rvFeatured", ".fet_pr-carousel-box", function (event) { if ($(event.target).closest(".rv-project-preview-open, a").length) return; var projectUrl = $(this).data("project-url"); if (projectUrl && projectUrl !== "#") window.open(projectUrl, "_blank", "noopener"); });
      }).fail(function () {});
  });
}(jQuery));
