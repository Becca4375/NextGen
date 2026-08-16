document.querySelectorAll('.site-header').forEach((header) => {
  const button = header.querySelector('.menu-toggle');
  const nav = header.querySelector('.site-nav, .nav');
  if (!button || !nav) return;
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
});

const page = location.pathname.split('/').pop() || 'home.html';
document.querySelectorAll('.site-nav a, .nav a, .footer-links a, .footer-nav a').forEach((link) => {
  if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
});
