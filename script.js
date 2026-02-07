// ------------------- PANELS -------------------
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

// ------------------- COUNTERS -------------------
let countdownStarted = false;
let messageCountStarted = false;
let panel5CountersStarted = false;

// ------------------- MUSIC -------------------
const music = document.getElementById("music");
let musicPlayed = false;

// ------------------- SHOW PANEL -------------------
function showPanel(i) {
  panels[current].classList.add("hidden");
  current = i;
  panels[current].classList.remove("hidden");

  // Show/hide arrows
  if (current > 0 && current < panels.length - 1) {
    navLeft.classList.add("visible");
    navRight.classList.add("visible");
  } else if (current === 0) {
    navLeft.classList.remove("visible");
    navRight.classList.add("visible");
  } else if (current === panels.length - 1) {
    navLeft.classList.add("visible");
    navRight.classList.remove("visible");
  }

  // Start counters
  if (current === 1 && !countdownStarted) startCountdown();
  if (current === 2 && !messageCountStarted) startMessageCounter();
  if (current === 3) positionTimelineEventsAndDrawLine();
  if (current === 4 && !panel5CountersStarted) startPanel5Counters();
}

// ------------------- NAVIGATION -------------------
function nextPanel() {
  if (current < panels.length - 1) showPanel(current + 1);
}
function prevPanel() {
  if (current > 0) showPanel(current - 1);
}

// ------------------- DAYS SINCE -------------------
function daysSinceDate() {
  const start = new Date("2024-12-30");
  const today = new Date();
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

// ------------------- CLOCK ANIMATION -------------------
function animateNumber(finalNumber, container) {
  container.innerHTML = "";
  [...finalNumber.toString()].forEach((num, i) => {
    const span = document.createElement("span");
    span.className = "digit";
    span.textContent = "0";
    container.appendChild(span);

    let currentDigit = 0;
    const interval = setInterval(() => {
      if (currentDigit <= 9) span.textContent = currentDigit;
      currentDigit = (currentDigit + 1) % 10;
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      span.textContent = num;
    }, 800 + i * 400);
  });
}

// ------------------- START COUNTERS -------------------
function startCountdown() {
  countdownStarted = true;
  const container = document.getElementById("number");
  animateNumber(daysSinceDate(), container);
}

function startMessageCounter() {
  messageCountStarted = true;
  const container = document.getElementById("msg-number");
  animateNumber(64725, container);
}

// ------------------- CLICK "FOR VERNICE" -------------------
document.getElementById("forVernice").addEventListener("click", () => {
  showPanel(1);
  if (!musicPlayed) {
    music.play().catch(() => {});
    musicPlayed = true;
  }
});

// ------------------- FLOATING HEARTS -------------------
const heartsContainer = document.querySelector(".hearts-container");
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = 12 + Math.random() * 16 + "px";
  heart.textContent = "❤️";
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}
setInterval(createHeart, 500);

// ------------------- PANEL 4: TIMELINE -------------------
function positionTimelineEventsAndDrawLine() {
  const events = document.querySelectorAll(".timeline-events .event");
  const svg = document.querySelector(".timeline-graph");
  const path = document.querySelector(".timeline-line");
  const svgRect = svg.getBoundingClientRect();
  const points = [];

  if (!events.length) return;

  events.forEach(event => {
    // click to open modal
    event.addEventListener("click", () => {
      document.getElementById("modalDate").textContent = event.dataset.date;
      document.getElementById("modalDesc").textContent = event.dataset.desc;
      document.getElementById("eventModal").classList.add("show");
    });
  });

  const minTop = 140;
  const maxHeight = Math.max(svgRect.height - 60, 100);
  const amplitude = Math.min(50, maxHeight / 2);

  events.forEach((event, i) => {
    const x = (i / (events.length - 1)) * svgRect.width;
    let y = minTop + Math.sin(i * 1.3) * amplitude + Math.random() * 8;
    y = Math.min(y, maxHeight - event.offsetHeight);
    event.style.left = `${x}px`;
    event.style.top = `${y}px`;
    setTimeout(() => event.classList.add("pop"), i * 150);

    const dot = event.querySelector(".dot");
    const dotRect = dot.getBoundingClientRect();
    const dotCenterX = dotRect.left + dotRect.width / 2 - svgRect.left;
    const dotCenterY = dotRect.top + dotRect.height / 2 - svgRect.top;
    points[i] = { x: dotCenterX, y: dotCenterY };
  });

  drawTimelineLine(points, path);
}

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
  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;
  setTimeout(() => path.style.strokeDashoffset = 0, 100);
}

window.addEventListener("resize", () => {
  if (!panels[3].classList.contains("hidden")) positionTimelineEventsAndDrawLine();
});

// ------------------- MODAL DRAG (MOUSE + TOUCH) -------------------
const modal = document.getElementById("eventModal");
const modalWindow = document.getElementById("modalWindow");
const modalTitleBar = document.getElementById("modalTitleBar");
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => modal.classList.remove("show"));

let isDragging = false, offsetX = 0, offsetY = 0;

function startDrag(x, y) {
  const rect = modalWindow.getBoundingClientRect();
  offsetX = x - rect.left;
  offsetY = y - rect.top;
  isDragging = true;
  modalWindow.style.transition = "none";
}

function dragMove(x, y) {
  if (!isDragging) return;
  modalWindow.style.left = x - offsetX + "px";
  modalWindow.style.top = y - offsetY + "px";
  modalWindow.style.position = "fixed";
}

function stopDrag() {
  if (isDragging) isDragging = false;
  modalWindow.style.transition = "all 0.3s ease";
}

// Mouse events
modalTitleBar.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
document.addEventListener("mousemove", e => dragMove(e.clientX, e.clientY));
document.addEventListener("mouseup", stopDrag);

// Touch events
modalTitleBar.addEventListener("touchstart", e => startDrag(e.touches[0].clientX, e.touches[0].clientY));
document.addEventListener("touchmove", e => dragMove(e.touches[0].clientX, e.touches[0].clientY));
document.addEventListener("touchend", stopDrag);

// ------------------- PANEL 5: UPCOMING EVENTS -------------------
function startPanel5Counters() {
  panel5CountersStarted = true;
  const daysElems = document.querySelectorAll("#panel5 .days");
  const today = new Date();

  daysElems.forEach(elem => {
    const targetDate = new Date(elem.dataset.date);
    let diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    diffDays = Math.max(diffDays, 0);
    animateNumber(diffDays, elem);
  });
}
