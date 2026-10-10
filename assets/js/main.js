document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = themeToggle ? themeToggle.querySelector(".theme-toggle-label") : null;
  const themeIcon = themeToggle ? themeToggle.querySelector(".theme-toggle-icon") : null;
  const storedTheme = localStorage.getItem("theme-preference") || "auto";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function getEffectiveTheme(mode) {
    if (mode === "auto") {
      return systemTheme.matches ? "dark" : "light";
    }

    return mode;
  }

  function updateThemeControl(mode) {
    if (!themeToggle || !themeLabel || !themeIcon) {
      return;
    }

    const effectiveTheme = getEffectiveTheme(mode);
    const labels = {
      auto: "Auto",
      dark: "Dark",
      light: "Light"
    };
    const icons = {
      auto: "◐",
      dark: "☾",
      light: "☀"
    };

    themeToggle.dataset.mode = mode;
    themeToggle.dataset.effectiveTheme = effectiveTheme;
    themeToggle.setAttribute("aria-label", "Theme: " + labels[mode]);
    themeLabel.textContent = labels[mode];
    themeIcon.textContent = icons[mode];
  }

  function applyTheme(mode) {
    if (mode === "auto") {
      root.removeAttribute("data-theme");
      localStorage.removeItem("theme-preference");
    } else {
      root.setAttribute("data-theme", mode);
      localStorage.setItem("theme-preference", mode);
    }

    updateThemeControl(mode);
  }

  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentMode = themeToggle.dataset.mode || "auto";
      const nextMode = currentMode === "auto" ? "dark" : currentMode === "dark" ? "light" : "auto";
      applyTheme(nextMode);
    });
  }

  systemTheme.addEventListener("change", function () {
    if (!root.getAttribute("data-theme")) {
      updateThemeControl("auto");
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      const href = this.getAttribute("href");
      if (href !== "#" && href !== "") {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  // CV → PDF: the print stylesheet renders a clean, white, ink-friendly CV.
  const cvPrintBtn = document.getElementById("cv-print-btn");
  if (cvPrintBtn) {
    cvPrintBtn.addEventListener("click", function () {
      window.print();
    });
  }
});
