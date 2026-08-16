// Give the recommendation a small arrival moment after the assessment completes.
const resultScore = document.getElementById('scoreValue');
if (resultScore && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const target = Number(resultScore.textContent.replace('%', '')) || 0;
  const start = performance.now();
  resultScore.textContent = '0%';
  const tick = (now) => {
    const progress = Math.min((now - start) / 850, 1);
    resultScore.textContent = `${Math.round(target * (1 - Math.pow(1 - progress, 3)))}%`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
