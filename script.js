/* =========================================================
   SnaphAI — interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---- enable JS-gated reveal (no-JS users keep content fully visible) ---- */
  document.documentElement.classList.add("js");

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- logo: show the shipped emblem (assets/logo.svg), fall back to the inline SVG
          if it is missing, then quietly upgrade to the real assets/logo.png if present ---- */
  document.querySelectorAll(".brand__mark").forEach(function (mark) {
    var img = mark.querySelector(".brand__png");
    var svg = mark.querySelector(".brand__svg");
    if (!img) return;
    var show = function () { img.style.display = "block"; if (svg) svg.style.display = "none"; };
    if (img.complete && img.naturalWidth > 0) show();
    img.addEventListener("load", function () { if (img.naturalWidth > 0) show(); });
    img.addEventListener("error", function () { img.style.display = "none"; if (svg) svg.style.display = "block"; });
  });
  // one quiet probe: if the owner has dropped in their real logo.png, use it everywhere
  var logoProbe = new Image();
  logoProbe.onload = function () {
    if (logoProbe.naturalWidth > 0) {
      document.querySelectorAll(".brand__png").forEach(function (im) { im.src = "assets/logo.png"; });
    }
  };
  logoProbe.src = "assets/logo.png";

  /* ---- nav: glass bar on scroll ---- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (burger && mobileMenu) {
    var closeMenu = function () {
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Menüyü aç");
      mobileMenu.hidden = true;
    };
    burger.addEventListener("click", function () {
      var open = burger.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
      mobileMenu.hidden = !open;
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // close if widened to desktop while open (prevents a stray menu on desktop)
    window.addEventListener("resize", function () {
      if (window.innerWidth > 980 && !mobileMenu.hidden) closeMenu();
    });
    // Escape closes and returns focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileMenu.hidden) { closeMenu(); burger.focus(); }
    });
  }

  /* ---- hero phone: swipeable scenario carousel ---- */
  var track = document.getElementById("dmTrack");
  var dotsWrap = document.getElementById("dmDots");
  if (track && dotsWrap) {
    var slides = Array.prototype.slice.call(track.querySelectorAll(".dm-slide"));
    var nameEl = document.getElementById("dmName");
    var avatarEl = document.getElementById("dmAvatar");
    var subEl = document.getElementById("dmSub");
    var current = 0, autoTimer = null, paused = false, resumeT = null;

    slides.forEach(function (s, i) {
      var d = document.createElement("i");
      d.addEventListener("click", function () { goTo(i); pauseAuto(); });
      dotsWrap.appendChild(d);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render(i) {
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
      var s = slides[i];
      if (!s) return;
      if (nameEl) nameEl.textContent = s.dataset.name || nameEl.textContent;
      if (avatarEl) avatarEl.textContent = s.dataset.avatar || avatarEl.textContent;
      if (subEl) subEl.textContent = s.dataset.sub || subEl.textContent;
    }
    function goTo(i) {
      i = (i + slides.length) % slides.length;
      track.scrollTo({ left: track.clientWidth * i, behavior: "smooth" });
      current = i; render(i);
    }

    var scrollT;
    track.addEventListener("scroll", function () {
      window.clearTimeout(scrollT);
      scrollT = window.setTimeout(function () {
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== current) { current = i; render(i); }
      }, 60);
    }, { passive: true });

    function startAuto() {
      if (prefersReduced) return;
      stopAuto();
      autoTimer = window.setInterval(function () { if (!paused) goTo(current + 1); }, 4800);
    }
    function stopAuto() { if (autoTimer) { window.clearInterval(autoTimer); autoTimer = null; } }
    function pauseAuto() {
      paused = true;
      window.clearTimeout(resumeT);
      resumeT = window.setTimeout(function () { paused = false; }, 9000);
    }
    track.addEventListener("pointerenter", function () { paused = true; });
    track.addEventListener("pointerleave", function () { paused = false; });
    track.addEventListener("touchstart", pauseAuto, { passive: true });

    // drag-to-scroll (mouse)
    var isDown = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") { isDown = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft; track.style.cursor = "grabbing"; }
    });
    window.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!isDown) return;
      isDown = false; track.style.cursor = "";
      if (moved) goTo(Math.round(track.scrollLeft / track.clientWidth));
    });

    render(0);
    startAuto();
  }

  /* ---- pricing billing toggle ---- */
  var billingBtns = document.querySelectorAll(".billing-toggle__btn");
  var amounts = document.querySelectorAll(".plan__amount[data-monthly]");
  var wasEls = document.querySelectorAll(".plan__was[data-was]");
  var billNotes = document.querySelectorAll(".plan__billnote[data-monthly]");

  function setBilling(mode) {
    billingBtns.forEach(function (b) {
      var active = b.dataset.billing === mode;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    amounts.forEach(function (el) {
      el.textContent = mode === "yearly" ? el.dataset.yearly : el.dataset.monthly;
    });
    wasEls.forEach(function (el) {
      if (mode === "yearly") { el.textContent = el.dataset.was; el.hidden = false; }
      else { el.hidden = true; }
    });
    billNotes.forEach(function (el) {
      el.textContent = mode === "yearly" ? el.dataset.yearly : el.dataset.monthly;
    });
  }
  if (billingBtns.length) {
    billingBtns.forEach(function (b) {
      b.addEventListener("click", function () { setBilling(b.dataset.billing); });
    });
    // initialise from whichever button is marked active in the HTML (defaults to yearly)
    var initActive = document.querySelector(".billing-toggle__btn.is-active");
    setBilling(initActive ? initActive.dataset.billing : "yearly");
  }

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = 0;
          var parent = el.parentElement;
          if (parent) {
            var siblings = Array.prototype.filter.call(parent.children, function (c) {
              return c.classList.contains("reveal");
            });
            var idx = siblings.indexOf(el);
            if (idx > -1) delay = Math.min(idx * 80, 400);
          }
          el.style.transitionDelay = delay + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    // safety net: force-reveal anything still hidden after 3s
    window.setTimeout(function () {
      document.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) { el.classList.add("is-in"); });
    }, 3000);
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- mascot (Lumi) entrance: animate in when scrolled into view ---- */
  var mascotEls = document.querySelectorAll(".mascot");
  if (mascotEls.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      mascotEls.forEach(function (m) { m.classList.add("is-in"); });
    } else {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); mio.unobserve(e.target); }
        });
      }, { threshold: 0.25 });
      mascotEls.forEach(function (m) { mio.observe(m); });
      // safety net: never leave Lumi invisible if the observer misfires
      window.setTimeout(function () {
        document.querySelectorAll(".mascot:not(.is-in)").forEach(function (m) { m.classList.add("is-in"); });
      }, 3500);
    }
  }

  /* ---- animated stat counters ---- */
  var statNums = document.querySelectorAll(".stat__num[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    if (isNaN(target)) return;
    if (prefersReduced) { el.textContent = prefix + target + suffix; return; }
    var dur = 1200, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (statNums.length && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); sio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    statNums.forEach(function (el) { sio.observe(el); });
  }

  /* ---- demo form (frontend only) ---- */
  var form = document.getElementById("demoForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    var looksValid = function (v) {
      return /.+@.+\..+/.test(v) || /^@?[a-zA-Z0-9._]{2,}$/.test(v);
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("demoEmail");
      var val = (input.value || "").trim();
      if (!looksValid(val)) {
        note.textContent = "Lütfen geçerli bir e-posta veya Instagram adı girin.";
        note.classList.remove("is-success");
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      note.textContent = "Teşekkürler! 24 saat içinde WhatsApp'tan ulaşacağız. 🎉";
      note.classList.add("is-success");
      form.reset();
    });
  }
})();
