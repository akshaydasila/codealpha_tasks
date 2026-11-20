document.addEventListener("DOMContentLoaded", () => {
  // =====================================
  // 1. MOBILE NAVIGATION
  // =====================================

  const menuIcon = document.getElementById("menuIcon");
  const navLinks = document.getElementById("navLinks");

  menuIcon.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuIcon.innerHTML = isOpen
      ? '<i class="fas fa-xmark"></i>'
      : '<i class="fas fa-bars"></i>';

    menuIcon.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");

      menuIcon.innerHTML = '<i class="fas fa-bars"></i>';

      menuIcon.setAttribute("aria-expanded", "false");
    });
  });

  // =====================================
  // 2. DARK / LIGHT MODE
  // =====================================

  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  function updateThemeIcon() {
    const isLight = document.body.classList.contains("light-theme");

    themeToggle.innerHTML = isLight
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';

    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode",
    );
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const theme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";

    localStorage.setItem("portfolio-theme", theme);

    updateThemeIcon();
  });

  // =====================================
  // 3. TYPING ANIMATION
  // =====================================

  const typingElement = document.getElementById("typing");

  const words = [
    "Frontend Developer",
    "React Developer",
    "Web Designer",
    "Problem Solver",
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeEffect() {
    if (!typingElement) return;

    const currentWord = words[wordIndex];

    if (!deleting) {
      charIndex++;

      typingElement.textContent = currentWord.substring(0, charIndex);

      if (charIndex === currentWord.length) {
        deleting = true;

        setTimeout(typeEffect, 1300);

        return;
      }
    } else {
      charIndex--;

      typingElement.textContent = currentWord.substring(0, charIndex);

      if (charIndex === 0) {
        deleting = false;

        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(typeEffect, deleting ? 50 : 100);
  }

  typeEffect();

  // =====================================
  // 4. SCROLL REVEAL ANIMATION
  // =====================================

  const revealElements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });

  // =====================================
  // 5. ACTIVE NAVIGATION ON SCROLL
  // =====================================

  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;

          navItems.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${currentId}`,
            );
          });
        }
      });
    },
    {
      rootMargin: "-30% 0px -60% 0px",
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // =====================================
  // 6. CONTACT FORM
  // =====================================

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitButton = contactForm.querySelector("button");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);

    const originalText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Sending...';

    formStatus.textContent = "";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Message could not be sent.");
      }

      formStatus.textContent =
        "Message sent successfully! Thank you for contacting me.";

      contactForm.reset();
    } catch (error) {
      formStatus.textContent = "Unable to send your message. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });
});
