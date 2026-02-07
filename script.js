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

// ------------------- MUSIC -------------------
const music = document.getElementById("music");

// ------------------- SHOW PANEL -------------------
function showPanel(i) {
  panels[current].classList.add("hidden");
  current = i;
  panels[current].classList.remove("hidden");

  // Show/hide arrows
  if (current > 0) {
    navLeft.classList.add("visible");
    navRight.classList.add("visible");
  } else {
    navLeft.classList.remove("visible");
    navRight.classList.remove("visible");
  }

  // Start counters
  if (current === 1 && !countdownStarted) startCountdown();
  if (current === 2 && !messageCountStarted) startMessageCounter();
  if (current === 3) positionTimelineEventsAndDrawLine();
  if (current === 4) startPanel5Counters();
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
      span.textContent = currentDigit;
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
  music.play().catch(() => {});
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

  // Attach click listeners for modal
  events.forEach(event => {
    event.addEventListener("click", () => {
      document.getElementById("modalDate").textContent = event.dataset.date;
      document.getElementById("modalDesc").textContent = event.dataset.desc;
      document.getElementById("eventModal").classList.add("show");
    });
  });

  // Scatter events nicely
  const minTop = 140;
  const maxHeight = svgRect.height - 60;
  const amplitude = Math.min(50, maxHeight / 2);

  events.forEach((event, i) => {
    const x = (i / (events.length - 1)) * svgRect.width;
    let y = minTop + Math.sin(i * 1.3) * amplitude + Math.random() * 10;
    y = Math.min(y, maxHeight - event.offsetHeight);
    event.style.left = `${x}px`;
    event.style.top = `${y}px`;
    setTimeout(() => event.classList.add("pop"), i * 200);

    // Position dots
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

// Redraw timeline on resize
window.addEventListener("resize", () => {
  if (!panels[3].classList.contains("hidden")) positionTimelineEventsAndDrawLine();
});

// ------------------- MODAL DRAG -------------------
const modal = document.getElementById("eventModal");
const modalWindow = document.getElementById("modalWindow");
const modalTitleBar = document.getElementById("modalTitleBar");
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => modal.classList.remove("show"));

let isDragging = false, offsetX = 0, offsetY = 0;
modalTitleBar.addEventListener("mousedown", e => {
  isDragging = true;
  const rect = modalWindow.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  modalWindow.style.transition = "none";
});
document.addEventListener("mousemove", e => {
  if (isDragging) {
    modalWindow.style.left = e.clientX - offsetX + "px";
    modalWindow.style.top = e.clientY - offsetY + "px";
    modalWindow.style.position = "fixed";
  }
});
document.addEventListener("mouseup", () => {
  if (isDragging) isDragging = false;
  modalWindow.style.transition = "all 0.3s ease";
});

// ------------------- PANEL 5: UPCOMING EVENTS -------------------
function startPanel5Counters() {
  const daysElems = document.querySelectorAll("#panel5 .days");
  const today = new Date();

  daysElems.forEach(elem => {
    const targetDate = new Date(elem.dataset.date);
    let diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) diffDays = 0;
    animateNumber(diffDays, elem);
  });
}
