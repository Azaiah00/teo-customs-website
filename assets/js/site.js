/* Teo Customs Paint & Body — site interactions (vanilla, no dependencies) */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- Header: scrolled state ---------- */
  var header = $(".site-header");
  function onScrollHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $(".menu-btn");
  var menu = $("#mobile-menu");
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.querySelector(".mb-label").textContent = open ? "Close" : "Menu";
    menu.hidden = !open;
    doc.body.classList.toggle("menu-open", open);
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus();
    }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuBtn.focus();
      }
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1000 && menuBtn.getAttribute("aria-expanded") === "true") setMenu(false);
    });
  }

  /* ---------- Today's hours highlight ---------- */
  var today = new Date().getDay(); // 0 = Sunday
  $$("[data-day]").forEach(function (row) {
    if (parseInt(row.getAttribute("data-day"), 10) === today) row.classList.add("today");
  });

  /* ---------- Generic in-view observer ---------- */
  function onView(els, cb, opts) {
    if (!els.length) return;
    if (!hasIO) { els.forEach(function (el) { cb(el); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { cb(en.target); io.unobserve(en.target); }
      });
    }, opts || { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }

  // Reveal, tape peel
  onView($$(".reveal, .peel"), function (el) { el.classList.add("in"); });

  // Spray-mist reveal for portfolio imagery
  var mists = $$(".mist");
  mists.forEach(function (el, i) {
    // vary the "nozzle" origin a little so each tile feels hand-sprayed
    var mx = [38, 62, 50, 30, 70, 45][i % 6];
    var my = [44, 58, 36, 62, 40, 55][i % 6];
    el.style.setProperty("--mx", mx + "%");
    el.style.setProperty("--my", my + "%");
  });
  onView(mists, function (el) {
    el.classList.add("in");
    if (reduceMotion) { el.classList.add("done"); return; }
    setTimeout(function () { el.classList.add("done"); }, 1600);
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  /* ---------- Count-up ---------- */
  onView($$("[data-count]"), function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var final = target.toFixed(decimals);
    if (reduceMotion || isNaN(target)) { el.textContent = final; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = clamp((ts - start) / dur, 0, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step); else el.textContent = final;
    }
    el.textContent = (0).toFixed(decimals);
    requestAnimationFrame(step);
  }, { threshold: 0.4 });

  /* ---------- Clearcoat sweep (load + scroll scrub) ---------- */
  var coats = $$("[data-sweep]");
  if (coats.length && !reduceMotion) {
    coats.forEach(function (sec) {
      var band = sec.querySelector(".clearcoat-band");
      var targets = [sec].concat($$(".clearcoat", sec));
      targets.forEach(function (t) { t.classList.add("sweeping"); });
      var done = false;
      function toScrub() {
        if (done) return;
        done = true;
        targets.forEach(function (t) { t.classList.remove("sweeping"); t.classList.add("scrub"); });
        update();
      }
      if (band) band.addEventListener("animationend", toScrub, { once: true });
      setTimeout(toScrub, 2600);

      var ticking = false;
      function update() {
        ticking = false;
        if (!done) return;
        var r = sec.getBoundingClientRect();
        var p = clamp(-r.top / Math.max(r.height * 0.9, 1), 0, 1);
        sec.style.setProperty("--p", p.toFixed(4));
      }
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
    });
  }

  /* ---------- Before / after sliders ---------- */
  $$(".ba").forEach(function (ba) {
    var handle = ba.querySelector(".ba-handle");
    var pos = 50, userTouched = false, dragging = false;

    function set(v) {
      pos = clamp(v, 0, 100);
      ba.style.setProperty("--pos", pos + "%");
      if (handle) {
        handle.setAttribute("aria-valuenow", String(Math.round(pos)));
        handle.setAttribute("aria-valuetext", Math.round(pos) + "% before, " + (100 - Math.round(pos)) + "% after");
      }
    }
    function fromPointer(e) {
      var r = ba.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    }
    set(50);

    ba.addEventListener("pointerdown", function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      userTouched = true;
      dragging = true;
      ba.classList.add("dragging");
      if (ba.setPointerCapture) { try { ba.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
      fromPointer(e);
      if (handle && e.pointerType === "mouse") handle.focus({ preventScroll: true });
    });
    ba.addEventListener("pointermove", function (e) { if (dragging) fromPointer(e); });
    function stop() { dragging = false; ba.classList.remove("dragging"); }
    ba.addEventListener("pointerup", stop);
    ba.addEventListener("pointercancel", stop);
    ba.addEventListener("lostpointercapture", stop);

    if (handle) {
      handle.addEventListener("keydown", function (e) {
        var step = e.shiftKey ? 10 : 2;
        var handled = true;
        switch (e.key) {
          case "ArrowLeft": case "ArrowDown": set(pos - step); break;
          case "ArrowRight": case "ArrowUp": set(pos + step); break;
          case "PageDown": set(pos - 10); break;
          case "PageUp": set(pos + 10); break;
          case "Home": set(0); break;
          case "End": set(100); break;
          default: handled = false;
        }
        if (handled) { e.preventDefault(); userTouched = true; }
      });
    }

    // One-time auto-wipe when the slider scrolls into view
    if (!reduceMotion) {
      onView([ba], function () {
        var keys = [[0, 50], [0.34, 88], [0.72, 14], [1, 50]];
        var dur = 2600, start = null;
        function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
        function frame(ts) {
          if (userTouched) return;
          if (!start) start = ts;
          var t = clamp((ts - start) / dur, 0, 1);
          for (var i = 1; i < keys.length; i++) {
            if (t <= keys[i][0]) {
              var a = keys[i - 1], b = keys[i];
              var local = ease((t - a[0]) / (b[0] - a[0]));
              set(a[1] + (b[1] - a[1]) * local);
              break;
            }
          }
          if (t < 1) requestAnimationFrame(frame);
        }
        setTimeout(function () { requestAnimationFrame(frame); }, 250);
      }, { threshold: 0.55 });
    }
  });

  /* ---------- Portfolio filters ---------- */
  var chips = $$(".chip[data-filter]");
  var items = $$(".grid-work > li");
  var status = $("#filter-status");
  function applyFilter(f) {
    var shown = 0;
    items.forEach(function (li) {
      var cats = (li.getAttribute("data-cat") || "").split(" ");
      var show = f === "all" || cats.indexOf(f) !== -1;
      li.hidden = !show;
      if (show) shown++;
    });
    chips.forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-filter") === f ? "true" : "false"); });
    if (status) {
      var label = f === "all" ? "all categories" : f;
      status.textContent = "Showing " + shown + " project photo" + (shown === 1 ? "" : "s") + " in " + label + ".";
    }
  }
  chips.forEach(function (c) {
    c.addEventListener("click", function () { applyFilter(c.getAttribute("data-filter")); });
  });

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = $("img", lb), lbCap = $(".lb-cap", lb), lbCount = $(".lb-count", lb);
    var links = $$("[data-lightbox]");
    var current = 0, opener = null;

    function visibleLinks() {
      return links.filter(function (a) { var li = a.closest("li"); return !li || !li.hidden; });
    }
    function show(i) {
      var list = visibleLinks();
      if (!list.length) return;
      current = (i + list.length) % list.length;
      var a = list[current];
      var img = a.querySelector("img");
      lbImg.src = a.getAttribute("href");
      lbImg.alt = img ? img.alt : "";
      lbCap.innerHTML = "";
      var t = doc.createElement("span");
      t.textContent = a.getAttribute("data-title") || "";
      lbCap.appendChild(t);
      var sub = a.getAttribute("data-sub");
      if (sub) { var s = doc.createElement("small"); s.textContent = sub; lbCap.appendChild(s); }
      lbCount.textContent = (current + 1) + " / " + list.length;
    }
    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        opener = a;
        var list = visibleLinks();
        show(list.indexOf(a));
        lb.showModal();
        doc.body.classList.add("menu-open");
      });
    });
    $(".lb-close", lb).addEventListener("click", function () { lb.close(); });
    $(".lb-prev", lb).addEventListener("click", function () { show(current - 1); });
    $(".lb-next", lb).addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb-stage")) lb.close();
    });
    lb.addEventListener("close", function () {
      doc.body.classList.remove("menu-open");
      if (opener) opener.focus();
    });
    // swipe
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- Services jump nav: active section ---------- */
  var jumpLinks = $$(".jump a[href^='#']");
  if (jumpLinks.length && hasIO) {
    var map = {}, order = [], visible = {};
    jumpLinks.forEach(function (a) { var id = a.getAttribute("href").slice(1); map[id] = a; order.push(id); });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = null;
      for (var i = 0; i < order.length; i++) { if (visible[order[i]]) { current = order[i]; break; } }
      jumpLinks.forEach(function (a) { a.classList.remove("active"); a.removeAttribute("aria-current"); });
      if (current && map[current]) {
        map[current].classList.add("active");
        map[current].setAttribute("aria-current", "true");
      }
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) sio.observe(s); });
  }

  /* ---------- Estimate form ---------- */
  var form = $("#estimate-form");
  if (form) {
    var success = $("#estimate-success");
    var alertBox = $("#form-alert");
    var fileInput = $("#photos");
    var fileList = $("#file-list");
    var drop = $(".drop", form);
    var MAX_FILES = 5, MAX_BYTES = 8 * 1024 * 1024;

    function showSuccess() {
      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
      success.scrollIntoView({ block: "center" });
    }
    if (/[?&]sent=1/.test(window.location.search)) showSuccess();

    function fieldOf(el) { return el.closest(".field"); }
    function setErr(el, msg) {
      var f = fieldOf(el);
      if (!f) return;
      var e = f.querySelector(".err");
      if (msg) {
        f.classList.add("invalid");
        if (e) e.textContent = msg;
        el.setAttribute("aria-invalid", "true");
      } else {
        f.classList.remove("invalid");
        el.removeAttribute("aria-invalid");
      }
    }
    function validate(el) {
      if (el.type === "radio") {
        var group = form.querySelectorAll("input[name='" + el.name + "']");
        var anyChecked = Array.prototype.some.call(group, function (r) { return r.checked; });
        var req = group[0].hasAttribute("required");
        setErr(group[0], req && !anyChecked ? "Please choose one." : "");
        return !req || anyChecked;
      }
      if (el.type === "file") {
        var files = el.files ? Array.prototype.slice.call(el.files) : [];
        var total = files.reduce(function (s, f) { return s + f.size; }, 0);
        var msg = "";
        if (files.length > MAX_FILES) msg = "Please choose up to " + MAX_FILES + " photos.";
        else if (total > MAX_BYTES) msg = "Photos are over 8 MB total. Choose fewer photos, or text them to (804) 852-2954.";
        else if (files.some(function (f) { return f.type && f.type.indexOf("image/") !== 0; })) msg = "Photos only, please (JPG, PNG or HEIC).";
        setErr(el, msg);
        return !msg;
      }
      var v = (el.value || "").trim();
      var m = "";
      if (el.required && !v) m = el.getAttribute("data-msg") || "This field is required.";
      else if (v && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) m = "Please enter a valid email address.";
      else if (v && el.type === "tel" && v.replace(/\D/g, "").length < 10) m = "Please enter a 10-digit phone number.";
      else if (v && el.name === "vehicle_year" && !/^(19|20)\d{2}$/.test(v)) m = "Please enter a 4-digit year, like 2019.";
      setErr(el, m);
      return !m;
    }
    $$("input, select, textarea", form).forEach(function (el) {
      if (el.type === "hidden" || el.name === "bot-field") return;
      el.addEventListener("blur", function () { if (el.type !== "radio" && el.type !== "file") validate(el); });
      el.addEventListener("change", function () { validate(el); });
      el.addEventListener("input", function () { if (fieldOf(el) && fieldOf(el).classList.contains("invalid")) validate(el); });
    });

    // Email required only when the customer prefers email
    var emailEl = $("#email");
    $$("input[name='preferred_contact']", form).forEach(function (r) {
      r.addEventListener("change", function () {
        var needEmail = r.checked && r.value === "Email";
        if (r.checked) {
          emailEl.required = needEmail;
          var opt = $("#email-opt");
          if (opt) opt.textContent = needEmail ? "(required for email replies)" : "(optional)";
          if (!needEmail) setErr(emailEl, "");
        }
      });
    });

    // File previews
    if (fileInput && fileList) {
      fileInput.addEventListener("change", function () {
        fileList.innerHTML = "";
        Array.prototype.slice.call(fileInput.files || []).slice(0, 10).forEach(function (f) {
          var li = doc.createElement("li");
          if (f.type && f.type.indexOf("image/") === 0 && window.URL && URL.createObjectURL) {
            var im = doc.createElement("img");
            im.alt = "";
            im.width = 40; im.height = 40;
            im.src = URL.createObjectURL(f);
            im.onload = function () { URL.revokeObjectURL(im.src); };
            li.appendChild(im);
          }
          var sp = doc.createElement("span");
          sp.textContent = f.name;
          li.appendChild(sp);
          fileList.appendChild(li);
        });
      });
      ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.add("over"); }); });
      ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.remove("over"); }); });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alertBox.hidden = true;
      var ok = true, firstBad = null;
      $$("input, select, textarea", form).forEach(function (el) {
        if (el.type === "hidden" || el.name === "bot-field") return;
        if (!validate(el)) { ok = false; if (!firstBad) firstBad = el; }
      });
      if (!ok) {
        alertBox.textContent = "Please fix the highlighted fields and try again.";
        alertBox.hidden = false;
        if (firstBad) firstBad.focus();
        return;
      }
      var btn = form.querySelector("button[type='submit']");
      var label = btn.querySelector(".lbl");
      btn.disabled = true;
      label.textContent = "Sending...";
      fetch(form.getAttribute("action") || "/", { method: "POST", body: new FormData(form) })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          showSuccess();
        })
        .catch(function () {
          alertBox.textContent = "We couldn't send your request just now. Please call or text (804) 852-2954, or email teo_customs@outlook.com with your photos.";
          alertBox.hidden = false;
          alertBox.focus();
        })
        .then(function () {
          btn.disabled = false;
          label.textContent = "Send my photo estimate request";
        });
    });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
