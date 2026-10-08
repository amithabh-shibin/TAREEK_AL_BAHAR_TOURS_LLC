(function () {
  "use strict";
  var BASE = window.location.hostname.indexOf("github.io") !== -1 ? "/TAREEK_AL_BAHAR_TOURS_LLC/" : (function(){ var src = document.currentScript && document.currentScript.src; return src ? new URL("../../", src).pathname : "/"; })();
  async function loadComponent(id, file) {
    var el = document.getElementById(id); if (!el) return;
    try {
      var r = await fetch(BASE + file + "?v=media-20261008-2"); if (!r.ok) throw new Error(file + " " + r.status);
      var html = (await r.text()).replace(/\{\{BASE\}\}/g, BASE);
      el.innerHTML = html;
    } catch (e) { console.error("Component loading error:", e); }
  }
  async function init(){ await Promise.all([loadComponent("site-header","components/header.html"),loadComponent("site-footer","components/footer.html")]); document.dispatchEvent(new CustomEvent("componentsLoaded")); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
