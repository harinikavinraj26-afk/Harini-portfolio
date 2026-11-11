document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectRows = Array.from(document.querySelectorAll(".project-row"));
  const copyButtons = Array.from(document.querySelectorAll(".copy-btn"));
  const printBtn = document.getElementById("print-btn");

  const closeMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        siteNav.classList.contains("is-open") &&
        !siteNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Project discipline filtering
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.getAttribute("data-filter");

      filterButtons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      projectRows.forEach((row) => {
        const category = row.getAttribute("data-category");
        const shouldShow = selectedFilter === "all" || category === selectedFilter;
        row.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  // Copy contact details with fallback for local file:// viewing
  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    document.body.removeChild(helper);
  };

  copyButtons.forEach((button) => {
    const defaultLabel = button.textContent;
    let resetTimer = null;

    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      if (!value) return;

      try {
        await copyText(value);
        button.textContent = "Copied";
        button.classList.add("is-copied");

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          button.textContent = defaultLabel;
          button.classList.remove("is-copied");
        }, 1800);
      } catch {
        button.textContent = "Copy unavailable";
      }
    });
  });

  // Highlight active section in sticky navigation
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const activeId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const hrefId = link.getAttribute("href")?.replace("#", "");
            link.classList.toggle("is-active", hrefId === activeId);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }
});
