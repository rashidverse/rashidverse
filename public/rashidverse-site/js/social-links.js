(function ($) {
  "use strict";

  var iconByPlatform = {
    facebook: "fab fa-facebook-f",
    instagram: "fab fa-instagram",
    linkedin: "fab fa-linkedin-in",
    youtube: "fab fa-youtube",
    twitter: "fab fa-twitter",
    github: "fab fa-github",
    behance: "fab fa-behance",
    dribbble: "fab fa-dribbble",
    tiktok: "fab fa-tiktok"
  };

  // Upwork is not included in the local Font Awesome files, so keep its
  // official Simple Icons SVG path inline. This makes the actual Upwork mark
  // available everywhere this shared social-links script renders a link.
  var upworkIcon = '<svg class="rv-upwork-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/></svg>';

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function safeUrl(value) {
    var url = String(value || "").trim();
    return /^(https?:\/\/|\/|#)/i.test(url) ? url : "#";
  }

  function activeLinks(settings) {
    return Array.isArray(settings && settings.socialLinks) ? settings.socialLinks
      .filter(function (social) { return social && social.visible !== false && social.url; })
      .sort(function (first, second) { return Number(first.order || 0) - Number(second.order || 0); }) : [];
  }

  function renderSocialLinks(settings) {
    var links = activeLinks(settings);
    $("[data-global-social-links]").each(function () {
      var list = $(this);
      list.html(links.map(function (social) {
        var platform = String(social.platform || "custom").toLowerCase();
        var icon = iconByPlatform[platform] || "fal fa-link";
        var label = social.label || platform;
        var iconMarkup = platform === "upwork" ? upworkIcon : '<i class="' + icon + '"></i>';
        return '<li><a href="' + escapeHtml(safeUrl(social.url)) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(label) + '">' + iconMarkup + '</a></li>';
      }).join(""));
      list.closest(".header-social, .footer-socilal").toggle(links.length > 0);
    });
  }

  window.RashidverseSocialLinks = { render: renderSocialLinks };

  $(function () {
    $.getJSON("/api/content/globalsettings/").done(function (items) {
      renderSocialLinks((items || [])[0]);
    });
  });
}(jQuery));
