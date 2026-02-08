const panels = [
  document.getElementById("panel1"),
  document.getElementById("panel2"),
  document.getElementById("panel3"),
  document.getElementById("panel4"),
  document.getElementById("panel5"),
  document.getElementById("panel6"),
  document.getElementById("panel7")
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
  animateNumber(64725, msgNumberEl);
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

  const rawX = ((i + 0.5) / total) * width;
  const boxHalf = event.offsetWidth / 2;
  const x = Math.max(boxHalf, Math.min(width - boxHalf, rawX));

  const amplitude = 50;
  const centerY = height / 2;
  const y = centerY + Math.sin(i * 1.2) * amplitude;

  event.style.left = x + "px";
  event.style.top = y + "px";
  event.classList.add("pop");

  const dotY = y + event.offsetHeight + 10 + 6;
  points.push({ x: x, y: dotY });

  // 👇 single click handler
  event.onclick = () => {
    document.querySelectorAll(".timeline-events .event")
      .forEach(e => e.classList.remove("selected"));

    event.classList.add("selected");

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

window.addEventListener("load", () => {
  if (current === 2 && !messageCountStarted) {
    startMessageCounter();
  }
});

/* Panel 6: Balloon interaction */
const balloon = document.querySelector("#panel6 .balloon");
const letter = document.querySelector("#panel6 .letter");
const letterModal = document.getElementById("letterModal");
const letterContent = document.getElementById("letterContent");
const closeLetterModal = document.getElementById("closeLetterModal");

let balloonScale = 1;
const maxBalloonScale = 2.5; // maximum before shake

balloon.addEventListener("click", () => {
  if (balloonScale < maxBalloonScale) {
    balloonScale += 0.2;
    balloon.style.transform = `scale(${balloonScale})`;
  }

  if (balloonScale >= maxBalloonScale) {
    balloon.classList.add("shake");

    // remove shake after animation ends
    balloon.addEventListener("animationend", () => {
      balloon.classList.remove("shake");

      // hide the heart balloon after popping
      balloon.style.display = "none";

      // show letter
      letter.classList.remove("hidden");
      letter.style.transform = "translateX(-50%) scale(1)";
    }, { once: true });
  }
});


// Click letter to open GUI
letter.addEventListener("click", () => {
  letterModal.classList.add("show");
});

// Close GUI
closeLetterModal.addEventListener("click", () => {
  letterModal.classList.remove("show");
});

/* Panel 7: Photo Puzzle */
/* Panel 7: 3D Photo Puzzle */
const puzzleGrid = document.getElementById("puzzleGrid");
const puzzleMessage = document.getElementById("puzzleMessage");
const puzzleImage = "assets/puzzle-photo.jpg"; // make sure this is 300x300px
const gridSize = 3; // 3x3 puzzle

let pieces = [];
let draggingPiece = null;

function initPuzzle() {
  puzzleGrid.innerHTML = "";
  pieces = [];

  const pieceSize = 100; // 100x100px
  const gap = 5; // same as CSS gap

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.style.backgroundImage = `url(${puzzleImage})`;
      piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
      piece.dataset.index = row * gridSize + col;
      piece.dataset.currentIndex = piece.dataset.index;

      // Set absolute position
      piece.style.left = `${col * (pieceSize + gap)}px`;
      piece.style.top = `${row * (pieceSize + gap)}px`;

      piece.setAttribute("draggable", true);

      puzzleGrid.appendChild(piece);
      pieces.push(piece);

      piece.addEventListener("dragstart", () => {
        draggingPiece = piece;
        piece.classList.add("dragging");
      });

      piece.addEventListener("dragend", () => {
        piece.classList.remove("dragging");
        draggingPiece = null;
      });

      piece.addEventListener("dragover", (e) => e.preventDefault());

      piece.addEventListener("drop", () => {
  if (!draggingPiece || draggingPiece === piece) return;

  // Swap currentIndex
  const tempIndex = piece.dataset.currentIndex;
  piece.dataset.currentIndex = draggingPiece.dataset.currentIndex;
  draggingPiece.dataset.currentIndex = tempIndex;

  // Swap background positions
  const tempBg = piece.style.backgroundPosition;
  piece.style.backgroundPosition = draggingPiece.style.backgroundPosition;
  draggingPiece.style.backgroundPosition = tempBg;

  // Swap absolute positions smoothly
  const tempLeft = piece.style.left;
  const tempTop = piece.style.top;

  piece.style.left = draggingPiece.style.left;
  piece.style.top = draggingPiece.style.top;

  draggingPiece.style.left = tempLeft;
  draggingPiece.style.top = tempTop;

  checkPuzzleSolved();
});

      });
    }
  }

  shufflePuzzle();
}


function shufflePuzzle() {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = pieces[i].dataset.currentIndex;
    pieces[i].dataset.currentIndex = pieces[j].dataset.currentIndex;
    pieces[j].dataset.currentIndex = temp;

    // Swap background positions
    const tempPos = pieces[i].style.backgroundPosition;
    pieces[i].style.backgroundPosition = pieces[j].style.backgroundPosition;
    pieces[j].style.backgroundPosition = tempPos;
  }

  puzzleMessage.style.display = "none";
}

function checkPuzzleSolved() {
  const solved = pieces.every(
    (piece) => piece.dataset.currentIndex === piece.dataset.index
  );

  if (solved) {
    puzzleMessage.style.display = "block";
    for (let i = 0; i < 20; i++) createHeart();
  }
}

// Initialize puzzle
initPuzzle();








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
