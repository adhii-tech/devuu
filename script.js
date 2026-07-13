/* =========================================================
   DEVUU'S BIRTHDAY WORLD — script.js
   Sections:
   1. Utility helpers
   2. Ambient particle canvas
   3. Cursor glow + subtle parallax on mouse move
   4. Scroll reveals (GSAP ScrollTrigger)
   5. Music toggle
   6. Heart bloom -> scroll to letter
   7. Envelope open / letter reveal
   8. Timeline line draw
   9. Gallery lightbox
   10. Before/after scroll-driven split
   11. Love counter
   12. Reasons field (floating cards)
   13. Magical sky canvas (stars + fireflies)
   14. Ending: confetti + petals + final surprise
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- 1. helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 2. ambient particle canvas ---------- */
  (function ambientParticles() {
    const canvas = $("#particle-canvas");
    const ctx = canvas.getContext("2d");
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = document.body.scrollHeight;
    }

    function makeParticles() {
      const count = Math.min(70, Math.floor((w * h) / 60000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rand(1, 3.2),
        speed: rand(0.15, 0.5),
        drift: rand(-0.3, 0.3),
        glow: Math.random() > 0.6,
        opacity: rand(0.25, 0.8),
        twinkle: rand(0.005, 0.02),
        phase: Math.random() * Math.PI * 2,
        isHeart: Math.random() > 0.85,
      }));
    }

    function drawHeart(x, y, size, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 20, size / 20);
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo(-6, -4, -14, 2, 0, 12);
      ctx.bezierCurveTo(14, 2, 6, -4, 0, 4);
      ctx.fillStyle = `rgba(217,168,156,${alpha})`;
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.phase += p.twinkle;
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.phase));
        if (p.isHeart) {
          drawHeart(p.x, p.y, p.r * 5, alpha * 0.7);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.glow
            ? `rgba(232,192,120,${alpha})`
            : `rgba(255,255,255,${alpha})`;
          ctx.shadowBlur = p.glow ? 8 : 0;
          ctx.shadowColor = "rgba(232,192,120,0.8)";
          ctx.fill();
        }
      });
      if (!prefersReducedMotion) requestAnimationFrame(tick);
    }

    resize();
    makeParticles();
    window.addEventListener("resize", () => { resize(); makeParticles(); });
    tick();
  })();

  /* ---------- 3. cursor glow + parallax ---------- */
  const cursorGlow = $("#cursor-glow");
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursorGlow, { x: mouseX, y: mouseY, duration: 0.6, ease: "power3.out" });

    // subtle parallax on blobs
    const relX = (e.clientX / window.innerWidth - 0.5) * 2;
    const relY = (e.clientY / window.innerHeight - 0.5) * 2;
    gsap.to(".blob-a", { x: relX * 18, y: relY * 18, duration: 1.2, ease: "power2.out" });
    gsap.to(".blob-b", { x: relX * -14, y: relY * -14, duration: 1.2, ease: "power2.out" });
    gsap.to(".blob-c", { x: relX * 10, y: relY * 10, duration: 1.2, ease: "power2.out" });
  });

  /* ---------- 4. scroll reveals ---------- */
  $$(".reveal, .reveal-up").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => el.classList.add("is-visible"),
      once: true,
    });
  });

  /* ---------- 5. music toggle ---------- */
  const musicBtn = $("#music-toggle");
  const music = $("#bg-music");
  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch(() => {});
      musicBtn.classList.add("playing");
    } else {
      music.pause();
      musicBtn.classList.remove("playing");
    }
  });

  /* ---------- 6. heart bloom -> scroll ---------- */
  const bloomHeart = $("#bloom-heart");
  const petalBurst = $("#petal-burst");
  let bloomed = false;

  bloomHeart.addEventListener("click", () => {
    if (bloomed) return;
    bloomed = true;
    bloomHeart.classList.add("blooming");

    // build petal burst
    petalBurst.innerHTML = "";
    const total = 18;
    for (let i = 0; i < total; i++) {
      const petal = document.createElement("span");
      const angle = (360 / total) * i;
      const dist = rand(90, 170);
      petal.style.setProperty("--rot", `${angle}deg`);
      petal.style.setProperty("--dist", `${-dist}px`);
      petal.style.background = i % 2 === 0 ? "var(--blush-deep)" : "var(--rose-gold)";
      petalBurst.appendChild(petal);
    }
    petalBurst.classList.add("active");

    setTimeout(() => {
      document.getElementById("letter-section").scrollIntoView({ behavior: "smooth" });
    }, 650);
  });

  /* ---------- 7. envelope open ---------- */
  const envelope = $("#envelope");
  const envelopeHint = $("#envelope-hint");
  envelope.addEventListener("click", () => {
    const isOpen = envelope.classList.toggle("open");
    envelopeHint.textContent = isOpen ? "tap to close" : "tap to open";
  });

  /* ---------- 8. timeline line draw ---------- */
  const timelineLine = $("#timeline-line");
  if (timelineLine) {
    ScrollTrigger.create({
      trigger: ".timeline",
      start: "top 70%",
      onEnter: () => timelineLine.classList.add("is-visible"),
      once: true,
    });
  }

  $$(".timeline-item").forEach((item, i) => {
    gsap.fromTo(
      item,
      { opacity: 0, x: item.dataset.side === "left" ? -40 : 40, filter: "blur(6px)" },
      {
        opacity: 1, x: 0, filter: "blur(0px)",
        duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 85%" },
      }
    );
  });

  /* ---------- 9. gallery lightbox ---------- */
  const lightbox = $("#lightbox");
  const lightboxPhoto = $("#lightbox-photo");
  const lightboxClose = $("#lightbox-close");

  $$(".polaroid").forEach((card) => {
    card.addEventListener("click", () => {
      const photoEl = card.querySelector(".polaroid-photo");
      lightboxPhoto.style.background = getComputedStyle(photoEl).backgroundImage !== "none"
        ? getComputedStyle(photoEl).backgroundImage
        : getComputedStyle(photoEl).background;
      lightbox.classList.add("active");
    });
  });
  lightboxClose.addEventListener("click", () => lightbox.classList.remove("active"));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("active"); });

  gsap.utils.toArray(".polaroid").forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 40, rotate: 0 },
      {
        opacity: 1, y: 0, rotate: card.style.getPropertyValue("--r"),
        duration: 0.8, delay: (i % 3) * 0.08, ease: "back.out(1.4)",
        scrollTrigger: { trigger: card, start: "top 92%" },
      }
    );
  });

  /* ---------- 10. before/after scroll-driven split ---------- */
  const splitDivider = $("#split-divider");
  const splitBefore = $(".split-before");
  const splitAfter = $(".split-after");

  ScrollTrigger.create({
    trigger: "#before-after",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress; // 0 -> 1
      splitDivider.style.left = `${50 + (p - 0.5) * 40}%`;
      splitBefore.style.filter = `saturate(${0.3 + p * 0.7})`;
      splitAfter.style.opacity = `${0.5 + p * 0.5}`;
    },
  });

  /* ---------- 11. love counter ---------- */
  const dateInput = $("#together-date");
  const defaultDate = "04-06-2024"; // <-- edit this default, or use the date picker on the page
  dateInput.value = defaultDate;

  function updateCounter() {
    const start = new Date(dateInput.value || defaultDate).getTime();
    const now = Date.now();
    let diff = Math.max(0, now - start);

    const day = 1000 * 60 * 60 * 24;
    const days = Math.floor(diff / day);
    diff -= days * day;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;
    const seconds = Math.floor(diff / 1000);

    $("#count-days").textContent = days.toLocaleString();
    $("#count-hours").textContent = String(hours).padStart(2, "0");
    $("#count-minutes").textContent = String(minutes).padStart(2, "0");
    $("#count-seconds").textContent = String(seconds).padStart(2, "0");
  }
  updateCounter();
  setInterval(updateCounter, 1000);
  dateInput.addEventListener("change", updateCounter);

  /* ---------- 12. reasons field ---------- */
  const reasonsList = [
    "you smile like a baby.",
    "your eyes make me happy.",
    "you care, quietly, always.",
    "you always support me.",
    "you exist.",
    "your laugh is contagious.",
    "you're cute even when you're grumpy.",
    "you make ordinary days golden.",
    "your voice calms me down.",
    "you're the softest soul I know.",
    "you try, even when it's hard.",
    "you remember little things about me.",
    "you're my favourite hello and hardest goodbye.",
    "you make silence comfortable.",
    "you're endlessly patient with me.",
    "your hugs fix bad days.",
    "you never stop being curious.",
    "you're kind to everyone, always.",
    "you make me want to be better.",
    "you're just&hellip; you.",
  ];

  const reasonsField = $("#reasons-field");
  const reasonEls = reasonsList.map((text) => {
    const el = document.createElement("div");
    el.className = "reason-card glass";
    el.innerHTML = `❤️ Because ${text}`;
    reasonsField.appendChild(el);
    return el;
  });

  function layoutReasons() {
    const fieldW = reasonsField.clientWidth;
    const fieldH = reasonsField.clientHeight;
    const placed = [];

    reasonEls.forEach((el) => {
      let x, y, tries = 0;
      const w = Math.min(220, fieldW * 0.5);
      do {
        x = rand(0, Math.max(0, fieldW - w));
        y = rand(0, Math.max(0, fieldH - 70));
        tries++;
      } while (
        tries < 12 &&
        placed.some((pl) => Math.abs(pl.x - x) < 140 && Math.abs(pl.y - y) < 90)
      );
      placed.push({ x, y });
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.animationDelay = `${rand(0, 3)}s`;
    });
  }
  layoutReasons();
  window.addEventListener("resize", () => layoutReasons());

  ScrollTrigger.batch(reasonEls, {
    start: "top 92%",
    onEnter: (batch) => batch.forEach((el, i) => {
      setTimeout(() => el.classList.add("pop"), i * 90);
    }),
    once: true,
  });

  /* ---------- 13. magical sky ---------- */
  (function magicalSky() {
    const canvas = $("#sky-canvas");
    const ctx = canvas.getContext("2d");
    let w, h, stars, fireflies;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    function build() {
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.85,
        r: rand(0.5, 1.8),
        phase: Math.random() * Math.PI * 2,
        speed: rand(0.01, 0.03),
      }));
      fireflies = Array.from({ length: 18 }, () => ({
        x: Math.random() * w,
        y: h * 0.5 + Math.random() * h * 0.5,
        vx: rand(-0.3, 0.3),
        vy: rand(-0.2, 0.2),
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        s.phase += s.speed;
        const a = 0.4 + 0.6 * Math.sin(s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,248,242,${a})`;
        ctx.fill();
      });
      fireflies.forEach((f) => {
        f.phase += 0.05;
        f.x += f.vx; f.y += f.vy;
        if (f.x < 0 || f.x > w) f.vx *= -1;
        if (f.y < h * 0.4 || f.y > h) f.vy *= -1;
        const a = 0.3 + 0.5 * Math.sin(f.phase);
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,192,120,${a})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(232,192,120,0.9)";
        ctx.fill();
      });
      if (!prefersReducedMotion) requestAnimationFrame(tick);
    }

    resize();
    build();
    window.addEventListener("resize", () => { resize(); build(); });
    tick();
  })();

  /* ---------- 14. ending: confetti + petals + surprise ---------- */
  const petalsFall = $("#petals-fall");
  function spawnPetals(count = 24) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.left = `${Math.random() * 100}%`;
      p.style.background = Math.random() > 0.5 ? "var(--blush-deep)" : "var(--peach)";
      p.style.animationDuration = `${rand(6, 11)}s`;
      p.style.animationDelay = `${rand(0, 4)}s`;
      p.style.opacity = rand(0.5, 0.9);
      petalsFall.appendChild(p);
    }
  }
  spawnPetals();

  const confettiCanvas = $("#confetti-canvas");
  const cctx = confettiCanvas.getContext("2d");
  let confettiPieces = [];

  function resizeConfetti() {
    const rect = confettiCanvas.parentElement.getBoundingClientRect();
    confettiCanvas.width = rect.width;
    confettiCanvas.height = rect.height;
  }
  resizeConfetti();
  window.addEventListener("resize", resizeConfetti);

  function burstConfetti(count = 140) {
    const colors = ["#FBD4DE", "#E4D4F4", "#FFD9B8", "#D9A89C", "#E8C078", "#FFFFFF"];
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height * 0.35,
        vx: rand(-6, 6),
        vy: rand(-9, -2),
        size: rand(4, 9),
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI,
        vr: rand(-0.2, 0.2),
        life: 0,
      });
    }
  }

  function confettiTick() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach((c) => {
      c.vy += 0.18; // gravity
      c.x += c.vx; c.y += c.vy; c.rot += c.vr;
      c.life++;
      cctx.save();
      cctx.translate(c.x, c.y);
      cctx.rotate(c.rot);
      cctx.fillStyle = c.color;
      cctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
      cctx.restore();
    });
    confettiPieces = confettiPieces.filter((c) => c.y < confettiCanvas.height + 40 && c.life < 400);
    requestAnimationFrame(confettiTick);
  }
  confettiTick();

  // trigger a first confetti burst when ending section is reached
  ScrollTrigger.create({
    trigger: "#ending",
    start: "top 60%",
    onEnter: () => burstConfetti(160),
    once: true,
  });

  $("#ending-heart").addEventListener("click", () => burstConfetti(120));

  const finalSurpriseBtn = $("#final-surprise");
  const iLoveYou = $("#i-love-you");
  finalSurpriseBtn.addEventListener("click", () => {
    burstConfetti(220);
    spawnPetals(30);
    iLoveYou.classList.add("show");
    // little heart-explosion ring around the button
    const rect = finalSurpriseBtn.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("span");
      heart.textContent = "❤️";
      heart.style.position = "fixed";
      heart.style.left = `${rect.left + rect.width / 2}px`;
      heart.style.top = `${rect.top}px`;
      heart.style.fontSize = `${rand(14, 26)}px`;
      heart.style.pointerEvents = "none";
      heart.style.zIndex = 60;
      heart.style.transition = "transform 1.2s ease-out, opacity 1.2s ease-out";
      document.body.appendChild(heart);
      requestAnimationFrame(() => {
        const angle = rand(0, Math.PI * 2);
        const dist = rand(80, 220);
        heart.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist - 60}px) scale(1.4)`;
        heart.style.opacity = "0";
      });
      setTimeout(() => heart.remove(), 1300);
    }
  });
});
