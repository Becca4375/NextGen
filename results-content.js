const output = JSON.parse(localStorage.getItem('gcgoResult'));
const pillarMap = {
  education: { 
    title: 'Education', 
    text: 'Your profile suggests strong potential in learning-focused, skills-building projects that help students grow with confidence.', 
    idea: 'Digital literacy workshops for young students and community leaders.', 
    next: 'Launch a short pilot program with 2–3 sessions and collect participant feedback for improvement.', 
    approach: 'Use mentoring, measurable learning outcomes, and follow-up sessions to create ongoing growth.' },
  health: { 
    title: 'Health', 
    text: 'Your profile matches well with health outreach, awareness-building, and improved community wellbeing.', 
    idea: 'Community wellness awareness campaign focused on healthy habits and local support.', 
    next: 'Start with a community needs assessment and create a simple awareness plan with trusted partners.', 
    approach: 'Measure attendance, awareness, and local engagement to show practical impact.' },
  climate: { 
    title: 'Climate Change', 
    text: 'Your profile aligns with sustainability and environmental action, especially projects that mobilize community participation.', 
    idea: 'Campus or community recycling and sustainability awareness challenge.', 
    next: 'Pilot a small eco-action campaign and track measurable waste reduction or participation levels.', 
    approach: 'Pair awareness with tangible action such as sorting systems, cleanup days, or green literacy.' },
  women: { 
    title: 'Women Empowerment', 
    text: 'Your profile strongly supports mentorship, leadership, and community empowerment initiatives for women and girls.', 
    idea: 'Peer mentorship and leadership development program for young women.', 
    next: 'Build a mentorship circle and measure confidence, skills, and leadership engagement over time.', 
    approach: 'Offer structured guidance, role models, and safe spaces that increase confidence and opportunity.' },
  innovation: { 
    title: 'Innovation', 
    text: 'Your answers show strong potential for digital and creative solutions that address real problems in practical ways.', 
    idea: 'A digital product or community platform that solves a local challenge in a measurable way.', 
    next: 'Prototype a simple solution and validate it with real user feedback before scaling.', 
    approach: 'Combine design thinking, testing, and continuous improvement to make the solution useful and sustainable.' }
};

window.gcgoResult = output;
const chosenPillar = pillarMap[output.topPillar] || pillarMap.education;
document.getElementById('pillarTitle').textContent = chosenPillar.title;
document.getElementById('pillarText').textContent = chosenPillar.text;
document.getElementById('projectIdea').textContent = chosenPillar.idea;
document.getElementById('nextStep').textContent = chosenPillar.next;
document.getElementById('successApproach').textContent = chosenPillar.approach;
document.getElementById('scoreValue').textContent = `${Math.min(99, Math.round((output.score || 84) / 1.1))}%`;

const chartCanvas = document.getElementById('profileChart');
const ctx = chartCanvas.getContext('2d');
const values = Object.values(output.profile);
const labels = ['Education', 'Health', 'Climate', 'Women', 'Innovation'];
const maxValue = 100;
const savedTheme = localStorage.getItem('gcgoTheme');
const isDarkMode = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;

ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
const chartWidth = chartCanvas.width;
const chartHeight = chartCanvas.height;
const leftPadding = 40;
const topPadding = 20;
const barWidth = 52;
const gap = 24;

ctx.fillStyle = isDarkMode ? '#202224' : '#f4efe9';
ctx.fillRect(0, 0, chartWidth, chartHeight);
ctx.strokeStyle = isDarkMode ? '#454846' : '#e7ddd7';
ctx.lineWidth = 1;

for (let i = 0; i <= 5; i++) {
  const y = topPadding + i * 40;
  ctx.beginPath();
  ctx.moveTo(leftPadding, y);
  ctx.lineTo(chartWidth - 20, y);
  ctx.stroke();
}

values.forEach((value, index) => {
  const x = leftPadding + index * (barWidth + gap);
  const barHeight = (value / maxValue) * 160;
  const y = chartHeight - 30 - barHeight;
  ctx.fillStyle = ['#8d1514', '#2d8f8f', '#2a7f62', '#d9883d', '#6f51d6'][index % 5];
  ctx.fillRect(x, y, barWidth, barHeight);
  ctx.fillStyle = isDarkMode ? '#e8e4df' : '#374151';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(labels[index], x + barWidth / 2, chartHeight - 10);
  ctx.fillText(value, x + barWidth / 2, y - 8);
});
