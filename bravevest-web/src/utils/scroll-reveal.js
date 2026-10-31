// Automatically add .reveal to sections and observe them
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section, .card, .feature-block').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Parallax effect on hero image
export function initParallax() {
  const heroImg = document.querySelector('.hero__image');
  if (!heroImg) return;
  window.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 50;
    const y = (window.innerHeight / 2 - e.pageY) / 50;
    heroImg.style.transform = `perspective(1000px) rotateX(${5 - y}deg) rotateY(${x}deg) scale(1.02)`;
  });
}
