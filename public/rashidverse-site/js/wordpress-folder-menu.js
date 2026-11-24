(function ($) {
    "use strict";

    $(function () {
        // The folder menu is a WordPress-profile-only shortcut surface. It is
        // intentionally separate from the normal one-page navigation.
        if (String(window.__RASHIDVERSE_ACTIVE_SECTOR__ || "").toLowerCase() !== "wordpress") return;

        window.setTimeout(function () {
            var trigger = document.querySelector(".rv-wordpress-action-button");
            if (!trigger || document.getElementById("rv-wordpress-folder-menu")) return;
            var navigation = trigger.closest(".scroll-nav-wrap");
            var hero = document.querySelector(".hero-wrap");
            if (!navigation) return;

            // Same card count, 126 × 166 sizing, positions and stagger timing
            // as the supplied folder-menu source. Only the destinations and
            // labels are adapted to the WordPress profile.
            var fallbackCards = [
                { title: "01_Hero", detail: "Profile overview", href: "#sec1", x: "-376px", yUp: "-360px", yDown: "360px", r: "-10deg", delay: "40ms", visual: "badge", badge: "H" },
                { title: "02_About", detail: "About me", href: "#sec2", x: "-188px", yUp: "-400px", yDown: "400px", r: "-4deg", delay: "85ms", visual: "badge", badge: "A", variant: "rv-folder-pr-card" },
                { title: "03_Skills", detail: "Design skills", href: "#sec4", x: "0px", yUp: "-412px", yDown: "412px", r: "1deg", delay: "130ms", visual: "music" },
                { title: "04_Projects", detail: "Featured work", href: "#sec5", x: "188px", yUp: "-387px", yDown: "387px", r: "8deg", delay: "175ms", visual: "video" },
                { title: "05_Portfolio", detail: "All WordPress work", href: "/wordpress/portfolio/", x: "376px", yUp: "-342px", yDown: "342px", r: "13deg", delay: "220ms", visual: "image" },
                { title: "06_Resume", detail: "Work experience", href: "#sec3", x: "-340px", yUp: "-80px", yDown: "80px", r: "-9deg", delay: "265ms", visual: "footage" },
                { title: "07_Clients", detail: "Client feedback", href: "#sec6", x: "-148px", yUp: "-120px", yDown: "120px", r: "-4deg", delay: "310ms", visual: "document" },
                { title: "08_Images", detail: "Project gallery", href: "/wordpress/portfolio/", x: "52px", yUp: "-122px", yDown: "122px", r: "2deg", delay: "355ms", visual: "image" },
                { title: "09_Contact", detail: "Start a conversation", action: "contact", x: "238px", yUp: "-112px", yDown: "112px", r: "6deg", delay: "400ms", visual: "voice" },
                { title: "10_Connect", detail: "Get in touch", action: "contact", x: "400px", yUp: "-58px", yDown: "58px", r: "12deg", delay: "445ms", visual: "dots" }
            ];

            var cardPositions = [
                { x: "-376px", yUp: "-360px", yDown: "360px", r: "-10deg", delay: "40ms" },
                { x: "-188px", yUp: "-400px", yDown: "400px", r: "-4deg", delay: "85ms" },
                { x: "0px", yUp: "-412px", yDown: "412px", r: "1deg", delay: "130ms" },
                { x: "188px", yUp: "-387px", yDown: "387px", r: "8deg", delay: "175ms" },
                { x: "376px", yUp: "-342px", yDown: "342px", r: "13deg", delay: "220ms" },
                { x: "-340px", yUp: "-80px", yDown: "80px", r: "-9deg", delay: "265ms" },
                { x: "-148px", yUp: "-120px", yDown: "120px", r: "-4deg", delay: "310ms" },
                { x: "52px", yUp: "-122px", yDown: "122px", r: "2deg", delay: "355ms" },
                { x: "238px", yUp: "-112px", yDown: "112px", r: "6deg", delay: "400ms" },
                { x: "400px", yUp: "-58px", yDown: "58px", r: "12deg", delay: "445ms" }
            ];

            function escapeHtml(value) {
                return String(value || "").replace(/[&<>'"]/g, function (character) {
                    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
                });
            }

            function cardVisual(card) {
                if (card.customIcon) return '<img class="rv-folder-card-custom-icon" src="' + escapeHtml(card.customIcon) + '" alt="">';
                if (card.visual === "badge") return '<span class="rv-folder-card-app">' + escapeHtml(card.badge) + '</span>';
                var icon = card.icon || card.visual || "puzzle";
                var paths = {
                    puzzle: '<path d="M18 8h8a3 3 0 0 1 3 3v4.4a5 5 0 1 0 6 0V11a3 3 0 0 1 3-3h2v12h-4.4a5 5 0 1 0 0 6H40v11a3 3 0 0 1-3 3H26v-4.4a5 5 0 1 0-6 0V40H11a3 3 0 0 1-3-3V26h4.4a5 5 0 1 0 0-6H8v-9a3 3 0 0 1 3-3h7z"/>',
                    blocks: '<rect x="8" y="8" width="13" height="13" rx="2"/><rect x="27" y="8" width="13" height="13" rx="2"/><rect x="8" y="27" width="13" height="13" rx="2"/><rect x="27" y="27" width="13" height="13" rx="2"/>',
                    form: '<rect x="10" y="7" width="28" height="34" rx="3"/><path d="M17 16h14M17 24h14M17 32h9"/>',
                    database: '<ellipse cx="24" cy="11" rx="13" ry="5"/><path d="M11 11v13c0 2.8 5.8 5 13 5s13-2.2 13-5V11M11 24v13c0 2.8 5.8 5 13 5s13-2.2 13-5V24"/>',
                    cart: '<path d="M7 9h5l3 20h20l4-14H16"/><circle cx="18" cy="38" r="2.5"/><circle cx="33" cy="38" r="2.5"/>',
                    speed: '<path d="M8 30a16 16 0 1 1 32 0"/><path d="m24 25 9-8M24 30h.01"/>',
                    shield: '<path d="M24 6 39 12v10c0 9-6.2 16-15 20-8.8-4-15-11-15-20V12L24 6z"/><path d="m17 24 5 5 10-11"/>',
                    image: '<rect x="7" y="9" width="34" height="30" rx="4"/><circle cx="31" cy="18" r="3"/><path d="m12 33 9-9 6 6 4-4 5 7"/>',
                    code: '<path d="m18 12-9 12 9 12M30 12l9 12-9 12M27 8l-6 32"/>',
                    settings: '<circle cx="24" cy="24" r="6"/><path d="M24 7v5M24 36v5M7 24h5M36 24h5M12 12l3.5 3.5M32.5 32.5 36 36M36 12l-3.5 3.5M15.5 32.5 12 36"/>',
                    music: '<path d="M31 7v25.1a7.4 7.4 0 1 1-4-6.6V13.8L14 16.3v19.8a7.4 7.4 0 1 1-4-6.6V12.8L31 7z"/>',
                    video: '<path d="M8 15a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v4.5l7-4.1a2 2 0 0 1 3 1.7v13.8a2 2 0 0 1-3 1.7l-7-4.1V33a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5V15z"/>',
                    footage: '<rect x="11" y="9" width="26" height="30" rx="3"/><path d="M18 9v30M30 9v30M11 17h8M29 17h8M11 25h8M29 25h8M11 33h8M29 33h8"/>',
                    document: '<path d="M13 7h16l8 8v26H13V7z"/><path d="M29 7v10h8M18 24h14M18 30h14M18 36h9"/>',
                    voice: '<rect x="18" y="8" width="12" height="24" rx="6"/><path d="M12 23v2a12 12 0 0 0 24 0v-2M24 37v6M17 43h14"/>',
                    dots: '<circle cx="14" cy="24" r="4"/><circle cx="24" cy="24" r="4"/><circle cx="34" cy="24" r="4"/>'
                };
                var stroked = ["blocks", "form", "database", "cart", "speed", "shield", "image", "code", "settings", "footage", "document", "voice"].indexOf(icon) > -1;
                return '<svg class="rv-folder-card-icon' + (stroked ? ' rv-folder-card-icon--stroked' : '') + '" viewBox="0 0 48 48" aria-hidden="true">' + (paths[icon] || paths.puzzle) + '</svg>';
            }

            function renderCards(items) {
                return items.slice(0, cardPositions.length).map(function (card, index) {
                    var position = cardPositions[index];
                    // A card has one click target. A selected downloadable file
                    // (uploaded or external) intentionally takes priority; when
                    // no download is supplied, the regular plugin/demo link is
                    // used instead.
                    var downloadHref = String(card.downloadUrl || card.downloadFile || "").trim();
                    var pluginHref = String(card.href || card.link || "").trim();
                    var href = downloadHref || pluginHref;
                    var isDownload = Boolean(downloadHref);
                    var hasLink = Boolean(href) || Boolean(card.action);
                    var tag = hasLink ? "a" : "div";
                    var attributes = card.action ? ' href="#" data-rv-folder-action="' + escapeHtml(card.action) + '"' : href ? ' href="' + escapeHtml(href) + '"' + (isDownload ? ' download' : (card.target === "same" ? "" : ' target="_blank" rel="noopener noreferrer"')) : ' aria-disabled="true"';
                    var detail = card.detail || card.description || "";
                    return '<' + tag + ' class="rv-folder-card ' + (card.variant || "") + (hasLink ? "" : " rv-folder-card--inactive") + '"' + attributes +
                        ' style="--folder-x:' + position.x + ';--folder-y-up:' + position.yUp + ';--folder-y-down:' + position.yDown + ';--folder-r:' + position.r + ';--folder-delay:' + position.delay + '">' +
                        '<span class="rv-folder-card-tab"></span>' + cardVisual(card) +
                        '<strong>' + escapeHtml(card.title) + '</strong><small>' + escapeHtml(detail) + '</small></' + tag + '>';
                }).join("");
            }

            var rays = new Array(8).fill("").map(function (_, index) {
                return '<span style="--folder-ray:' + (-53 + (index * 13)) + 'deg;--folder-ray-delay:' + (index * 24) + 'ms"></span>';
            }).join("");

            var menu = document.createElement("div");
            menu.id = "rv-wordpress-folder-menu";
            menu.className = "rv-folder-menu";
            menu.setAttribute("aria-hidden", "true");
            menu.innerHTML =
                '<button type="button" class="rv-folder-close" aria-label="Close Plugins menu" title="Close Plugins menu"><span aria-hidden="true">&times;</span></button>' +
                '<div class="rv-folder-showcase-copy">' +
                    '<h2 data-custom-plugin-heading>My WordPress Plugins &amp; Extensions</h2>' +
                    '<p data-custom-plugin-description>A curated collection of custom WordPress plugins, practical add-ons, and extensions I build to improve real project workflows.</p>' +
                '</div>' +
                '<div class="rv-folder-rays" aria-hidden="true">' + rays + '</div><div class="rv-folder-card-list">' + renderCards(fallbackCards) + '</div>';
            // Render above the hero's overflow-clipped content, but align the
            // surface to the navigation edge so it behaves as its drawer.
            document.body.appendChild(menu);

            // The drawer title is managed in Admin → Pages → WordPress Profile
            // → Custom Plugins. Keep a safe local fallback so the menu still
            // looks complete while a request is unavailable.
            fetch("/api/content/customplugins/?sector=wordpress", { cache: "no-store" })
                .then(function (response) { return response.ok ? response.json() : []; })
                .then(function (items) {
                    var settings = Array.isArray(items) ? items[0] : null;
                    if (!settings) return;
                    var heading = menu.querySelector("[data-custom-plugin-heading]");
                    var description = menu.querySelector("[data-custom-plugin-description]");
                    if (heading && settings.heading) heading.textContent = settings.heading;
                    if (description && settings.description) description.textContent = settings.description;
                })
                .catch(function () { /* Keep the local fallback copy. */ });

            // Each folder card is an individual dashboard item. When the
            // collection has intentionally been emptied, render no cards
            // rather than bringing the former demo cards back.
            fetch("/api/content/pluginitems/?sector=wordpress", { cache: "no-store" })
                .then(function (response) { return response.ok ? response.json() : null; })
                .then(function (items) {
                    if (!Array.isArray(items)) return;
                    var cardList = menu.querySelector(".rv-folder-card-list");
                    if (cardList) cardList.innerHTML = renderCards(items);
                })
                .catch(function () { /* Keep the local visual fallback if the API is unavailable. */ });

            function positionMenu() {
                var bounds = trigger.getBoundingClientRect();
                var navigationBounds = navigation.getBoundingClientRect();
                menu.style.setProperty("--folder-origin-x", Math.round(bounds.left - navigationBounds.left + (bounds.width / 2)) + "px");
                menu.style.left = Math.round(navigationBounds.left) + "px";
                menu.style.width = Math.round(navigationBounds.width) + "px";

                var opensDown = navigation.classList.contains("rv-navigation-sticky");
                menu.classList.toggle("rv-folder-menu--opens-down", opensDown);
                var drawerHeight = opensDown
                    ? window.innerHeight - navigationBounds.bottom
                    : navigationBounds.top;
                menu.style.setProperty("--folder-drawer-height", Math.max(360, Math.round(drawerHeight)) + "px");
                if (opensDown) {
                    menu.style.top = Math.round(navigationBounds.bottom) + "px";
                    menu.style.bottom = "auto";
                } else {
                    menu.style.top = "auto";
                    menu.style.bottom = Math.round(window.innerHeight - navigationBounds.top) + "px";
                }
            }

            function setOpen(isOpen) {
                positionMenu();
                menu.classList.toggle("is-open", isOpen);
                menu.setAttribute("aria-hidden", String(!isOpen));
                trigger.classList.toggle("is-open", isOpen);
                trigger.setAttribute("aria-expanded", String(isOpen));
                // Keep the menu as a true drawer: opening it pushes the
                // WordPress hero layers out of its way, rather than stacking
                // a new surface on top of the existing hero.
                if (hero) hero.classList.toggle("rv-wordpress-folder-open", isOpen);
            }

            trigger.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                setOpen(!menu.classList.contains("is-open"));
                trigger.classList.remove("is-animating");
                window.requestAnimationFrame(function () {
                    trigger.classList.add("is-animating");
                });
            });

            menu.querySelector(".rv-folder-close").addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                setOpen(false);
                trigger.focus();
            });

            menu.addEventListener("click", function (event) {
                var card = event.target.closest(".rv-folder-card");
                if (!card) return;

                if (card.getAttribute("data-rv-folder-action") === "contact") {
                    event.preventDefault();
                    setOpen(false);
                    window.setTimeout(function () {
                        var contactTrigger = document.querySelector("[data-contact-drawer-trigger]");
                        if (contactTrigger) contactTrigger.click();
                    }, 120);
                    return;
                }
                setOpen(false);
            });

            document.addEventListener("click", function (event) {
                if (!menu.classList.contains("is-open")) return;
                if (event.target.closest("#rv-wordpress-folder-menu") || event.target.closest(".rv-wordpress-action-button")) return;
                setOpen(false);
            });

            document.addEventListener("keydown", function (event) {
                if (event.key !== "Escape" || !menu.classList.contains("is-open")) return;
                setOpen(false);
                trigger.focus();
            });

            window.addEventListener("resize", positionMenu);
            window.addEventListener("scroll", positionMenu, { passive: true });
            positionMenu();
        }, 0);
    });
}(jQuery));
