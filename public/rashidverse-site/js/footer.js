(function ($) {
  "use strict";

  function escapeHtml(value) {
    return $("<div>").text(String(value || "")).html();
  }

  function safeUrl(value) {
    var url = String(value || "").trim();
    return /^(https?:\/\/|\/|\.\/|\.\.\/|#)/i.test(url) ? url : "#";
  }

  function footerHeading(selector, number, value) {
    $(selector).html("<span>" + number + "</span>" + escapeHtml(value));
  }

  $(function () {
    $.getJSON("/api/content/footer/").done(function (items) {
      var item = (items || [])[0];
      if (!item) return;
      var footer = $("[data-dynamic-footer]");
      if (!footer.length) return;

      footer.find("[data-dynamic-footer-site-name]").text(item.siteName || "Rashidverse");
      footerHeading("[data-dynamic-footer-about-heading]", "01.", item.aboutHeading || "About Me");
      footerHeading("[data-dynamic-footer-contact-heading]", "02.", item.contactHeading || "Subscribe / Contacts");
      footer.find("[data-dynamic-footer-about-text]").text(item.aboutText || "");
      footer.find("[data-dynamic-footer-contact-text]").text(item.contactText || "");

      var portfolioButton = footer.find("[data-dynamic-footer-portfolio-button]");
      portfolioButton.text(item.portfolioButtonText || "My Portfolio").attr("href", safeUrl(item.portfolioButtonLink || "/portfolio/"));
      if (item.portfolioButtonTarget === "new") portfolioButton.attr("target", "_blank").attr("rel", "noopener noreferrer");
      else portfolioButton.removeAttr("target rel");

      var subscribe = footer.find("[data-dynamic-footer-subscribe]");
      subscribe.toggle(item.subscribeEnabled !== false);
      footer.find("[data-dynamic-footer-subscribe-input]").attr("placeholder", item.subscribePlaceholder || "Email address");
      footer.find("[data-dynamic-footer-subscribe-button]").html('<i class="fal fa-paper-plane"></i> ' + escapeHtml(item.subscribeButtonText || "Send"));

      var contacts = [
        { icon: "fa-phone", label: "Phone :", value: item.phone, href: item.phone ? "tel:" + String(item.phone).replace(/[^+0-9]/g, "") : "" },
        { icon: "fa-envelope", label: "Email :", value: item.email, href: item.email ? "mailto:" + item.email : "" },
        { icon: "fa-map-marker", label: "Address", value: item.address, href: "" }
      ].filter(function (contact) { return contact.value; });
      footer.find("[data-dynamic-footer-contacts]").html(contacts.map(function (contact) {
        var value = escapeHtml(contact.value);
        return '<li><i class="fal ' + contact.icon + '"></i><span>' + contact.label + '</span>' + (contact.href ? '<a href="' + escapeHtml(contact.href) + '">' + value + "</a>" : "<a>" + value + "</a>") + "</li>";
      }).join(""));

      footer.find("[data-dynamic-footer-copyright]").text("© " + (item.copyright || "Rashidverse. All rights reserved."));
    });
  });
}(jQuery));
