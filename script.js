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

// ------------------- UNIVERSAL CLOCK ANIMATION -------------------
function animateClockNumber(finalNumber, container) {
  // If container is a string, treat it as ID
  if (typeof container === "string") container = document.getElementById(container);
  container.innerHTML = "";

  const digits = [...finalNumber.toString()];
  digits.forEach((num, i) => {
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

// ------------------- PANEL 2 COUNTER -------------------
function startCountdown() {
  countdownStarted = true;
  const days = Math.floor((new Date() - new Date("2024-12-30")) / (1000*60*60*24));
  setTimeout(() => animateClockNumber(days, "number"), 300);
}

// ------------------- PANEL 3 COUNTER -------------------
function startMessageCounter() {
  messageCountStarted = true;
  setTimeout(() => animateClockNumber(64725, "msg-number"), 300);
}

// ------------------- PANEL 5 COUNTERS -------------------
function startPanel5Counters() {
  const daysElems = document.querySelectorAll("#panel5 .days");
  daysElems.forEach(elem => {
    const targetDate = new Date(elem.dataset.date);
    const today = new Date();
    let diffDays = Math.ceil((targetDate - today) / (1000*60*60*24));
    if (diffDays < 0) diffDays = 0;

    animateClockNumber(diffDays, elem);
  });
}

// ------------------- SHOW PANEL -------------------
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
  if (current === 3) positionTimelineEventsAndDrawLine();
  if (current === 4) startPanel5Counters();
}

// ------------------- NAVIGATION -------------------
function nextPanel() { if (current < panels.length - 1) showPanel(current + 1); }
function prevPanel() { if (current > 0) showPanel(current - 1); }

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
