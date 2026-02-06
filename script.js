// ---------------- PANELS ----------------
const panels = [
  document.getElementById("panel1"),
  document.getElementById("panel2"),
  document.getElementById("panel3"),
  document.getElementById("panel4")
];
let current = 0;

// Navigation arrows
const navLeft = document.querySelector(".arrow-left");
const navRight = document.querySelector(".arrow-right");

// ---------------- COUNTERS ----------------
let countdownStarted = false;
let messageCountStarted = false;

// ---------------- MUSIC ----------------
const music = document.getElementById("music");
const playBtn = document.getElementById("play-music");

// ---------------- SHOW PANEL ----------------
function showPanel(i) {
  panels[current].classList.add("hidden");
  current = i;
  panels[current].classList.remove("hidden");

  // Show/hide navigation arrows
  if (current > 0) {
    navLeft.classList.add("visible");
    navRight.classList.add("visible");
  } else {
    navLeft.classList.remove("visible");
    navRight.classList.remove("visible");
  }

  // Start counters if panel is visible
  if (current === 1 && !countdownStarted) startCountdown();
  if (current === 2 && !messageCountStarted) startMessageCounter();
  if (current === 3) animateTimeline();
}

// ---------------- NAVIGATION ----------------
function nextPanel() {
  if (current < panels.length - 1) showPanel(current + 1);
}

function prevPanel() {
  if (current > 0) showPanel(current - 1);
}

// ---------------- DAYS SINCE ----------------
function daysSinceDate() {
  const start = new Date("2024-12-30");
  const today = new Date();
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}

// ---------------- CLOCK-TICK ANIMATION ----------------
function animateClockNumber(finalNumber, containerId, suffix = "") {
  const container = document.getElementById(containerId);
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

  if (suffix) {
    setTimeout(() => {
      const suffixSpan = document.createElement("span");
      suffixSpan.textContent = suffix;
      suffixSpan.style.marginLeft = "4px";
      suffixSpan.style.color = "#ff3b3b";
      suffixSpan.style.fontWeight = "800";
      container.appendChild(suffixSpan);
    }, 800 + finalNumber.toString().length * 400);
  }
}

// ---------------- START COUNTERS ----------------
function startCountdown() {
  countdownStarted = true;
  setTimeout(() => {
    animateClockNumber(daysSinceDate(), "number");
  }, 300);
}

function startMessageCounter() {
  messageCountStarted = true;
  setTimeout(() => {
    animateClockNumber(64725, "msg-number", "k+");
  }, 300);
}

// ---------------- FOR VERNICE CLICK ----------------
const forVerniceBtn = document.getElementById("forVernice");
forVerniceBtn.addEventListener("click", () => {
  showPanel(1);
  music.play().catch(() => {
    if(playBtn) playBtn.style.display = "inline-block";
  });
});

// ---------------- FLOATING HEARTS ----------------
const heartsContainer = document.querySelector(".hearts-container");

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = 12 + Math.random() * 16 + "px";
  heart.textContent = "❤️";
  heartsContainer.appendChild(heart);

  setTimeout(() => { heart.remove(); }, 8000);
}

setInterval(createHeart, 500);

// ---------------- TIMELINE ----------------
function animateTimeline() {
  const timeline = document.getElementById("timeline");
  const events = document.querySelectorAll("#panel4 .timeline-events .event");

  const timelineWidth = timeline.clientWidth;
  const totalEvents = events.length;

  // Set event positions evenly
  events.forEach((event, i) => {
    const leftPercent = (i / (totalEvents - 1)) * 100;
    event.style.left = `${leftPercent}%`;
  });

  // Draw branches connecting timeline line to each event
  events.forEach((event) => {
    const branch = document.createElementNS("http://www.w3.org/2000/svg", "line");
    branch.classList.add("timeline-branch");

    const rect = event.getBoundingClientRect();
    const containerRect = timeline.getBoundingClientRect();

    const x1 = ((rect.left + rect.width/2) - containerRect.left);
    const y1 = 0;
    const x2 = x1;
    const y2 = event.classList.contains("top") ? rect.top - containerRect.top : rect.bottom - containerRect.top;

    branch.setAttribute("x1", x1);
    branch.setAttribute("y1", y1);
    branch.setAttribute("x2", x1);
    branch.setAttribute("y2", y1);

    timeline.appendChild(branch);

    // Animate branch growing
    setTimeout(() => {
      branch.setAttribute("y2", y2);
      event.classList.add("pop"); // event pops in when branch reaches it
    }, i * 400);
  });
}

// Modal functionality
const modal = document.getElementById("eventModal");
const modalDate = document.getElementById("modalDate");
const modalDesc = document.getElementById("modalDesc");
const closeModal = document.getElementById("closeModal");

document.querySelectorAll(".timeline-events .event").forEach(event => {
  event.addEventListener("click", () => {
    modalDate.textContent = event.dataset.date;
    modalDesc.textContent = event.dataset.desc;
    modal.classList.add("show");
  });
});

closeModal.addEventListener("click", () => modal.classList.remove("show"));
