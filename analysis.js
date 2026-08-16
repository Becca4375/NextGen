// Animate the dashboard as it enters view so the figures feel responsive to the student profile.
const analysisMain = document.querySelector('.dashboard-main');
const formatMetric = (value, source) => source.includes('+') ? `${Math.round(value).toLocaleString()}+` : source.includes('mo') ? `${Math.round(value)} mo` : source.includes('/') ? `4/4` : `${Math.round(value)}%`;

const animateMetrics = () => {
  document.querySelectorAll('.metric-card strong').forEach((metric) => {
    const source = metric.textContent.trim();
    const target = Number(source.replace(/[^0-9.]/g, ''));
    const started = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - started) / 850, 1);
      metric.textContent = formatMetric(target * (1 - Math.pow(1 - progress, 3)), source);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
  analysisMain?.classList.add('analysis-active');
};

if (analysisMain && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
    if (entry.isIntersecting) { animateMetrics(); observer.unobserve(entry.target); }
  }), { threshold: .18 }).observe(analysisMain);
} else {
  analysisMain?.classList.add('analysis-active');
}

document.querySelectorAll('.fit-table tbody tr').forEach((row) => {
  row.tabIndex = 0;
  row.setAttribute('role', 'button');
  row.setAttribute('aria-label', `View ${row.cells[0].textContent} recommendation`);
  const select = () => document.querySelectorAll('.fit-table tbody tr').forEach((item) => item.classList.toggle('is-selected', item === row));
  row.addEventListener('click', select);
  row.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } });
});

const pathwayData = {
  education: { message: 'Education turns your strengths into practical learning opportunities for others.', action: 'Pilot a peer learning lab', rating: 'High fit' },
  health: { message: 'Health works best when you pair awareness with trusted community partners.', action: 'Run a wellbeing outreach session', rating: 'Strong fit' },
  climate: { message: 'Climate action becomes tangible when you track one visible behaviour change.', action: 'Launch a visible eco-action challenge', rating: 'Growing fit' },
  women: { message: 'Women empowerment thrives through safe spaces, peer support, and leadership opportunities.', action: 'Create a peer mentorship circle', rating: 'Strong fit' }
};

const profile = window.gcgoResult?.profile || {};
const profileMaximum = Math.max(...Object.values(profile).map(Number), 1);
const priorityBars = document.getElementById('priorityBars');
const fitScore = document.getElementById('fitScore');
const pillarMatch = document.getElementById('pillarMatch');
const topFocus = document.getElementById('topFocus');
pillarMatch.textContent = `${Object.entries(profile).filter(([key, value]) => pathwayData[key] && Number(value) > 0).length}/4`;

function renderPriorityBars(activePathway) {
  priorityBars.innerHTML = Object.entries(profile)
    .filter(([key]) => pathwayData[key])
    .sort(([, left], [, right]) => Number(right) - Number(left))
    .map(([key, value]) => {
      const percentage = Math.max(8, Math.round((Number(value) / profileMaximum) * 100));
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `<div class="bar-item ${key === activePathway ? 'is-active' : ''}"><label>${label} <strong>${percentage}%</strong></label><div class="bar"><span style="width:${percentage}%"></span></div></div>`;
    }).join('');
  analysisMain?.classList.add('analysis-active');
}

function selectPathway(pathway) {
  const details = pathwayData[pathway];
  if (!details) return;
  document.querySelectorAll('.pathway-tab').forEach((tab) => {
    const active = tab.dataset.pathway === pathway;
    tab.classList.toggle('is-selected', active);
    tab.setAttribute('aria-selected', String(active));
  });
  const score = Math.min(99, Math.round((Number(profile[pathway]) / profileMaximum) * 100));
  document.getElementById('pathwayMessage').textContent = details.message;
  fitScore.textContent = `${score}%`;
  topFocus.textContent = pathway.charAt(0).toUpperCase() + pathway.slice(1);
  topFocus.closest('tr').cells[2].textContent = details.action;
  topFocus.closest('tr').cells[3].textContent = details.rating;
  renderPriorityBars(pathway);
}

document.querySelectorAll('.pathway-tab').forEach((button) => button.addEventListener('click', () => selectPathway(button.dataset.pathway)));
selectPathway(pathwayData[window.gcgoResult?.topPillar] ? window.gcgoResult.topPillar : 'education');
