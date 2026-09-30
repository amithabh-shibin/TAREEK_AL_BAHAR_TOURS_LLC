/* TAREEK AL BAHAR TOURS LLC — minimal site scripts */
(function () {
  "use strict";

  // Shared header navigation (loaded from components/header.html)
  function initHeaderControls() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("main-nav");
    if (toggle && nav && !toggle.dataset.bound) {
      toggle.dataset.bound = "1";
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    document.querySelectorAll(".lang-option").forEach(function (btn) {
      if (btn.dataset.bound) return; btn.dataset.bound = "1";
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        if (lang === "zh") lang = "zh-CN";
        switchLanguage(lang);
        var sw = btn.closest(".lang-switcher");
        if (sw) sw.classList.remove("is-open");
      });
    });
    var langBtn = document.querySelector(".lang-btn");
    if (langBtn && !langBtn.dataset.bound) {
      langBtn.dataset.bound = "1";
      langBtn.addEventListener("click", function () {
        langBtn.closest(".lang-switcher").classList.toggle("is-open");
      });
    }
    updateLanguageUi(localStorage.getItem("siteLanguage") || "en");
  }
  document.addEventListener("componentsLoaded", initHeaderControls);

  // Enquiry forms: no backend yet, so hand the enquiry over to WhatsApp.
  // Replace the data-whatsapp number (or the whole handler) when the site moves to WordPress.
  document.querySelectorAll("form[data-enquiry]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lines = ["New enquiry from the website"];
      new FormData(form).forEach(function (value, key) {
        if (value) { lines.push(key + ": " + value); }
      });
      var url = "https://wa.me/" + form.getAttribute("data-whatsapp") + "?text=" + encodeURIComponent(lines.join("\n"));
      var status = form.querySelector(".form__status");
      if (status) { status.classList.add("is-visible"); }
      window.open(url, "_blank", "noopener");
      form.reset();
    });
  });

  // Homepage hero slideshow
  var hero = document.querySelector("[data-hero-slider]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero__slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero__dot"));
    var currentSlide = 0;
    function showSlide(n) {
      slides.forEach(function(s,i){ s.classList.toggle("is-active",i===n); });
      dots.forEach(function(d,i){ d.classList.toggle("is-active",i===n); });
      currentSlide=n;
    }
    dots.forEach(function(d,i){ d.addEventListener("click",function(){showSlide(i);}); });
    if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var sliderTimer;
      function startSlider(){ clearInterval(sliderTimer); sliderTimer=window.setInterval(function(){ showSlide((currentSlide+1)%slides.length); },3200); }
      startSlider();
      var prev=hero.querySelector(".hero__arrow--prev"), next=hero.querySelector(".hero__arrow--next");
      if(prev) prev.addEventListener("click",function(){showSlide((currentSlide-1+slides.length)%slides.length);startSlider();});
      if(next) next.addEventListener("click",function(){showSlide((currentSlide+1)%slides.length);startSlider();});
    }
  }

  // Reveal sections on scroll
  var revealSections=document.querySelectorAll(".reveal-section");
  if("IntersectionObserver" in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});},{threshold:.12});
    revealSections.forEach(function(section){observer.observe(section);});
  }else{revealSections.forEach(function(section){section.classList.add("is-visible");});}

  // Full-page English / Chinese / Arabic translator.
  // Google Translate handles all visible page content, including headings,
  // paragraphs, cards, forms, FAQs, footer text and shared navigation.
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: "en",
      includedLanguages: "en,zh-CN,ar",
      autoDisplay: false
    }, "google_translate_element");

    // Apply a saved language after the Google selector is ready.
    var saved = localStorage.getItem("siteLanguage") || "en";
    var tries = 0;
    var timer = setInterval(function () {
      var combo = document.querySelector(".goog-te-combo");
      if (combo) {
        clearInterval(timer);
        if (saved !== "en" && combo.value !== saved) {
          combo.value = saved;
          combo.dispatchEvent(new Event("change"));
        }
      }
      if (++tries > 50) clearInterval(timer);
    }, 100);
  };

  function updateLanguageUi(lang) {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    var label = document.querySelector(".lang-btn span");
    if (label) label.textContent = lang === "zh-CN" ? "中文" : lang === "ar" ? "عربي" : "EN";
  }

  function switchLanguage(lang) {
    localStorage.setItem("siteLanguage", lang);
    updateLanguageUi(lang);
    var combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
      if (lang === "en") {
        // Returning to the original language is most reliable with a reload.
        document.cookie = "googtrans=/en/en;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "googtrans=/en/en;path=/;domain=" + location.hostname + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
        location.reload();
      }
    }
  }


})();
