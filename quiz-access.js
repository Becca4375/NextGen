// Keeps personalised areas unavailable until a completed quiz has produced a result.
(() => {
  // Analysis is part of the results dashboard, so this old address stays compatible.
  if ((location.pathname.split('/').pop() || '') === 'analysis.html') {
    location.replace('results.html');
    return;
  }

  const allowedPillars = ['education', 'health', 'climate', 'women', 'innovation'];
  try {
    const result = JSON.parse(localStorage.getItem('gcgoResult'));
    if (result && result.completed === true && allowedPillars.includes(result.topPillar) && result.profile) return;
  } catch {}
  const destination = location.pathname.split('/').pop() || 'results.html';
  location.replace(`gcgo.html?returnTo=${encodeURIComponent(destination)}`);
})();
