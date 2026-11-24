(function () {
  "use strict";

  var holder = document.getElementById("dynamic-experience-list");
  if (!holder) return;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function highlightedHtml(value) {
    return escapeHtml(value).replace(/\[highlight\]([\s\S]*?)\[\/highlight\]/gi, "<span>$1</span>");
  }

  function safeUrl(value) {
    var url = String(value || "").trim();
    return /^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(url) ? url : "#";
  }

  function getActiveProfile() {
    var profile = String(window.__RASHIDVERSE_ACTIVE_SECTOR__ || "wordpress").toLowerCase();
    return /^(wordpress|motion|multimedia)$/.test(profile) ? profile : "wordpress";
  }

  function getResume(settings, globalSettings) {
    if (!settings || settings.buttonSource === "custom") return null;
    var profile = settings.resumeProfile || "active";
    if (profile === "active") profile = getActiveProfile();
    var resumes = globalSettings && Array.isArray(globalSettings.resumes) ? globalSettings.resumes : [];
    for (var index = 0; index < resumes.length; index += 1) {
      if (resumes[index] && resumes[index].profile === profile && resumes[index].url) return resumes[index];
    }
    return null;
  }

  function applySectionSettings(settings, globalSettings) {
    if (!settings) return;
    var label = document.querySelector("[data-dynamic-experience-label]");
    var eyebrow = document.querySelector("[data-dynamic-experience-eyebrow]");
    var heading = document.querySelector("[data-dynamic-experience-heading]");
    var description = document.querySelector("[data-dynamic-experience-description]");
    var button = document.querySelector("[data-dynamic-experience-button]");
    if (label && settings.sectionLabel) label.innerHTML = escapeHtml(settings.sectionLabel) + " <span>//</span>";
    if (eyebrow && settings.eyebrow) eyebrow.textContent = settings.eyebrow;
    if (heading && settings.heading) heading.innerHTML = highlightedHtml(settings.heading).replace(/\n/g, "<br>");
    if (description && settings.description) description.textContent = settings.description;
    if (button) {
      var resume = getResume(settings, globalSettings);
      if (settings.buttonText) button.textContent = settings.buttonText;
      else if (resume && resume.label) button.textContent = resume.label;
      if (resume) button.href = safeUrl(resume.url);
      else if (settings.buttonLink) button.href = safeUrl(settings.buttonLink);
      if ((resume && resume.target === "new") || (!resume && settings.buttonTarget === "new")) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
      else { button.removeAttribute("target"); button.removeAttribute("rel"); }
    }
  }

  function detailCard(item) {
    var highlights = Array.isArray(item.highlights) ? item.highlights : [];
    var list = highlights.length ? "<ul>" + highlights.map(function (highlight) { return "<li>" + escapeHtml(highlight) + "</li>"; }).join("") + "</ul>" : "";
    var buttonText = String(item.buttonText || "View Work +");
    var buttonLink = safeUrl(item.buttonLink || "#sec5");
    var target = item.buttonTarget === "new" ? ' target="_blank" rel="noopener noreferrer"' : "";
    var button = buttonText ? '<a href="' + escapeHtml(buttonLink) + '"' + target + ' class="cus-inner-head-link color-bg">' + escapeHtml(buttonText) + "</a>" : "";
    return '<div class="custom-inner-content fl-wrap"><h4>' + escapeHtml(item.role) + "</h4><p>" + escapeHtml(item.summary) + "</p>" + list + button + "</div>";
  }

  function jobCard(item, number) {
    return '<div class="custom-inner-header workres"><i class="fa fa-briefcase"></i><h3>' + escapeHtml(item.company) + "</h3><span>" + escapeHtml(item.period) + '</span></div><div class="ci-num"><span>' + String(number).padStart(2, "0") + ". -</span></div>";
  }

  function imageCard(item, movement) {
    if (!item.image) return "";
    // Keep the template's original columns and image size. The image gets a
    // lightweight, viewport-centred parallax below instead of reinitializing
    // Scrollax (which can stack multiple transforms on the template).
    var direction = String(movement).charAt(0) === "-" ? "-1" : "1";
    var image = '<img src="' + escapeHtml(item.image) + '" class="respimg rv-experience-parallax-image" data-rv-experience-parallax data-parallax-direction="' + direction + '" alt="' + escapeHtml(item.company) + '">';
    if (!item.imageLink) return image;
    var target = item.imageLinkTarget === "new" ? ' target="_blank" rel="noopener noreferrer"' : "";
    return '<a class="rv-experience-image-link" href="' + escapeHtml(safeUrl(item.imageLink)) + '"' + target + '>' + image + "</a>";
  }

  function renderItem(item, index) {
    var job = '<div class="col-md-4">' + jobCard(item, index + 1) + "</div>";
    var detail = '<div class="col-md-4">' + detailCard(item) + "</div>";
    var movement = index % 2 ? "270px" : "-170px";
    var image = '<div class="col-md-4">' + imageCard(item, movement) + "</div>";
    var layout = item.layout;
    if (layout === "reverse") {
      return '<div class="custom-inner"><div class="row">' + detail + image + job + "</div></div>";
    }
    if (layout === "image-right") {
      detail = '<div class="col-md-5">' + detailCard(item) + "</div>";
      image = '<div class="col-md-3">' + imageCard(item, movement) + "</div>";
      return '<div class="custom-inner"><div class="row">' + job + detail + image + "</div></div>";
    }
    if (layout === "no-image" || !item.image) {
      detail = '<div class="col-md-8">' + detailCard(item) + "</div>";
      return '<div class="custom-inner"><div class="row">' + job + detail + "</div></div>";
    }
    return '<div class="custom-inner"><div class="row">' + job + image + detail + "</div></div>";
  }

  function setupExperienceParallax() {
    var images = Array.prototype.slice.call(holder.querySelectorAll("[data-rv-experience-parallax]"));
    if (!images.length) return;
    var ticking = false;

    function update() {
      ticking = false;
      var isMobile = window.matchMedia("(max-width: 1064px)").matches;
      var viewportCenter = window.innerHeight / 2;

      images.forEach(function (image) {
        if (isMobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          image.style.transform = "";
          image.dataset.rvParallaxY = "0";
          return;
        }

        var previousOffset = Number(image.dataset.rvParallaxY || 0);
        var rect = image.getBoundingClientRect();
        // rect includes the previous transform. Remove it before measuring so
        // the calculation remains stable while the image moves.
        var unshiftedCenter = rect.top + rect.height / 2 - previousOffset;
        var progress = Math.max(-1, Math.min(1, (unshiftedCenter - viewportCenter) / (window.innerHeight * 0.7)));
        var direction = Number(image.getAttribute("data-parallax-direction") || 1);
        var offset = Math.round(progress * direction * 58);

        // The offset becomes 0 exactly at screen centre: at that point the
        // image returns to the template's original position beside both cards.
        image.dataset.rvParallaxY = String(offset);
        image.style.transform = "translate3d(0, " + offset + "px, 0)";
      });
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    images.forEach(function (image) {
      if (!image.complete) image.addEventListener("load", requestUpdate, { once: true });
    });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
  }

  Promise.all([
    fetch("/api/content/experience/").then(function (response) { if (!response.ok) throw new Error("Could not load experience"); return response.json(); }),
    fetch("/api/content/experiencesettings/").then(function (response) { return response.ok ? response.json() : []; }),
    fetch("/api/content/globalsettings/").then(function (response) { return response.ok ? response.json() : []; }),
  ])
    .then(function (result) {
      var items = result[0];
      var settings = result[1];
      var globalSettings = result[2];
      if (Array.isArray(settings) && settings.length) applySectionSettings(settings[0], Array.isArray(globalSettings) ? globalSettings[0] : null);
      if (!Array.isArray(items) || !items.length) return;
      holder.innerHTML = items.map(renderItem).join("");
      setupExperienceParallax();
    })
    .catch(function () {
      // Original template entries remain visible until an experience is added.
    });
}());
