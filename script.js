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
  const svg = document.getElementById("timeline");
  if (!svg) return;

  svg.innerHTML = "";
  const width = svg.clientWidth;
  const height = svg.clientHeight / 2;

  // Draw main horizontal line
  const mainLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  mainLine.setAttribute("x1", 0);
  mainLine.setAttribute("y1", height);
  mainLine.setAttribute("x2", 0);
  mainLine.setAttribute("y2", height);
  mainLine.setAttribute("stroke", "#ff1a75");
  mainLine.setAttribute("stroke-width", 4);
  svg.appendChild(mainLine);

  const events = document.querySelectorAll(".timeline-events .event");
  events.forEach((ev, i) => {
    ev.style.opacity = 0;
    ev.style.transform = "translate(-50%, -50%) scale(0)";
    ev.dataset.branchCreated = "";

    // Evenly space along timeline
    const percent = ((i + 1) / (events.length + 1)) * 100;
    ev.style.left = percent + "%";

    // Alternate top/bottom
    ev.classList.remove("top", "bottom");
    ev.classList.add(i % 2 === 0 ? "top" : "bottom");
  });

  // Animate main line and branches
  let progress = 0;
  const interval = setInterval(() => {
    progress += 2;
    if (progress > width) progress = width;
    mainLine.setAttribute("x2", progress);

    events.forEach(ev => {
      const evRect = ev.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();

      const eventCenterX = evRect.left + evRect.width / 2 - svgRect.left;
      const connectorY = ev.classList.contains("top")
        ? evRect.bottom - svgRect.top - 4
        : evRect.top - svgRect.top + 4;

      if (progress >= eventCenterX && !ev.dataset.branchCreated) {
        const branch = document.createElementNS("http://www.w3.org/2000/svg", "line");
        branch.setAttribute("x1", eventCenterX);
        branch.setAttribute("y1", height);
        branch.setAttribute("x2", eventCenterX);
        branch.setAttribute("y2", height);
        branch.setAttribute("stroke", "#ff1a75");
        branch.setAttribute("stroke-width", 2);
        svg.appendChild(branch);

        // Animate branch growth
        const totalLength = connectorY - height;
        let branchProgress = 0;
        const branchInterval = setInterval(() => {
          branchProgress += 2;
          if (Math.abs(branchProgress) > Math.abs(totalLength)) branchProgress = totalLength;
          branch.setAttribute("y2", height + branchProgress);
          if (branchProgress === totalLength) clearInterval(branchInterval);
        }, 16);

        setTimeout(() => ev.classList.add("pop"), 100);
        ev.dataset.branchCreated = "true";
      }
    });

    if (progress === width) clearInterval(interval);
  }, 16);
}

// Redraw timeline on resize
window.addEventListener("resize", () => animateTimeline());

// ---------------- MODAL ----------------
const eventModal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

// Open modal when clicking any timeline event
const timelineEvents = document.querySelectorAll(".timeline-events .event");
timelineEvents.forEach((ev, i) => {
  ev.addEventListener("click", () => {
    modalTitle.textContent = `special moment #${i + 1} 💖`;
    modalText.textContent = ev.textContent;

    eventModal.classList.add("show");
  });
});

// Close modal
closeModal.addEventListener("click", () => {
  eventModal.classList.remove("show");
});

// Close modal by clicking outside content
eventModal.addEventListener("click", (e) => {
  if (e.target === eventModal) eventModal.classList.remove("show");
});
