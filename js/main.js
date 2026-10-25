(() => {
  const config = window.PROXVN_CONFIG || {};

  document.querySelectorAll("[data-contact]").forEach((link) => {
    const href = config[link.dataset.contact];
    if (href) link.href = href;
  });

  const header = document.querySelector(".site-header");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const revealTargets = document.querySelectorAll(
    ".section__head, .price-grid, .works-grid, .steps, .specs, .faq__list, .cta__card, .hero__copy, .hero__art"
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    revealTargets.forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  const filters = document.querySelectorAll(".filter");
  const works = Array.from(document.querySelectorAll(".work"));
  const grid = document.getElementById("worksGrid");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
      const filter = button.dataset.filter;

      works.forEach((work) => {
        work.classList.toggle("is-hidden", filter !== "all" && work.dataset.cat !== filter);
      });

      if (grid) {
        grid.style.minHeight = "";
      }
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxSub = document.getElementById("lightboxSub");
  const closeButton = lightbox?.querySelector(".lightbox__close");
  let current = 0;
  let lastFocus = null;
  let touchStartX = 0;

  const visibleWorks = () => works.filter((work) => !work.classList.contains("is-hidden"));

  const paint = () => {
    const list = visibleWorks();
    const work = list[current];
    if (!work) return;
    const image = work.querySelector("img");
    lightboxImg.src = work.dataset.full || image?.src || "";
    lightboxImg.alt = image?.alt || "";
    lightboxTitle.textContent = work.dataset.title || "";
    lightboxSub.textContent = work.dataset.sub || "";
  };

  const open = (work) => {
    const list = visibleWorks();
    current = Math.max(0, list.indexOf(work));
    lastFocus = document.activeElement;
    paint();
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    closeButton?.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  };

  const step = (delta) => {
    const list = visibleWorks();
    if (!list.length) return;
    current = (current + delta + list.length) % list.length;
    paint();
  };

  works.forEach((work) => {
    work.addEventListener("click", () => open(work));
  });

  closeButton?.addEventListener("click", close);
  lightbox?.querySelector(".lightbox__nav--prev")?.addEventListener("click", () => step(-1));
  lightbox?.querySelector(".lightbox__nav--next")?.addEventListener("click", () => step(1));

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  lightbox?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox?.addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) step(delta > 0 ? -1 : 1);
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });
})();
