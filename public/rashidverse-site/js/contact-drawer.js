(function () {
  "use strict";

  var FALLBACK_CONFIG_URL = "/rashidverse-site/contact-drawer.json";
  var drawer = null;
  var pendingOpen = false;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function iconMarkup(name) {
    var icons = {
      upwork: '<svg class="rv-contact-icon rv-contact-upwork-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/></svg>',
      linkedin: '<span class="rv-contact-icon rv-contact-icon--wordmark">in</span>',
      facebook: '<i class="rv-contact-icon fab fa-facebook-f" aria-hidden="true"></i>',
      instagram: '<i class="rv-contact-icon fab fa-instagram" aria-hidden="true"></i>',
      youtube: '<i class="rv-contact-icon fab fa-youtube" aria-hidden="true"></i>',
      twitter: '<i class="rv-contact-icon fab fa-twitter" aria-hidden="true"></i>',
      behance: '<i class="rv-contact-icon fab fa-behance" aria-hidden="true"></i>',
      dribbble: '<i class="rv-contact-icon fab fa-dribbble" aria-hidden="true"></i>',
      tiktok: '<i class="rv-contact-icon fab fa-tiktok" aria-hidden="true"></i>',
      custom: '<i class="rv-contact-icon fal fa-link" aria-hidden="true"></i>',
      photo: '<span class="rv-contact-icon" aria-hidden="true">&#128444;</span>',
      document: '<span class="rv-contact-icon" aria-hidden="true">&#128196;</span>',
      mail: '<svg class="rv-contact-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
      chat: '<svg class="rv-contact-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="currentColor"/></svg>',
      github: '<svg class="rv-contact-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.54 1.04 1.54 1.04.9 1.54 2.35 1.1 2.92.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.53 9.53 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.9.68 1.81v2.68c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" fill="currentColor"/></svg>'
    };
    return icons[name] || "";
  }

  function globalConfig(settings) {
    if (!settings || typeof settings !== "object") return null;
    var activeProfile = String(window.__RASHIDVERSE_ACTIVE_SECTOR__ || "wordpress").toLowerCase();
    var resumes = Array.isArray(settings.resumes) ? settings.resumes : [];
    var chosenResume = resumes.filter(function (resume) { return resume && resume.profile === activeProfile && resume.url; })[0] || resumes.filter(function (resume) { return resume && resume.url; })[0];
    var socialLinks = Array.isArray(settings.socialLinks) ? settings.socialLinks : [
      { platform: "upwork", label: "Upwork Profile", url: settings.upwork, visible: true, order: 0 },
      { platform: "linkedin", label: "LinkedIn Profile", url: settings.linkedin, visible: true, order: 1 },
      { platform: "github", label: "GitHub", url: settings.github, visible: true, order: 2 }
    ];
    socialLinks = socialLinks.filter(function (social) { return social && social.visible !== false && social.url; }).sort(function (first, second) { return Number(first.order || 0) - Number(second.order || 0); });
    var connect = [];
    var contact = [];
    var more = [];
    socialLinks.forEach(function (social) {
      var platform = String(social.platform || "custom").toLowerCase();
      var link = { label: social.label || platform, url: social.url, icon: platform, tone: platform === "upwork" || platform === "linkedin" ? platform : "", external: true };
      if (platform === "github") more.push(link); else connect.push(link);
    });
    if (settings.email) contact.push({ label: settings.email, url: "mailto:" + settings.email, icon: "mail", tone: "email" });
    if (settings.phone) contact.push({ label: settings.phone, url: settings.whatsapp ? "https://wa.me/" + String(settings.whatsapp).replace(/[^0-9]/g, "") : "tel:" + String(settings.phone).replace(/[^+0-9]/g, ""), icon: "chat", tone: "whatsapp", external: Boolean(settings.whatsapp) });
    if (settings.email) more.push({ label: "Contact me", url: "mailto:" + settings.email, icon: "chat" });
    var sections = [];
    if (connect.length) sections.push({ title: "Connect", items: connect });
    if (chosenResume) sections.push({ title: "Download", layout: "inline", items: [{ label: chosenResume.label || "Download Resume", url: chosenResume.url, icon: "document", tone: "resume", external: chosenResume.target !== "same" }] });
    if (contact.length) sections.push({ title: "Contact", items: contact });
    if (more.length) sections.push({ title: "More", layout: "inline", items: more });
    return {
      name: settings.fullName || "Rashidverse",
      role: settings.designation || "",
      profileImage: settings.profileImage || "/rashidverse-site/images/contact-drawer-profile.png",
      footer: settings.footer || "Rashidverse. All rights reserved.",
      sections: sections
    };
  }

  function itemMarkup(item) {
    var target = item.external ? ' target="_blank" rel="noopener noreferrer"' : "";
    var tone = item.tone ? " rv-contact-link--" + escapeHtml(item.tone) : "";
    return '<a class="rv-contact-link' + tone + '" href="' + escapeHtml(item.url) + '"' + target + '>' + iconMarkup(item.icon) + '<span>' + escapeHtml(item.label) + "</span></a>";
  }

  function sectionMarkup(section) {
    var items = Array.isArray(section.items) ? section.items : [];
    var links = items.map(itemMarkup).join("");
    var className = section.layout === "inline" ? "rv-contact-inline" : "";
    return '<section class="rv-contact-section"><h3>' + escapeHtml(section.title) + '</h3><div class="' + className + '">' + links + "</div></section>";
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("rv-contact-open");
  }

  function openDrawer() {
    if (!drawer) {
      pendingOpen = true;
      return;
    }
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("rv-contact-open");
    var closeButton = drawer.querySelector(".rv-contact-close");
    if (closeButton) closeButton.focus();
  }

  function mountDrawer(config) {
    if (drawer || document.querySelector(".rv-contact-drawer")) return;

    var sections = Array.isArray(config.sections) ? config.sections : [];
    drawer = document.createElement("div");
    drawer.className = "rv-contact-drawer";
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML =
      '<div class="rv-contact-backdrop"></div>' +
      '<aside class="rv-contact-panel" role="dialog" aria-modal="true" aria-label="Contact ' + escapeHtml(config.name) + '">' +
        '<button type="button" class="rv-contact-close" aria-label="Close contact panel">&times;</button>' +
        '<div class="rv-contact-content">' +
          '<h2>' + escapeHtml(config.name) + '</h2>' +
          '<p class="rv-contact-role">' + escapeHtml(config.role) + '</p>' +
          '<div class="rv-contact-groups">' + sections.map(sectionMarkup).join("") + "</div>" +
          '<p class="rv-contact-footer">&copy; ' + new Date().getFullYear() + " " + escapeHtml(config.footer) + "</p>" +
        "</div>" +
        '<div class="rv-contact-photo"><img src="' + escapeHtml(config.profileImage) + '" alt="' + escapeHtml(config.name) + '"></div>' +
      "</aside>";

    document.body.appendChild(drawer);
    if (pendingOpen) {
      pendingOpen = false;
      openDrawer();
    }
  }

  function initialiseDrawer() {
    // The static landing page places the trigger inside a scrolling layer.
    // Moving only these marked triggers to body keeps it viewport-fixed.
    document.querySelectorAll("[data-contact-drawer-static]").forEach(function (trigger) {
      if (trigger.parentNode !== document.body) document.body.appendChild(trigger);
    });

    document.addEventListener("click", function (event) {
      var target = event.target;
      var trigger = target instanceof Element ? target.closest("[data-contact-drawer-trigger]") : null;
      if (trigger) {
        event.preventDefault();
        event.stopPropagation();
        openDrawer();
        return;
      }
      var closeTarget = target instanceof Element ? target.closest(".rv-contact-close, .rv-contact-backdrop") : null;
      if (closeTarget) closeDrawer();
    }, true);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDrawer();
    });

    window.RashidverseContactDrawer = { open: openDrawer, close: closeDrawer };

    fetch("/api/content/globalsettings/", { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Global settings could not be loaded.");
        return response.json();
      })
      .then(function (items) {
        var config = globalConfig(Array.isArray(items) ? items[0] : items);
        if (!config) throw new Error("Global settings are empty.");
        mountDrawer(config);
      })
      .catch(function () {
        // Existing local installations keep working until Global Settings is saved.
        return fetch(FALLBACK_CONFIG_URL, { cache: "no-store" })
          .then(function (response) {
            if (!response.ok) throw new Error("Contact drawer configuration could not be loaded.");
            return response.json();
          })
          .then(mountDrawer)
          .catch(function (error) { console.error(error); });
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialiseDrawer);
  else initialiseDrawer();
}());
