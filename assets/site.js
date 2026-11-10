// Código compartido por la versión en español (/) y en inglés (/en/).
(function () {
  var lang = document.documentElement.lang === "en" ? "en" : "es";
  var t = {
    es: { copied: "Copiado", copy: "Copiar email" },
    en: { copied: "Copied", copy: "Copy email" }
  }[lang];

  // Language links: remember the choice so "/" sends returning visitors to their language
  document.querySelectorAll(".lang a[hreflang]").forEach(function (a) {
    a.addEventListener("click", function () {
      try { localStorage.setItem("lang", a.getAttribute("hreflang")); } catch (e) {}
    });
  });

  // Hero loop: stay still for people who prefer reduced motion
  var loop = document.getElementById("loop");
  if (loop && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    loop.removeAttribute("autoplay");
    loop.pause();
  }

  // Reel: play inline when the page is the top window, otherwise open YouTube
  var player = document.getElementById("reel-player");
  player.addEventListener("click", function (e) {
    if (window.top !== window.self) return;
    e.preventDefault();
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/Uw_nsOB_RGY?autoplay=1&rel=0&modestbranding=1";
    f.title = "Carlos de Tomás · Showreel";
    f.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    f.allowFullscreen = true;
    player.replaceChildren(f);
    player.classList.add("playing");
    player.removeAttribute("href");
  });

  // Email: assembled here so it never appears whole in the HTML (keeps most spam bots away)
  var email = document.getElementById("email");
  var address = email.dataset.user + "@" + email.dataset.domain;
  email.textContent = address;
  email.href = "mailto:" + address;

  var copy = document.getElementById("copy");
  copy.addEventListener("click", function () {
    var done = function () {
      copy.textContent = t.copied;
      setTimeout(function () { copy.textContent = t.copy; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(done, function () { selectText(email); });
    } else { selectText(email); }
  });
  function selectText(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  // Lightbox
  var items = Array.prototype.slice.call(document.querySelectorAll(".still"));
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbInfo = document.getElementById("lb-info");
  var idx = 0, lastFocus = null;
  function show(i) {
    idx = (i + items.length) % items.length;
    var it = items[idx], img = it.querySelector("img");
    lbImg.src = it.dataset.full;
    lbImg.alt = img.alt;
    lbInfo.textContent = String(idx + 1).padStart(2, "0") + " / " + String(items.length).padStart(2, "0");
  }
  items.forEach(function (it, i) {
    it.querySelector("button").addEventListener("click", function () {
      lastFocus = document.activeElement;
      show(i); lb.hidden = false; document.body.style.overflow = "hidden";
      document.getElementById("lb-close").focus();
    });
  });
  function close() {
    lb.hidden = true; document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById("lb-close").addEventListener("click", close);
  document.getElementById("lb-prev").addEventListener("click", function () { show(idx - 1); });
  document.getElementById("lb-next").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-stage")) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });
})();
