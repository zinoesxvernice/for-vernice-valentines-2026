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
  [...finalNumber.toString()].forEach(num => {
    const span = document.createElement("span");
    span.className = "digit";
    span.textContent = num;
    container.appendChild(span);
  });
}

function startCountdown() {
  countdownStarted = true;
  animateNumber(daysSinceDate(), numberEl);
}

function startMessageCounter() {
  messageCountStarted = true;
  animateNumber(64725, msgNumberEl);
}

forVernice.addEventListener("click", () => {
  showPanel(1);
  music.play().catch(() => {});
});

/* Timeline */
function positionTimeline() {
  const events = document.querySelectorAll(".timeline-events .event");
  const container = document.querySelector(".timeline-events");
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  events.forEach((event, i) => {
    const total = events.length;
    const x = ((i + 1) / (total + 1)) * width;
    const y = height / 2 + Math.sin(i) * 40;

    event.style.left = x + "px";
    event.style.top = y + "px";
    event.classList.add("pop");

    event.addEventListener("click", () => {
      modalDate.textContent = event.dataset.date;
      modalDesc.textContent = event.dataset.desc;
      modal.classList.add("show");
    });
  });
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
