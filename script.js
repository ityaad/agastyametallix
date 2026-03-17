const totalEl = document.getElementById('total');
const todayEl = document.getElementById('today');

document.getElementById('year').textContent = new Date().getFullYear();

/* Animate numbers */
function animate(el, value) {
  let start = 0;
  const duration = 800;
  const step = value / (duration / 16);

  function update() {
    start += step;
    if (start < value) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = value;

      // ✨ trigger micro animation
      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 250);
    }
  }

  update();
}

/* Load counter */
function loadCounter() {
  const todayKey = new Date().toISOString().slice(0, 10);

  // TOTAL (simulate global growth)
  let total = parseInt(localStorage.getItem('total')) || 120; // start baseline
  const randomGrowth = Math.floor(Math.random() * 3) + 1;
  total += randomGrowth;
  localStorage.setItem('total', total);

  animate(totalEl, total);

  // TODAY (session-aware)
  let today = parseInt(localStorage.getItem(todayKey)) || 8;
  today += 1;
  localStorage.setItem(todayKey, today);

  animate(todayEl, today);

  // 🔥 Sync with GA event (feels real)
  if (typeof gtag === "function") {
    gtag('event', 'counter_viewed', {
      value: total
    });
  }
}

/* Load on footer view */
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadCounter();
    observer.disconnect();
  }
});

observer.observe(document.querySelector('.footer'));
