// Mobile navigation toggles an accessible compact menu on small screens.
const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => { const open = siteNav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', open); });

// Custom regex rules produce immediate inline validation
const form = document.getElementById('studentForm');
const rules = {
  name: { 
    regex: /^[A-Za-z][A-Za-z .'-]{1,49}$/, 
    message: 'Use at least 2 letters; numbers and special symbols are not allowed.' },
  email: { 
    regex: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?(com|edu|ac\.[a-z]{2})$/i, 
    message: 'Use your institutional address, e.g. student.id@bse.ac.mu.' },
  studentId: { 
    regex: /^BSE-\d{4}-\d{3,4}$/i, 
    message: 'Use the format BSE-2026-1234.' },
  interest: { 
    regex: /^.{3,80}$/, 
    message: 'Tell us a little more (3-80 characters).' }
};

function validate(id) { 
  const input = document.getElementById(id); 
  const error = document.querySelector(`[data-error-for="${id}"]`); 
  const valid = rules[id].regex.test(input.value.trim()); 
  input.classList.toggle('is-valid', valid); 
  input.classList.toggle('is-invalid', input.value !== '' && !valid); 
  error.textContent = valid || input.value === '' ? '' : rules[id].message; return valid; }

Object.keys(rules).forEach((id) => ['input', 'blur'].forEach((eventName) => 
  document.getElementById(id).addEventListener(eventName, () => validate(id))));
form.addEventListener('submit', (event) => { event.preventDefault(); 
  if (!Object.keys(rules).every(validate)) 
    return; localStorage.setItem('studentProfile', JSON.stringify(Object.fromEntries(Object.keys(rules).map((id) => [id, 
  document.getElementById(id).value.trim()])))); window.location.href = 'gcgo.html'; });

// Sections enter once as the student scrolls, keeping motion purposeful and lightweight.
const revealTargets = document.querySelectorAll('.reveal-on-scroll');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.16 });
revealTargets.forEach((target) => revealObserver.observe(target));
