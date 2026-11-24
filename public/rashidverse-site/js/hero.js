(function ($) {
    "use strict";

    var heroTimer = null;
    var wordPressOrbitAnimation = null;
    var wordPressSlideController = null;

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>'"]/g, function (character) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
        });
    }

    function safeUrl(value) {
        var url = String(value || "").trim();
        return /^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(url) ? url : "#";
    }

    function activeSector() {
        return String(window.__RASHIDVERSE_ACTIVE_SECTOR__ || "").toLowerCase();
    }

    function isWordPressProfile() {
        return activeSector() === "wordpress";
    }

    // These cards are real WordPress portfolio projects. Eight cards stay
    // visible while the ninth enters from the hero's bottom-right corner.
    function orbitProjectsFromPortfolio(items) {
        if (!Array.isArray(items)) return [];
        return items.filter(function (project) {
            return project && project.published !== false && (project.thumb || project.hoverImg);
        }).sort(function (first, second) {
            return new Date(second.updatedAt || second.createdAt || 0).getTime() - new Date(first.updatedAt || first.createdAt || 0).getTime();
        }).map(function (project) {
            return {
                title: String(project.title || "Portfolio project"),
                url: safeUrl(project.link) === "#" ? "/wordpress/portfolio/" : project.link,
                thumbnail: project.thumb || project.hoverImg || ""
            };
        });
    }

    function fetchWordPressOrbitProjects() {
        return fetch("/api/content/portfolio/?sector=wordpress")
            .then(function (response) { return response.ok ? response.json() : []; })
            .then(orbitProjectsFromPortfolio)
            .catch(function () { return []; });
    }

    function orbitCardMarkup(project, index) {
        return '<a class="rv-orbit-card-link" href="' + escapeHtml(safeUrl(project.url)) + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + escapeHtml(project.title) + ' in a new tab">' +
            '<article class="rv-orbit-card">' +
            '<img class="rv-orbit-thumbnail" src="' + escapeHtml(safeUrl(project.thumbnail)) + '" alt="' + escapeHtml(project.title) + '">' +
            '<span class="rv-orbit-thumbnail-shade" aria-hidden="true"></span>' +
            '<span class="rv-orbit-thumbnail-number" aria-hidden="true">' + String(index + 1).padStart(2, "0") + '</span>' +
            '<div class="rv-orbit-card-inner">' +
            '<div class="rv-orbit-card-top"><span>' + escapeHtml(project.category) + '</span><span>' + String(index + 1).padStart(2, "0") + '</span></div>' +
            '<div class="rv-orbit-lines" aria-hidden="true"><i></i><i></i><i></i></div>' +
            '<div class="rv-orbit-card-bottom"><div class="rv-orbit-mark">' + escapeHtml(project.mark) + '</div>' +
            '<div class="rv-orbit-meta"><div class="rv-orbit-title">' + escapeHtml(project.title) + '</div><div class="rv-orbit-view">View project ↗</div>' +
            '<div class="rv-orbit-swatches" aria-hidden="true"><span></span><span></span><span></span></div></div></div>' +
            '</div></article></a>';
    }

    function destroyWordPressOrbit() {
        if (wordPressOrbitAnimation) {
            wordPressOrbitAnimation.cancelled = true;
            window.cancelAnimationFrame(wordPressOrbitAnimation.frameId);
            window.clearTimeout(wordPressOrbitAnimation.pauseTimer);
            window.clearTimeout(wordPressOrbitAnimation.manualTimer);
            wordPressOrbitAnimation = null;
        }
        $(window).off("resize.rvWordPressOrbit");
        var heroControls = $("#dynamic-hero-carousel").closest(".fs-carousel-wrap");
        heroControls.find(".sp-cont-prev, .sp-cont-next")
            .off("click.rvWordPressOrbit keydown.rvWordPressOrbit")
            .removeClass("rv-orbit-control rv-orbit-control-up rv-orbit-control-down")
            .removeAttr("aria-label role tabindex");
        heroControls.find(".sp-cont-prev i").attr("class", "fal fa-arrow-left");
        heroControls.find(".sp-cont-next i").attr("class", "fal fa-arrow-right");
        heroControls.find(".slider-nav-counter").removeClass("rv-orbit-counter").empty();
        $(".hero-wrap").removeClass("rv-wordpress-orbit-enabled rv-wordpress-ribbon-enabled")
            .find(".rv-wordpress-orbit-viewport, .rv-hero-portfolio-ribbon").remove();
    }

    function renderWordPressOrbit(portfolioProjects) {
        var hero = $(".hero-wrap");
        var heroWrap = $("#dynamic-hero-carousel").closest(".fs-carousel-wrap");
        var visibleCardCount = 8;
        // The ninth record is only the incoming card below the hero. It makes
        // the eight visible cards loop without restoring a full 360-degree ring.
        var projects = Array.isArray(portfolioProjects) ? portfolioProjects.slice(0, visibleCardCount + 1) : [];
        destroyWordPressOrbit();
        if (projects.length < visibleCardCount + 1 || !heroWrap.length) return;

        hero.addClass("rv-wordpress-orbit-enabled");
        heroWrap.append('<aside class="rv-wordpress-orbit-viewport" aria-label="WordPress portfolio orbit">' +
            '<div class="rv-wordpress-orbit-stage"><div class="rv-wordpress-orbit"></div><div class="rv-orbit-center-mask" aria-hidden="true"></div></div>' +
            '</aside>');

        var stage = heroWrap.find(".rv-wordpress-orbit-stage").get(0);
        var orbit = heroWrap.find(".rv-wordpress-orbit").get(0);
        if (!stage || !orbit) return;

        var links = [];
        var cards = [];
        var count = projects.length;
        // These slots match the current right-side curve: top card exits above
        // the hero, while the extra card enters from the bottom-right corner.
        var arcAngles = [234, 219, 204, 189, 174, 159, 144, 129];
        var entryAngle = 105;
        var exitAngle = 258;
        var config = {
            radiusRatio: 0.392,
            neighbourDelay: 72,
            moveDuration: 610,
            settlePause: 850,
            normalRadialLift: 14,
            incomingRadialLift: 72,
            tiltAmount: 4.5,
            scaleAmount: 0.035,
            orientationOffset: 180
        };
        var slotOfCard = Array.from({ length: count }, function (_, index) { return index; });
        // The two off-screen transition cards are excluded from the visible
        // controller count, leaving the seven-card navigation sequence.
        var cardControlIndex = 1;
        var cardControlTotal = Math.max(1, count - 2);
        var cycleStart = performance.now() + 350;
        var cycleRunning = true;
        var cycleLength = ((count - 1) * config.neighbourDelay) + config.moveDuration;
        var state = { frameId: null, pauseTimer: null, manualTimer: null, cancelled: false };

        projects.forEach(function (project, index) {
            orbit.insertAdjacentHTML("beforeend", orbitCardMarkup(project, index));
            var link = orbit.lastElementChild;
            links.push(link);
            cards.push(link.querySelector(".rv-orbit-card"));
        });

        function getRadius() {
            return stage.getBoundingClientRect().width * config.radiusRatio;
        }

        function slotAngle(slot) {
            if (slot < 0) return exitAngle;
            if (slot >= visibleCardCount) return entryAngle;
            return arcAngles[slot];
        }

        function easeInOutCubic(progress) {
            return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        }

        function pushWave(progress) {
            if (progress <= 0 || progress >= 1) return 0;
            return Math.sin(Math.PI * progress) + Math.sin(Math.PI * 2 * progress) * 0.13 * (1 - progress);
        }

        function clamp01(value) {
            return Math.max(0, Math.min(1, value));
        }

        function commitOneStep(direction) {
            for (var index = 0; index < count; index += 1) {
                if (direction < 0) slotOfCard[index] = slotOfCard[index] === visibleCardCount ? 0 : slotOfCard[index] + 1;
                else slotOfCard[index] = slotOfCard[index] === 0 ? visibleCardCount : slotOfCard[index] - 1;
            }
            if (direction < 0) cardControlIndex = cardControlIndex === 1 ? cardControlTotal : cardControlIndex - 1;
            else cardControlIndex = cardControlIndex === cardControlTotal ? 1 : cardControlIndex + 1;
            updateOrbitCounter();
        }

        function animationOrderForSlot(currentSlot) {
            return visibleCardCount - currentSlot;
        }

        function cardVisualState(cardIndex, elapsed) {
            var currentSlot = slotOfCard[cardIndex];
            var targetSlot = currentSlot === 0 ? -1 : currentSlot - 1;
            var order = animationOrderForSlot(currentSlot);
            var progress = clamp01((elapsed - order * config.neighbourDelay) / config.moveDuration);
            var eased = easeInOutCubic(progress);
            var wave = pushWave(progress);
            var fromAngle = slotAngle(currentSlot);
            var toAngle = slotAngle(targetSlot);
            var incoming = currentSlot >= visibleCardCount;
            return {
                angle: fromAngle + (toAngle - fromAngle) * eased,
                radialLift: incoming ? Math.sin(Math.PI * progress) * config.incomingRadialLift : wave * config.normalRadialLift,
                tilt: wave * config.tiltAmount,
                scale: 1 + Math.max(0, wave) * config.scaleAmount,
                incoming: incoming
            };
        }

        function setCardTransform(index, angle, radius, tilt, scale, incoming) {
            var radians = angle * Math.PI / 180;
            var x = Math.cos(radians) * radius;
            var y = Math.sin(radians) * radius;
            var rotation = angle + config.orientationOffset + tilt;
            links[index].style.transform = "translate3d(" + x + "px, " + y + "px, 0) rotate(" + rotation + "deg)";
            links[index].style.zIndex = String(1000 + Math.round(y) + (incoming ? 100 : 0));
            cards[index].style.setProperty("--rv-orbit-local-scale", scale.toFixed(4));
        }

        function renderRestingState() {
            var radius = getRadius();
            for (var index = 0; index < count; index += 1) {
                setCardTransform(index, slotAngle(slotOfCard[index]), radius, 0, 1, false);
            }
        }

        function renderCycle(now) {
            var elapsed = now - cycleStart;
            var baseRadius = getRadius();
            for (var index = 0; index < count; index += 1) {
                var visual = cardVisualState(index, elapsed);
                setCardTransform(index, visual.angle, baseRadius + visual.radialLift, visual.tilt, visual.scale, visual.incoming);
            }
            if (elapsed >= cycleLength) {
                commitOneStep(1);
                cycleRunning = false;
                renderRestingState();
                state.pauseTimer = window.setTimeout(function () {
                    if (state.cancelled) return;
                    cycleStart = performance.now();
                    cycleRunning = true;
                }, config.settlePause);
            }
        }

        function animate(now) {
            if (state.cancelled) return;
            if (cycleRunning) renderCycle(now);
            state.frameId = window.requestAnimationFrame(animate);
        }

        function moveOrbitManually(direction) {
            if (state.cancelled) return;
            window.clearTimeout(state.pauseTimer);
            window.clearTimeout(state.manualTimer);
            cycleRunning = false;
            links.forEach(function (link) {
                link.style.transition = "transform .62s cubic-bezier(.22,.9,.25,1)";
            });
            commitOneStep(direction);
            renderRestingState();
            state.manualTimer = window.setTimeout(function () {
                if (state.cancelled) return;
                links.forEach(function (link) { link.style.transition = ""; });
                cycleStart = performance.now() + config.settlePause;
                cycleRunning = true;
            }, 660);
        }

        var previousControl = heroWrap.find(".sp-cont-prev");
        var nextControl = heroWrap.find(".sp-cont-next");
        var orbitCounter = heroWrap.find(".slider-nav-counter").addClass("rv-orbit-counter");
        function updateOrbitCounter() {
            if (wordPressSlideController) wordPressSlideController.updateCounter();
            else orbitCounter.text(cardControlIndex + " / " + cardControlTotal);
        }
        updateOrbitCounter();
        previousControl
            .off("click keydown")
            .addClass("rv-orbit-control rv-orbit-control-down")
            .attr({ role: "button", tabindex: "0", "aria-label": "Previous slide" })
            .find("i").attr("class", "fal fa-arrow-down");
        nextControl
            .off("click keydown")
            .addClass("rv-orbit-control rv-orbit-control-up")
            .attr({ role: "button", tabindex: "0", "aria-label": "Next slide" })
            .find("i").attr("class", "fal fa-arrow-up");
        function bindOrbitControl(control, direction) {
            control.on("click.rvWordPressOrbit", function (event) {
                event.preventDefault();
                moveOrbitManually(direction);
                if (wordPressSlideController) wordPressSlideController.move(direction);
            }).on("keydown.rvWordPressOrbit", function (event) {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                moveOrbitManually(direction);
                if (wordPressSlideController) wordPressSlideController.move(direction);
            });
        }
        bindOrbitControl(previousControl, -1);
        bindOrbitControl(nextControl, 1);

        $(window).off("resize.rvWordPressOrbit").on("resize.rvWordPressOrbit", function () {
            if (!cycleRunning) renderRestingState();
        });
        renderRestingState();
        if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            state.frameId = window.requestAnimationFrame(animate);
        }
        wordPressOrbitAnimation = state;
    }

    function validOverlayColor(value, fallback) {
        var color = String(value || "").trim();
        return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
    }

    function clampOverlayOpacity(value, fallback) {
        var amount = Number(value);
        return isFinite(amount) ? Math.max(0, Math.min(100, amount)) : fallback;
    }

    function rgbaFromHex(hex, opacity) {
        var color = validOverlayColor(hex, "#000000").slice(1);
        return "rgba(" + parseInt(color.slice(0, 2), 16) + "," + parseInt(color.slice(2, 4), 16) + "," + parseInt(color.slice(4, 6), 16) + "," + (clampOverlayOpacity(opacity, 0) / 100) + ")";
    }

    function profileHeroOverlay() {
        var profile = window.__RASHIDVERSE_SECTOR_PROFILE__;
        return profile && profile.heroOverlay && typeof profile.heroOverlay === "object" ? profile.heroOverlay : null;
    }

    function overlayStyleFor(slide, profileOverlay) {
        if (profileOverlay) {
            if (profileOverlay.mode === "gradient") {
                var start = rgbaFromHex(profileOverlay.startColor, profileOverlay.startOpacity == null ? 72 : profileOverlay.startOpacity);
                var end = rgbaFromHex(profileOverlay.endColor, profileOverlay.endOpacity == null ? 20 : profileOverlay.endOpacity);
                var direction = profileOverlay.direction === "right" ? "270deg" : "90deg";
                var background = profileOverlay.direction === "center"
                    ? "radial-gradient(ellipse at center," + start + " 0%," + end + " 100%)"
                    : "linear-gradient(" + direction + "," + start + " 0%," + end + " 100%)";
                return ' style="background:' + escapeHtml(background) + ';opacity:1"';
            }
            return ' style="background-color:' + escapeHtml(validOverlayColor(profileOverlay.color, "#000000")) + ';opacity:' + (clampOverlayOpacity(profileOverlay.opacity, 40) / 100) + '"';
        }
        var overlayColor = validOverlayColor(slide.overlayColor, "#000000");
        var overlayOpacity = clampOverlayOpacity(slide.overlayOpacity == null ? 40 : slide.overlayOpacity, 40) / 100;
        return ' style="background-color:' + escapeHtml(overlayColor) + ';opacity:' + overlayOpacity + '"';
    }

    function slideMarkup(slide, index, profileOverlay) {
        var link = safeUrl(slide.link);
        var variantClass = slide.variant === "security" ? " rv-wordpress-security-slide" : slide.variant === "plugin" ? " rv-wordpress-plugin-slide" : "";
        // The profile destination intentionally remains separate from the
        // CTA button destination. It makes the visual hero content act as a
        // profile entry point while the button can lead to a project or CTA.
        var profileLink = safeUrl(slide.profileLink || slide.link);
        var categories = [slide.categoryOne, slide.categoryTwo].filter(Boolean).map(function (category) {
            return '<a href="' + escapeHtml(profileLink) + '">' + escapeHtml(category) + '</a>';
        }).join(" ");
        var background = String(slide.image || "").replace(/["'()\\]/g, "\\$&");
        var backgroundPosition = /^(left|center|right)( (top|center|bottom))?$/i.test(String(slide.imagePosition || "")) ? String(slide.imagePosition) : "center center";
        var style = background ? ' style="background-image:url(\'' + escapeHtml(background) + '\');background-position:' + escapeHtml(backgroundPosition) + '"' : "";
        var overlayStyle = overlayStyleFor(slide, profileOverlay);
        return '<div class="fs-carousel-item' + variantClass + '">' +
            '<div class="fs-carousel-title fl-wrap"><div class="fs-carousel-titlecat">' + categories + '</div>' +
            '<h3><a href="' + escapeHtml(profileLink) + '">' + escapeHtml(slide.title || "Untitled project") + '</a></h3>' +
            (slide.description ? '<p class="rv-hero-description">' + escapeHtml(slide.description) + '</p>' : '') +
            '<a href="' + escapeHtml(link) + '" class="fs-carousel-link' + (slide.variant === "plugin" ? ' rv-open-plugins-link' : '') + '"' + (slide.variant === "plugin" ? ' data-rv-open-plugins="true"' : '') + '>' + escapeHtml(slide.buttonText || 'View Project') + '</a>' +
            '</div>' +
            '<div class="carousle-item-number"><span>' + String(index + 1).padStart(2, "0") + '.</span></div>' +
            '<div class="bg"' + style + '></div><div class="overlay"' + overlayStyle + '></div>' +
            '<a href="' + escapeHtml(profileLink) + '" class="fs-carousel-profile-link" aria-label="Open ' + escapeHtml(slide.title || "profile") + ' profile"></a></div>';
    }

    function carouselOptions() {
        return { infinite: true, slidesToShow: 3, dots: true, arrows: false, centerMode: false, responsive: [
            { breakpoint: 1224, settings: { slidesToShow: 2, centerMode: false } },
            { breakpoint: 768, settings: { slidesToShow: 1, centerMode: true } }
        ] };
    }

    function enablePanelMode() {
        var carousel = $("#dynamic-hero-carousel");
        if (!carousel.length || window.innerWidth < 1025 || isWordPressProfile()) return;
        if (carousel.hasClass("slick-initialized")) carousel.slick("unslick");

        var panels = carousel.children(".fs-carousel-item");
        if (!panels.length) return;
        carousel.addClass("hero-panel-carousel");

        function setActive(index) {
            panels.removeClass("is-active").eq(index).addClass("is-active");
            carousel.closest(".fs-carousel-wrap").find(".slider-nav-counter").text((index + 1) + " / " + panels.length);
        }

        setActive(0);
        carousel.off("mouseenter.heroPanels", ".fs-carousel-item").on("mouseenter.heroPanels", ".fs-carousel-item", function () {
            setActive(panels.index(this));
        });
        carousel.off("mouseenter.heroBg mouseleave.heroBg", ".fs-carousel-title h3, .fs-carousel-link")
            .on("mouseenter.heroBg", ".fs-carousel-title h3, .fs-carousel-link", function () { $(this).closest(".fs-carousel-item").find(".bg").addClass("hov-rot"); })
            .on("mouseleave.heroBg", ".fs-carousel-title h3, .fs-carousel-link", function () { $(this).closest(".fs-carousel-item").find(".bg").removeClass("hov-rot"); });

        var wrap = carousel.closest(".fs-carousel-wrap");
        wrap.find(".sp-cont-prev").off("click").on("click.heroPanels", function (event) {
            event.preventDefault();
            var current = panels.index(panels.filter(".is-active"));
            setActive((current - 1 + panels.length) % panels.length);
        });
        wrap.find(".sp-cont-next").off("click").on("click.heroPanels", function (event) {
            event.preventDefault();
            var current = panels.index(panels.filter(".is-active"));
            setActive((current + 1) % panels.length);
        });

        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(function () {
            var current = panels.index(panels.filter(".is-active"));
            setActive((current + 1) % panels.length);
        }, 4000);
    }

    function renderHero(slides) {
        var carousel = $("#dynamic-hero-carousel");
        if (!carousel.length || !slides.length) return;
        if (carousel.hasClass("slick-initialized")) carousel.slick("unslick");
        window.clearInterval(heroTimer);

        if (isWordPressProfile()) {
            var wordpressOverlay = profileHeroOverlay();
            var currentSlide = 0;
            var wrap = carousel.closest('.fs-carousel-wrap');
            var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            carousel.removeClass("hero-panel-carousel").addClass("rv-wordpress-hero-carousel").html(slideMarkup(slides[0], 0, wordpressOverlay));
            function updateCounter() { wrap.find('.slider-nav-counter').text((currentSlide + 1) + ' / ' + slides.length); }
            function showSlide(direction) {
                currentSlide = (currentSlide + direction + slides.length) % slides.length;
                carousel.stop(true, true);
                var markup = slideMarkup(slides[currentSlide], currentSlide, wordpressOverlay);
                if (reducedMotion) carousel.html(markup);
                else carousel.fadeTo(180, 0, function () { carousel.html(markup).fadeTo(320, 1); });
                updateCounter();
                restartAutoplay();
            }
            function restartAutoplay() {
                window.clearInterval(heroTimer);
                if (slides.length < 2) return;
                heroTimer = window.setInterval(function () {
                    if (!document.hidden && !wrap.closest('.hero-wrap').hasClass('rv-wordpress-folder-open')) showSlide(1);
                }, 5000);
            }
            wordPressSlideController = { move: showSlide, updateCounter: updateCounter };
            function bindFallbackControls() {
                wrap.find('.sp-cont-prev, .sp-cont-next').off('click keydown').attr({ role: 'button', tabindex: '0' }).each(function () {
                    var control = $(this), direction = control.hasClass('sp-cont-prev') ? -1 : 1;
                    control.attr('aria-label', direction < 0 ? 'Previous slide' : 'Next slide').on('click.rvWordPressSlides keydown.rvWordPressSlides', function (event) {
                        if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
                        event.preventDefault();
                        showSlide(direction);
                    });
                });
                updateCounter();
            }
            fetchWordPressOrbitProjects().then(function (projects) {
                renderWordPressOrbit(projects);
                if (!wordPressOrbitAnimation) bindFallbackControls();
                updateCounter();
            });
            updateCounter();
            restartAutoplay();
            return;
        }

        var activeProfileOverlay = profileHeroOverlay();
        carousel.removeClass("hero-panel-carousel rv-wordpress-hero-carousel").html(slides.map(function (slide, index) {
            return slideMarkup(slide, index, activeProfileOverlay);
        }).join(""));
        destroyWordPressOrbit();
        if (window.innerWidth >= 1025) enablePanelMode();
        else if ($.fn.slick) carousel.slick(carouselOptions());
    }

    $(function () {
        $(document).on("click.rvOpenPlugins", "[data-rv-open-plugins]", function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            var trigger = document.querySelector(".rv-wordpress-action-button");
            if (trigger) trigger.click();
        });

        if (!isWordPressProfile()) enablePanelMode();
        var sector = activeSector();
        var heroRequest = "/api/content/hero/" + (sector ? "?sector=" + encodeURIComponent(sector) : "");
        fetch(heroRequest)
            .then(function (response) { return response.ok ? response.json() : []; })
            .then(function (slides) { if (Array.isArray(slides) && slides.length) renderHero(slides); })
            .catch(function () { /* Keep the original template panels when the local API is unavailable. */ });
    });
}(jQuery));
