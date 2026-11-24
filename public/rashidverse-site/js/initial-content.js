(function (window, document) {
  "use strict";

  var snapshot = window.__RASHIDVERSE_INITIAL_CONTENT__;
  if (!snapshot || typeof snapshot !== "object") {
    document.documentElement.classList.remove("rv-dynamic-pending");
    return;
  }

  function contentType(input) {
    var value = typeof input === "string" ? input : input && input.url;
    if (!value) return null;
    var pathname;
    try { pathname = new URL(value, window.location.href).pathname; } catch (error) { return null; }
    var match = pathname.match(/^\/api\/content\/([^/]+)\/?$/);
    return match && Object.prototype.hasOwnProperty.call(snapshot, match[1]) ? match[1] : null;
  }

  // Dynamic section scripts keep their existing rendering functions. Their
  // content request is now fulfilled from the server-rendered initial state,
  // without a second network trip or template-content flash.
  if (typeof window.fetch === "function") {
    var nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var type = contentType(input);
      if (!type) return nativeFetch(input, init);
      return Promise.resolve(new Response(JSON.stringify(snapshot[type]), {
        status: 200,
        headers: { "content-type": "application/json" },
      }));
    };
  }

  if (window.jQuery) {
    var $ = window.jQuery;
    var nativeGetJSON = $.getJSON;
    $.getJSON = function (url) {
      var type = contentType(url);
      if (!type) return nativeGetJSON.apply(this, arguments);
      var deferred = $.Deferred();
      var xhr = { status: 200, statusText: "success", responseJSON: snapshot[type] };
      deferred.resolve(snapshot[type], "success", xhr);
      return deferred.promise();
    };
  }

  function reveal() {
    var profile = window.__RASHIDVERSE_SECTOR_PROFILE__ || {};
    if (profile.hideFacts) document.querySelectorAll('[data-dynamic-facts-section]').forEach(function (section) { section.remove(); });
    if (profile.hideVideo) document.querySelectorAll('[data-dynamic-video-section]').forEach(function (section) { section.remove(); });
    function insertExpertise(items, targetSelector, className, label) {
      var target = document.querySelector(targetSelector);
      if (!target || !Array.isArray(items) || !items.length) return;
      var section = document.createElement('section');
      section.className = className;
      section.setAttribute('aria-label', label);
      var grid = document.createElement('div');
      grid.className = 'container rv-expertise-grid';
      items.forEach(function (item, index) {
        var card = document.createElement('article');
        var category = document.createElement('p');
        category.className = 'rv-expertise-category';
        category.textContent = String(index + 1).padStart(2, '0') + ' / ' + item.category;
        var title = document.createElement('h3');
        title.textContent = item.title;
        var description = document.createElement('p');
        description.textContent = item.description;
        card.append(category, title, description);
        grid.appendChild(card);
      });
      section.appendChild(grid);
      target.before(section);
    }
    insertExpertise(profile.expertiseJourney, '#dynamic-experience-list', 'rv-expertise-journey', 'My expertise journey');
    // Fetch promises queued by the section scripts run before this timer. Two
    // frames ensure the dynamic markup is painted before the document appears.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        document.documentElement.classList.remove("rv-dynamic-pending");
        window.dispatchEvent(new CustomEvent("rashidverse:initial-content-ready"));
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { window.setTimeout(reveal, 0); }, { once: true });
  else window.setTimeout(reveal, 0);
}(window, document));
