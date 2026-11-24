(function ($) {
    "use strict";
    function escapeHtml(value) { return String(value || "").replace(/[&<>'"]/g, function (character) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]; }); }
    function headingHtml(value) { return escapeHtml(value || "").replace(/\[highlight\](.*?)\[\/highlight\]/g, "<span>$1</span>").replace(/\n/g, "<br>"); }
    function percent(value) { return Math.max(0, Math.min(100, Number(value) || 0)); }
    function listGroup(group, index) { return '<div class="fl-wrap mar-bottom skill-wrap dynamic-skill-wrap"><div class="row"><div class="col-md-4"><div class="pr-title fl-wrap"><h3>' + escapeHtml(group.title) + '</h3><span>' + escapeHtml(group.description) + '</span></div><div class="ci-num"><span>' + String(index + 1).padStart(2, "0") + '.</span></div></div><div class="col-md-8"><ul class="rv-skill-tags">' + (group.items || []).map(function (item) { return '<li>' + escapeHtml(item.name) + '</li>'; }).join('') + '</ul></div></div></div>'; }
    function circleGroup(group, index) { return '<div class="fl-wrap mar-bottom skill-wrap dynamic-skill-wrap"><div class="row"><div class="col-md-4"><div class="pr-title fl-wrap"><h3>' + escapeHtml(group.title) + '</h3><span>' + escapeHtml(group.description || "") + '</span></div><div class="ci-num"><span>' + String(index + 1).padStart(2, "0") + '. - </span></div></div><div class="col-md-8"><div class="dynamic-piechart-holder">' + (group.items || []).map(function (item) { var value = percent(item.percent); return '<div class="dynamic-piechart"><div class="dynamic-chart" style="--skill-percent:' + value + '"><span>' + value + '%</span></div><h4>' + escapeHtml(item.name) + '</h4></div>'; }).join("") + '</div></div></div></div>'; }
    function barGroup(group, index) { return '<div class="fl-wrap mar-bottom mar-top skill-wrap dynamic-skill-wrap"><div class="row"><div class="col-md-2"></div><div class="col-md-4"><div class="pr-title fl-wrap"><h3>' + escapeHtml(group.title) + '</h3><span>' + escapeHtml(group.description || "") + '</span></div><div class="ci-num"><span>' + String(index + 1).padStart(2, "0") + '. - </span></div></div><div class="col-md-6"><div class="dynamic-skillbar-list">' + (group.items || []).map(function (item) { var value = percent(item.percent); return '<div class="dynamic-skillbar"><div><span>' + escapeHtml(item.name) + '</span><b>' + value + '%</b></div><i><em style="width:' + value + '%"></em></i></div>'; }).join("") + '</div></div></div></div>'; }
    $(function () {
        fetch("/api/content/skills/").then(function (response) { return response.ok ? response.json() : []; }).then(function (items) { if (!Array.isArray(items) || !items.length) return; var item = items[0], section = $("[data-dynamic-skills-section]"); section.find(".bg.par-elem").attr("data-bg", item.image || "").css("background-image", item.image ? "url('" + String(item.image).replace(/'/g, "%27") + "')" : ""); section.find(".overlay").css({ backgroundColor: item.overlayColor || "#000", opacity: percent(item.overlayOpacity) / 100 }); section.find("h2").html(headingHtml(item.heading)); section.find(".section-title p").text(item.description || ""); section.find(".horizonral-subtitle span").text(item.subtitle || ""); }).catch(function () {});
        if (window.__rashidverseSkillGroupsRendered) return;
        window.__rashidverseSkillGroupsRendered = true;
        fetch("/api/content/skillgroups/").then(function (response) { return response.ok ? response.json() : []; }).then(function (groups) {
            var sections = $("[data-dynamic-skill-groups]");
            if (!sections.length || !Array.isArray(groups) || !groups.length) return;
            sections.slice(1).remove();
            var container = sections.first().children(".container").first();
            container.children().remove();
            container.append('<div id="rashidverse-dynamic-skills">' + groups.map(function (group, index) { return group.display === "list" ? listGroup(group, index) : group.display === "bar" ? barGroup(group, index) : circleGroup(group, index); }).join("") + '</div>');
        }).catch(function () {});
    });
}(jQuery));
