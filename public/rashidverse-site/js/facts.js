(function ($) {
    "use strict";
    function escapeHtml(value) { return String(value || "").replace(/[&<>'"]/g, function (character) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]; }); }
    function headingHtml(value) { return escapeHtml(value || "").replace(/\[highlight\](.*?)\[\/highlight\]/g, "<span>$1</span>").replace(/\n/g, "<br>"); }
    function renderFacts(facts) {
        var section = $("[data-dynamic-facts-section]");
        if (!section.length) return;
        section.find(".section-title h2").html(headingHtml(facts.heading));
        section.find(".section-title > p").text(facts.description || "");
        section.find(".horizonral-subtitle span").text(facts.subtitle || "Numbers");
        if (facts.image) section.children(".bg.par-elem").css("background-image", "url('" + String(facts.image).replace(/["'()\\]/g, "\\$&") + "')");
        var color = /^#[0-9a-f]{6}$/i.test(String(facts.overlayColor || "")) ? facts.overlayColor : "#000000";
        var opacity = Math.max(0, Math.min(100, Number(facts.overlayOpacity == null ? 40 : facts.overlayOpacity))) / 100;
        section.children(".overlay").attr("style", "background-color:" + color + ";opacity:" + opacity);
        if (Array.isArray(facts.items) && facts.items.length) section.find(".facts-holder").html(facts.items.map(function (item) {
            return '<div class="inline-facts-wrap"><div class="inline-facts"><div class="milestone-counter"><div class="stats animaper"><div class="num" data-content="0" data-num="' + escapeHtml(item.number) + '">0</div></div></div><h6>' + escapeHtml(item.label) + '</h6></div></div>';
        }).join(""));
        if ($.fn.countTo) section.find(".num").countTo();
        if (typeof window.initparallax === "function") window.initparallax();
    }
    $(function () { fetch("/api/content/facts/").then(function (response) { return response.ok ? response.json() : []; }).then(function (items) { if (Array.isArray(items) && items.length) renderFacts(items[0]); }).catch(function () {}); });
}(jQuery));
