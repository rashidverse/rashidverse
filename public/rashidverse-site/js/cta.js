(function ($) {
  "use strict";
  $(function () {
    $.getJSON("/api/content/cta/").done(function (items) {
      var item = (items || [])[0];
      if (!item) return;
      var section = $("[data-dynamic-cta]");
      if (!section.length) return;
      section.find("h3").text(item.heading || "Ready To order Your Project ?");
      section.find('.rv-cta-description, .rv-cta-secondary').remove();
      if (item.description) $('<p class="rv-cta-description">').text(item.description).insertAfter(section.find('h3'));
      if (item.secondaryButtonText && /^https:\/\//.test(item.secondaryButtonLink || '')) $('<a class="rv-cta-secondary">').text(item.secondaryButtonText).attr('href', item.secondaryButtonLink).appendTo(section.find('.btn').parent());
      var button = section.find(".btn");
      button.text(item.buttonText || "Get In Touch");
      button.attr("href", item.buttonLink || "contacts.html");
      if (item.buttonTarget === "new") button.attr("target", "_blank").attr("rel", "noopener noreferrer"); else button.removeAttr("target rel");
    });
  });
}(jQuery));
