tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#f8f9fa",
        tertiary: "#2e2100",
        surface: "#f8f9fa",
        "inverse-primary": "#a3cce1",
        "on-secondary": "#ffffff",
        "on-error-container": "#93000a",
        "outline-variant": "#c1c7cc",
        "surface-container": "#edeeef",
        "on-tertiary-fixed-variant": "#5a4400",
        "on-surface-variant": "#41484b",
        "surface-dim": "#d9dadb",
        "on-surface": "#191c1d",
        "surface-variant": "#e1e3e4",
        secondary: "#8e4e14",
        "on-error": "#ffffff",
        "primary-fixed-dim": "#a3cce1",
        "on-primary-fixed": "#001f2a",
        "surface-container-highest": "#e1e3e4",
        "secondary-fixed-dim": "#ffb780",
        "surface-container-low": "#f3f4f5",
        "on-secondary-fixed": "#2f1400",
        "on-tertiary-container": "#c09e48",
        error: "#ba1a1a",
        primary: "#002734",
        "surface-container-lowest": "#ffffff",
        "secondary-fixed": "#ffdcc4",
        "tertiary-fixed": "#ffdf96",
        "on-tertiary": "#ffffff",
        "on-primary": "#ffffff",
        "on-secondary-container": "#783d01",
        "on-tertiary-fixed": "#251a00",
        "primary-fixed": "#bfe9fe",
        "on-secondary-fixed-variant": "#6f3800",
        "primary-container": "#0f3d4e",
        "tertiary-fixed-dim": "#e7c268",
        "tertiary-container": "#483600",
        "secondary-container": "#ffab69",
        outline: "#71787c",
        "inverse-on-surface": "#f0f1f2",
        "error-container": "#ffdad6",
        "surface-container-high": "#e7e8e9",
        "on-background": "#191c1d",
        "on-primary-fixed-variant": "#214c5d",
        "surface-tint": "#3b6476",
        "surface-bright": "#f8f9fa",
        "on-primary-container": "#7fa8bc",
        "inverse-surface": "#2e3132"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        "margin-mobile": "24px",
        gutter: "32px",
        "touch-target-min": "48px",
        "container-max": "1280px",
        unit: "8px"
      },
      fontFamily: {
        "headline-md": ["\"Source Serif 4\""],
        "display-lg-mobile": ["\"Source Serif 4\""],
        "display-lg": ["\"Source Serif 4\""],
        "body-md": ["Atkinson Hyperlegible Next"],
        "label-lg": ["Atkinson Hyperlegible Next"],
        "label-md": ["Atkinson Hyperlegible Next"],
        "headline-lg": ["\"Source Serif 4\""],
        "body-lg": ["Atkinson Hyperlegible Next"]
      },
      fontSize: {
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "display-lg-mobile": ["40px", { lineHeight: "48px", fontWeight: "700" }],
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "label-lg": ["16px", { lineHeight: "24px", letterSpacing: "0.01em", fontWeight: "700" }],
        "label-md": ["14px", { lineHeight: "20px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "body-lg": ["20px", { lineHeight: "30px", fontWeight: "400" }]
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-8");
      }
    });
  }, observerOptions);

  document.querySelectorAll("section > div").forEach((el) => {
    el.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-8");
    observer.observe(el);
  });

  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      const expanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("hidden");
      mobileMenuButton.querySelector("span").textContent = expanded ? "menu" : "close";
    });
  }

  const header = document.querySelector("header");
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle("shadow-lg", window.scrollY > 20);
    };

    toggleHeaderShadow();
    window.addEventListener("scroll", toggleHeaderShadow, { passive: true });
  }
});
