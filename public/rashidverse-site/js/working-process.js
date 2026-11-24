(function ($) {
    "use strict";
    function escapeHtml(value) { return String(value || "").replace(/[&<>'"]/g, function (character) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]; }); }
    function safeUrl(value) { var url = String(value || "").trim(); return /^(https?:\/\/|\/|\.\/|\.\.\/|#|[a-z0-9][a-z0-9._\/-]*$)/i.test(url) ? url : "#"; }
    function headingHtml(value) { return escapeHtml(value || "").replace(/\[highlight\](.*?)\[\/highlight\]/g, "<span>$1</span>").replace(/\n/g, "<br>"); }
    function iconHtml(step) {
        var customIcon = String(step.customIcon || "");
        var iconifyIcon = String(step.iconifyIcon || "");
        if (/^\/uploads\/.+\.svg$/i.test(customIcon)) return '<span class="custom-service-icon-wrap"><img class="custom-service-icon" src="' + escapeHtml(customIcon) + '" alt=""></span>';
        if (/^[a-z0-9-]+:[a-z0-9-]+$/i.test(iconifyIcon)) return '<span class="custom-service-icon-wrap"><img class="custom-service-icon" src="https://api.iconify.design/' + escapeHtml(iconifyIcon.replace(":", "/")) + '.svg" alt=""></span>';
        var icon = /^fa-[a-z0-9-]+$/i.test(String(step.icon || "")) ? step.icon : "fa-lightbulb";
        return '<i class="' + (icon === "fa-slideshare" ? "fab" : "fal") + ' ' + icon + '"></i>';
    }
    function renderProcess(process) {
        var section = $("[data-dynamic-process-section]");
        if (!section.length) return;
        section.find(".section-subtitle").html('<span>//</span>' + escapeHtml(process.sectionLabel || "How I Work"));
        section.find(".section-title h3").text(process.eyebrow || "");
        section.find(".section-title h2").html(headingHtml(process.heading));
        section.find(".section-title > p").text(process.description || "");
        if (Array.isArray(process.steps) && process.steps.length) section.find(".process-wrap ul").addClass("dynamic-process-list").html(process.steps.map(function (step, index) {
            var morePoints = Array.isArray(step.morePoints) ? step.morePoints.filter(Boolean) : [];
            var target = step.linkTarget === "new" ? ' target="_blank" rel="noopener noreferrer"' : "";
            var moreContent = morePoints.length ? '<button type="button" class="process-more-toggle" aria-expanded="false">' + escapeHtml(step.linkText || "More Details") + '<i class="fal fa-angle-down"></i></button><ul class="process-more-points" hidden>' + morePoints.map(function (point) { return '<li>' + escapeHtml(point) + '</li>'; }).join("") + '</ul>' : '<a href="' + escapeHtml(safeUrl(step.link)) + '"' + target + '>' + escapeHtml(step.linkText || "More Details") + '</a>';
            return '<li><div class="time-line-icon">' + iconHtml(step) + '</div><h4>' + escapeHtml(step.title || "Step") + '</h4><div class="process-details"><h6>' + escapeHtml(step.subtitle || "") + '</h6><p>' + escapeHtml(step.description || "") + '</p>' + moreContent + '</div><span class="process-numder">' + String(index + 1).padStart(2, "0") + '.</span></li>';
        }).join(""));
        section.find(".srv-link-text h4").text(process.ctaText || "");
        section.find(".srv-link-text .btn").text(process.ctaButtonText || "My Services").attr("href", safeUrl(process.ctaButtonLink)).attr("target", process.ctaButtonTarget === "new" ? "_blank" : null).attr("rel", process.ctaButtonTarget === "new" ? "noopener noreferrer" : null);
        section.off("click.processMore", ".process-more-toggle").on("click.processMore", ".process-more-toggle", function () {
            var button = $(this); var list = button.next(".process-more-points"); var expanded = button.attr("aria-expanded") === "true";
            button.attr("aria-expanded", expanded ? "false" : "true").toggleClass("is-open", !expanded);
            if (expanded) list.stop(true, true).slideUp(220, function () { list.attr("hidden", "hidden"); });
            else list.removeAttr("hidden").hide().stop(true, true).slideDown(260);
        });
        if (typeof window.initparallax === "function") window.initparallax();
    }
    $(function () { fetch("/api/content/process/").then(function (response) { return response.ok ? response.json() : []; }).then(function (items) { if (Array.isArray(items) && items.length) renderProcess(items[0]); }).catch(function () {}); });
}(jQuery));
