(function ($) {
  "use strict";
  function esc(value) { return String(value || "").replace(/[&<>'"]/g, function (character) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]; }); }
  function url(value) { value = String(value || "").trim(); return /^(https?:\/\/|\/|\.\/|\.\.\/|#|[a-z0-9][a-z0-9._\/-]*$)/i.test(value) ? value : "#"; }
  $(function () { $.getJSON("/api/content/clientlogos/").done(function (items) { var list = $("[data-dynamic-client-logos]"); if (!list.length || !items || !items.length) return; list.html(items.filter(function (item) { return item.image; }).map(function (item) { var target = item.linkTarget === "same" ? "" : ' target="_blank" rel="noopener noreferrer"'; return '<li><a href="' + esc(url(item.link)) + '"' + target + '><img src="' + esc(item.image) + '" alt="' + esc(item.name || "Client logo") + '"></a></li>'; }).join("")); }); });
}(jQuery));
