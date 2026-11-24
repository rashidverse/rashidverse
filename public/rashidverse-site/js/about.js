(function ($) {
    "use strict";

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>'"]/g, function (character) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
        });
    }

    function safeUrl(value) {
        var url = String(value || "").trim();
        return /^(https?:\/\/|\/|\.\/|\.\.\/|#|[a-z0-9][a-z0-9._\/-]*$)/i.test(url) ? url : "#";
    }

    function renderAbout(about) {
        var section = $("[data-dynamic-about-section]");
        if (!section.length) return;
        var features = Array.isArray(about.features) ? about.features : [];
        section.find(".section-subtitle").html('<span>//</span>' + escapeHtml(about.sectionLabel || "Words About"));
        section.find(".collage-image-title").text(about.imageLabel || "Rashidverse.");
        if (about.image) section.find(".collage-image img").attr("src", about.image);
        section.find(".main-about h5").text(about.eyebrow || "");
        section.find(".main-about h2").html(escapeHtml(about.heading || "").replace(/\[highlight\](.*?)\[\/highlight\]/g, "<span>$1</span>").replace(/\n/g, "<br>"));
        section.find(".main-about > p").text(about.description || "");
        section.find(".main-about .btn").text(about.buttonText || "My Portfolio").attr("href", safeUrl(about.buttonLink));
        if (features.length) {
            section.find(".features-box-container .row").html(features.map(function (feature, index) {
                var icons = ["fa-desktop", "fa-mobile-alt", "fa-pagelines", "fa-shopping-bag"];
                var icon = /^fa-[a-z0-9-]+$/i.test(String(feature.icon || "")) ? feature.icon : icons[index % icons.length];
                var customIcon = /^\/uploads\/.+\.svg$/i.test(String(feature.customIcon || "")) ? '<span class="custom-service-icon-wrap"><img class="custom-service-icon" src="' + escapeHtml(feature.customIcon) + '" alt=""></span>' : /^[a-z0-9-]+:[a-z0-9-]+$/i.test(String(feature.iconifyIcon || "")) ? '<span class="custom-service-icon-wrap"><img class="custom-service-icon" src="https://api.iconify.design/' + escapeHtml(feature.iconifyIcon).replace(":", "/") + '.svg" alt=""></span>' : '<i class="fal ' + icon + '"></i>';
                return '<div class="features-box col-md-6"><div class="time-line-icon">' + customIcon + '</div><h3>' + escapeHtml(feature.title || "Service") + '</h3><p>' + escapeHtml(feature.description || "") + '</p></div>';
            }).join(""));
        }
        if (typeof window.initparallax === "function") window.initparallax();
    }

    $(function () {
        fetch("/api/content/about/")
            .then(function (response) { return response.ok ? response.json() : []; })
            .then(function (items) { if (Array.isArray(items) && items.length) renderAbout(items[0]); })
            .catch(function () { /* Keep template content when no local About record exists. */ });
    });
}(jQuery));
