(function ($) {
    "use strict";
    function safeUrl(value) { var url = String(value || "").trim(); return /^(https?:\/\/|\/|\.\/|\.\.\/|#|[a-z0-9][a-z0-9._\/-]*$)/i.test(url) ? url : "#"; }
    function renderVideo(video) {
        var section = $("[data-dynamic-video-section]");
        if (!section.length) return;
        if (video.image) section.find(".video-box img").attr("src", video.image);
        section.find(".video-box-btn").attr("href", safeUrl(video.videoUrl));
        section.find(".video-promo-text h3").text(video.title || "");
        section.find(".video-promo-text p").text(video.description || "");
        section.find(".video-promo-text .btn").text(video.buttonText || "My Youtube Channel").attr("href", safeUrl(video.buttonLink));
        if ($.fn.lightGallery) section.find(".video-box-btn").lightGallery({ selector: "this", download: false, counter: false });
    }
    $(function () { fetch("/api/content/video/").then(function (response) { return response.ok ? response.json() : []; }).then(function (items) { if (Array.isArray(items) && items.length) renderVideo(items[0]); }).catch(function () {}); });
}(jQuery));
