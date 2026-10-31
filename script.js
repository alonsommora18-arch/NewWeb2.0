// EcoNova — menú móvil, navegación y animaciones
const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".main-nav a");

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  menuToggle.textContent = "Menú";
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  menuToggle.textContent = isOpen ? "Cerrar" : "Menú";
});

navLinks.forEach(link => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("click", event => {
  if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Animaciones al aparecer los elementos en pantalla
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

// Contadores: cuentan desde cero una sola vez cuando la sección entra en pantalla
const statsSection = document.querySelector(".stats-section");
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function animateCounter(element) {
  const target = Number(element.dataset.target);
  const duration = 1500;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString("es-CR");
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting) && !countersStarted) {
    countersStarted = true;
    statsSection.classList.add("is-visible");
    counters.forEach(animateCounter);
    statsObserver.disconnect();
  }
}, { threshold: 0.25 });

if (statsSection) statsObserver.observe(statsSection);

// Año automático en el pie de página si se actualiza el sitio en el futuro
const footerBottom = document.querySelector(".footer-bottom");
if (footerBottom) footerBottom.innerHTML = footerBottom.innerHTML.replace("2026", new Date().getFullYear());
