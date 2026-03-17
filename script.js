document.getElementById('year').textContent = new Date().getFullYear();

const todayEl = document.getElementById('today-count');
const totalEl = document.getElementById('total-count');
const canvas = document.getElementById('sparkline');
const ctx = canvas.getContext('2d');

const CACHE_DURATION = 5 * 60 * 1000;
const NAMESPACE = 'agastya';

let hasAnimated = false;

// Animate numbers
function animateCount(el, target) {
  let start = 0;
  const startTime = performance.now();

  function update(t) {
    const progress = Math.min((t - startTime) / 1000, 1);
    const value = Math.floor(progress * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// +1 effect
function showIncrement(el) {
  const inc = document.createElement('span');
  inc.className = 'increment';
  inc.textContent = '+1';
  el.appendChild(inc);
  setTimeout(() => inc.remove(), 1000);
}

// Cache fetch
function fetchWithCache(key, url) {
  const cached = localStorage.getItem(key);
  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.time < CACHE_DURATION) {
      return Promise.resolve(data.value);
    }
  }

  return fetch(url)
    .then(r => r.json())
    .then(r => {
      localStorage.setItem(key, JSON.stringify({ value: r.value, time: Date.now() }));
      return r.value;
    });
}

// Sparkline
function drawSparkline(data) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h
  }));

  const gradient = ctx.createLinearGradient(0, 0, w, 0);
  gradient.addColorStop(0, "rgba(255,255,255,0.2)");
  gradient.addColorStop(1, "rgba(255,255,255,0.9)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 4;
  ctx.shadowColor = "rgba(255,255,255,0.3)";

  let progress = 0;
  const start = performance.now();

  function animate(t) {
    progress = Math.min((t - start) / 800, 1);

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();

    const visible = Math.floor(progress * (points.length - 1)) + 1;

    points.slice(0, visible).forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      drawLastPoint(points[points.length - 1]);
    }
  }

  requestAnimationFrame(animate);
}

function drawLastPoint(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.shadowBlur = 6;
  ctx.fill();
}

// Date helpers
function getLast7Days() {
  const arr = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

// Load data
async function loadData() {
  try {
    const total = await fetchWithCache(
      'total-cache',
      `https://api.countapi.xyz/hit/${NAMESPACE}/total`
    );

    animateCount(totalEl, total);
    showIncrement(totalEl);

    const todayKey = `${NAMESPACE}-today-${new Date().toISOString().slice(0,10)}`;
    let today = localStorage.getItem(todayKey);
    today = today ? parseInt(today) + 1 : 1;
    localStorage.setItem(todayKey, today);

    animateCount(todayEl, today);
    showIncrement(todayEl);

    let values = getLast7Days().map(d =>
      parseInt(localStorage.getItem(`${NAMESPACE}-today-${d}`)) || 0
    );

    if (values.every(v => v === 0)) {
      values = [3,7,5,9,6,11,8]; // demo fallback
    }

    drawSparkline(values);

  } catch {
    totalEl.textContent = '—';
    todayEl.textContent = '—';
  }
}

// Trigger on view
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !hasAnimated) {
    hasAnimated = true;
    loadData();
  }
}, { threshold: 0.4 }).observe(document.querySelector('.footer'));
