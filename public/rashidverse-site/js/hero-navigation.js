(function ($) {
  "use strict";
  $(function () {
    var navigation = $(".scroll-nav-wrap");
    var hero = $(".hero-wrap");
    if (!navigation.length || !hero.length) return;

    // Focused profile pages use the same navigation component as the home
    // page. Keep the labelled Portfolio shortcut at the left, then add a
    // separate folder-menu trigger after the one-page menu on WordPress.
    if (String(window.__RASHIDVERSE_ACTIVE_SECTOR__ || "").toLowerCase() === "wordpress") {
      var onePageMenu = navigation.children(".scroll-nav");
      if (onePageMenu.length && !navigation.children(".rv-wordpress-action-button").length) {
                    $("<button type=\"button\" class=\"rv-wordpress-action-button\" aria-label=\"Open WordPress plugins menu\" aria-expanded=\"false\" aria-controls=\"rv-wordpress-folder-menu\" title=\"Open WordPress plugins\"><span class=\"rv-nav-folder\" aria-hidden=\"true\"><span class=\"rv-nav-folder-back\"><span></span></span><span class=\"rv-nav-folder-front\"><span class=\"rv-nav-folder-label\">Plugins</span></span></span></button>").insertAfter(onePageMenu);
        navigation.addClass("rv-wordpress-navigation");
      }
    }

    // The section navigation belongs to the hero first.  It sits at the
    // bottom of the hero, then becomes fixed only after the hero has scrolled
    // out of view.
    hero.append(navigation);
    var navigationHome = $("<span class=\"rv-navigation-home\" aria-hidden=\"true\"></span>");
    navigation.before(navigationHome);

    function updateNavigationPosition() {
      var heroEnd = hero.offset().top + hero.outerHeight() - navigation.outerHeight();
      var shouldStick = $(window).scrollTop() >= heroEnd;

      if (shouldStick && !navigation.hasClass("rv-navigation-sticky")) {
        // Move it out of the hero while fixed: the hero intentionally uses
        // overflow:hidden, which would otherwise clip a fixed child.
        navigation.appendTo("body").addClass("rv-navigation-sticky");
      } else if (!shouldStick && navigation.hasClass("rv-navigation-sticky")) {
        navigationHome.after(navigation.removeClass("rv-navigation-sticky"));
      }
    }

    $(window).on("scroll resize load", updateNavigationPosition);
    updateNavigationPosition();
  });
}(jQuery));
