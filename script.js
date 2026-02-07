const panels = [
  document.getElementById("panel1"),
  document.getElementById("panel2"),
  document.getElementById("panel3"),
  document.getElementById("panel4"),
  document.getElementById("panel5")
];

let current = 0;

const navLeft = document.querySelector(".arrow-left");
const navRight = document.querySelector(".arrow-right");

let countdownStarted = false;
let messageCountStarted = false;

const music = document.getElementById("music");
const numberEl = document.getElementById("number");
const msgNumberEl = document.getElementById("msg-number");
const forVernice = document.getElementById("forVernice");

const modal = document.getElementById("eventModal");
const modalDate = document.getElementById("modalDate");
const modalDesc = document.getElementById("modalDesc");
const closeModal = document.getElementById("closeModal");

function showPanel(i) {
  panels[current].classList.add("hidden");
  current = i;
  panels[current].classList.remove("hidden");

  if (current > 0) {
    navLeft.classList.add("visible");
    navRight.classList.add("visible");
  } else {
    navLeft.classList.remove("visible");
    navRight.classList.remove("visible");
  }

  if (current === 1 && !countdownStarted) startCountdown();
  if (current === 2 && !messageCountStarted) startMessageCounter();
  if (current === 3) setTimeout(positionTimeline, 50);
  if (current === 4) startPanel5Counters();
}

function nextPanel() {
  if (current < panels.length - 1) showPanel(current + 1);
}

function prevPanel() {
  if (current > 0) showPanel(current - 1);
}

function daysSinceDate() {
  return Math.floor(
    (new Date() - new Date("2024-12-30")) /
    (1000 * 60 * 60 * 24)
  );
}

function animateNumber(finalNumber, container) {
  container.innerHTML = "";

  const digits = finalNumber.toString().split("").map(Number);
  const spans = [];

  digits.forEach(() => {
    const span = document.createElement("span");
    span.className = "digit";
    span.textContent = "0";
    container.appendChild(span);
    spans.push(span);
  });

  spans.forEach((span, index) => {
    const finalDigit = digits[index];
    let current = 0;
    let rolls = 20 + index * 10;

    function roll() {
      span.textContent = current;
      current = (current + 1) % 10;
      rolls--;

      if (rolls > 0 || current !== finalDigit) {
        requestAnimationFrame(roll);
      } else {
        span.textContent = finalDigit;

        // ONLY panel 3 (messages) gets K+
        if (
          index === spans.length - 1 &&
          container === msgNumberEl
        ) {
          addKPlus(container);
        }
      }
    }

    setTimeout(roll, index * 120);
  });
}


function addKPlus(container) {
  const k = document.createElement("span");
  k.textContent = "K+";
  k.style.marginLeft = "6px";
  k.style.fontWeight = "800";
  k.style.color = "#ff1a75";
  k.style.display = "inline-block";
  k.style.transform = "scale(0.4)";
  k.style.opacity = "0";
  k.style.transition = "0.3s ease";

  container.appendChild(k);

  requestAnimationFrame(() => {
    k.style.transform = "scale(1.2)";
    k.style.opacity = "1";

    setTimeout(() => {
      k.style.transform = "scale(1)";
    }, 150);
  });
}





function startCountdown() {
  countdownStarted = true;
  animateNumber(daysSinceDate(), numberEl);
}

function startMessageCounter() {
  messageCountStarted = true;

  msgNumberEl.innerHTML = "";

  // number
  [..."64725"].forEach(num => {
    const span = document.createElement("span");
    span.className = "digit";
    span.textContent = num;
    msgNumberEl.appendChild(span);
  });

  // K+
  const k = document.createElement("span");
  k.textContent = "K+";
  k.style.marginLeft = "6px";
  k.style.fontWeight = "800";
  k.style.color = "#ff1a75";

  msgNumberEl.appendChild(k);
}


forVernice.addEventListener("click", () => {
  showPanel(1);
  music.play().catch(() => {});
});

function drawTimelineLine(points, path) {
  if (!points.length) return;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    const cp1X = prev.x + (curr.x - prev.x) / 2;
    const cp1Y = prev.y;
    const cp2X = prev.x + (curr.x - prev.x) / 2;
    const cp2Y = curr.y;

    d += ` C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${curr.x} ${curr.y}`;
  }

  path.setAttribute("d", d);

  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  setTimeout(() => {
    path.style.strokeDashoffset = 0;
  }, 100);
}

/* Timeline */
function positionTimeline() {
  const events = document.querySelectorAll(".timeline-events .event");
  const container = document.querySelector(".timeline-events");
  const path = document.querySelector(".timeline-line");

  const width = container.offsetWidth;
  const height = container.offsetHeight;

  const points = [];

  events.forEach((event, i) => {
    const total = events.length;

    // FIX 1: prevent overlap (respect box width)
    const rawX = ((i + 0.5) / total) * width;
    const boxHalf = event.offsetWidth / 2;
    const x = Math.max(boxHalf, Math.min(width - boxHalf, rawX));

    // vertical wave stays unchanged
    const amplitude = 50;
    const centerY = height / 2;
    const y = centerY + Math.sin(i * 1.2) * amplitude;

    event.style.left = x + "px";
    event.style.top = y + "px";
    event.classList.add("pop");

    // FIX 2: connect line to dot center
    const dotY = y + event.offsetHeight + 10 + 6;
    points.push({ x: x, y: dotY });

    event.onclick = () => {
      modalDate.textContent = event.dataset.date;
      modalDesc.textContent = event.dataset.desc;
      modal.classList.add("show");
    };
  });

  drawTimelineLine(points, path);
}

window.addEventListener("resize", () => {
  if (current === 3) positionTimeline();
});

/* Modal */
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});

/* Panel 5 counters */
function startPanel5Counters() {
  const elems = document.querySelectorAll("#panel5 .days");
  const today = new Date();

  elems.forEach(elem => {
    const target = new Date(elem.dataset.date);
    let diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) diff = 0;
    animateNumber(diff, elem);
  });
}

/* Hearts */
const heartsContainer = document.querySelector(".hearts-container");

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "❤️";
  heart.style.left = Math.random() * 100 + "%";
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

setInterval(createHeart, 500);
