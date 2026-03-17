const SUPABASE_URL = "https://efhqbnhbwmvnavmnojgu.supabase.co";
const SUPABASE_KEY = "sb_publishable_QSbifVg30Dxaw_947aCNHw_P_2l9w5L";

const totalEl = document.getElementById('total');
const todayEl = document.getElementById('today');

document.getElementById('year').textContent = new Date().getFullYear();

/* Animate */
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

      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 250);
    }
  }

  update();
}

/* Fetch + Update global counter */
async function updateCounter() {
  try {
    // GET current data
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visitors?id=eq.1`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });

    const data = await res.json();
    let record = data[0];

    let total = record.total_count;
    let today = record.today_count;
    let lastDate = record.last_updated;

    const todayDate = new Date().toISOString().slice(0, 10);

    // Reset daily counter if new day
    if (lastDate !== todayDate) {
      today = 0;
    }

    // increment
    total += 1;
    today += 1;

    // UPDATE DB
    await fetch(`${SUPABASE_URL}/rest/v1/visitors?id=eq.1`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        total_count: total,
        today_count: today,
        last_updated: todayDate
      })
    });

    // animate UI
    animate(totalEl, total);
    animate(todayEl, today);

  } catch (err) {
    console.error("Counter failed:", err);
  }
}

/* Load when footer visible */
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    updateCounter();
    observer.disconnect();
  }
});

observer.observe(document.querySelector('.footer'));
