const panels = [
  document.getElementById("panel1"),
  document.getElementById("panel2"),
  document.getElementById("panel3"),
  document.getElementById("panel4"),
  document.getElementById("panel5"),
  document.getElementById("panel6"),
  document.getElementById("panel7"),
  document.getElementById("panel8"),
  document.getElementById("panel9")
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

  // Navigation arrows
  if (current > 0) {
    navLeft.classList.add("visible");
    navRight.classList.add("visible");
  } else {
    navLeft.classList.remove("visible");
    navRight.classList.remove("visible");
  }

  // Panel-specific logic
  if (current === 1 && !countdownStarted) startCountdown();
  if (current === 2 && !messageCountStarted) startMessageCounter();
  if (current === 3) setTimeout(positionTimeline, 50);
  if (current === 4) startPanel5Counters();
  if (current === 7) resetPromisePanel();
  if (current === 8) { // Panel 9
    startPanel9Hearts();
  } else {
    stopPanel9Hearts();
  }
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

    balloon.addEventListener("animationend", () => {
      balloon.classList.remove("shake");

      // hide the heart balloon after popping
      balloon.style.display = "none";

      // show letter
      letter.classList.remove("hidden");
      letter.style.transform = "translateX(-50%) scale(1)";

      // change the subtext
      const panel6Subtext = document.querySelector("#panel6 .subtext");
      panel6Subtext.textContent = "click on the letter! 💌";
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

// Select scroll arrow inside notebook-content
const notebookContent = document.querySelector("#letterModal .notebook-content");
const scrollArrow = document.querySelector("#letterModal .scroll-arrow");

// update arrow visibility
function updateScrollArrow() {
  const scrollTop = notebookContent.scrollTop;
  const scrollHeight = notebookContent.scrollHeight;
  const clientHeight = notebookContent.clientHeight;

  // hide arrow if at the bottom
  if (scrollTop + clientHeight >= scrollHeight - 1) {
    scrollArrow.style.opacity = 0;
  } else {
    scrollArrow.style.opacity = 1;
  }
}

// listen for scroll inside notebook content
notebookContent.addEventListener("scroll", updateScrollArrow);

// run once when modal opens
letterModal.addEventListener("transitionend", () => {
  updateScrollArrow();
});






/* Panel 7: Photo Puzzle */
/* Panel 7: 3D Photo Puzzle */
/* Panel 7: 3D Photo Puzzle */
/* Panel 7: 3D Photo Puzzle */
/* Panel 7: Tap-to-Swap Puzzle */
/* Panel 7: Tap-to-Swap Puzzle */
const puzzleGrid = document.getElementById("puzzleGrid");
const puzzleMessage = document.getElementById("puzzleMessage");
const puzzleImage = "assets/puzzle-photo.jpg"; // your puzzle image
const gridSize = 3;
const gap = 5;

let pieces = [];
let selectedPiece = null;

// Get piece size dynamically based on grid width
function getPieceSize() {
  const maxWidth = puzzleGrid.offsetWidth;
  return Math.floor((maxWidth - gap * (gridSize - 1)) / gridSize);
}

function initPuzzle() {
  puzzleGrid.innerHTML = "";
  pieces = [];
  const pieceSize = getPieceSize();

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");
      piece.style.backgroundImage = `url(${puzzleImage})`;
      piece.style.backgroundSize = `${gridSize * pieceSize + gap * (gridSize - 1)}px`;
      piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
      piece.dataset.index = row * gridSize + col;
      piece.dataset.row = row;
      piece.dataset.col = col;
      piece.style.width = piece.style.height = pieceSize + "px";
      piece.style.left = `${col * (pieceSize + gap)}px`;
      piece.style.top = `${row * (pieceSize + gap)}px`;
      piece.style.position = "absolute";
      piece.style.cursor = "pointer";

      puzzleGrid.appendChild(piece);
      pieces.push(piece);

      // Tap-to-swap logic
      piece.addEventListener("click", () => {
        if (!selectedPiece) {
          selectedPiece = piece;
          piece.classList.add("selected"); // highlight first tap
        } else if (selectedPiece === piece) {
          selectedPiece.classList.remove("selected"); // deselect if same piece
          selectedPiece = null;
        } else {
          swapPieces(selectedPiece, piece);
          selectedPiece.classList.remove("selected");
          selectedPiece = null;
        }
      });
    }
  }

  shufflePuzzle();
}

function swapPieces(a, b) {
  const pieceSize = getPieceSize();

  // Swap dataset coordinates
  const tempRow = a.dataset.row;
  const tempCol = a.dataset.col;
  a.dataset.row = b.dataset.row;
  a.dataset.col = b.dataset.col;
  b.dataset.row = tempRow;
  b.dataset.col = tempCol;

  // Animate positions
  a.style.left = a.dataset.col * (pieceSize + gap) + "px";
  a.style.top = a.dataset.row * (pieceSize + gap) + "px";
  b.style.left = b.dataset.col * (pieceSize + gap) + "px";
  b.style.top = b.dataset.row * (pieceSize + gap) + "px";

  checkPuzzleSolved();
}

function shufflePuzzle() {
  const pieceSize = getPieceSize();
  const coords = pieces.map(p => ({ row: p.dataset.row, col: p.dataset.col }));
  coords.sort(() => Math.random() - 0.5); // shuffle

  pieces.forEach((p, i) => {
    p.dataset.row = coords[i].row;
    p.dataset.col = coords[i].col;
    p.style.left = coords[i].col * (pieceSize + gap) + "px";
    p.style.top = coords[i].row * (pieceSize + gap) + "px";
  });

  puzzleMessage.style.display = "none";
}

function checkPuzzleSolved() {
  const solved = pieces.every(piece =>
    Number(piece.dataset.row) * gridSize + Number(piece.dataset.col) == piece.dataset.index
  );

  if (solved) {
    puzzleMessage.style.display = "block";
    for (let i = 0; i < 20; i++) createHeart();
  }
}

// Initialize puzzle
initPuzzle();

// Optional: responsive resizing
window.addEventListener("resize", () => {
  const pieceSize = getPieceSize();
  pieces.forEach(p => {
    p.style.width = p.style.height = pieceSize + "px";
    p.style.left = p.dataset.col * (pieceSize + gap) + "px";
    p.style.top = p.dataset.row * (pieceSize + gap) + "px";
  });
});


/* Panel 8: Promise Panel */
const promiseText = document.getElementById("promiseText");

const promises = [
  "I promise to always choose you.",
  "I promise to listen, even when it’s hard.",
  "I promise to grow instead of running away.",
  "I promise to be honest with you.",
  "I promise to protect your heart.",
  "I promise to love you on your best and worst days.",
  "I promise you will never be alone.",
  "I promise I won't be like the stupid boy I was",
  "I promise you… my future. 💍"
];

let promiseIndex = 0;

function showPromise(index) {
  promiseText.classList.remove("show");
  setTimeout(() => {
    promiseText.textContent = promises[index];
    promiseText.classList.add("show");
  }, 200);
}

document.getElementById("panel8").addEventListener("click", () => {
  if (promiseIndex < promises.length - 1) {
    promiseIndex++;
    showPromise(promiseIndex);
  }
});

// reset when entering panel
function resetPromisePanel() {
  promiseIndex = 0;
  showPromise(0);
}

/* Panel 9: Falling Hearts */
/* Panel 9: Falling Hearts */
/* Panel 9: Falling Hearts forming a sentence */
/* Panel 9: Message in a Bubble */
const panel9Container = document.querySelector(".hearts-container-panel9");
const panel9Message = document.getElementById("panel9Message");

// The cute sentence to reveal
const sentence = "I 💖 you forever!";
let lettersRevealed = 0;

// Clear previous message letters
panel9Message.innerHTML = "";
sentence.split("").forEach(letter => {
  const span = document.createElement("span");
  span.textContent = letter;
  span.style.opacity = 0;
  span.style.transition = "opacity 0.5s ease, transform 0.3s ease";
  panel9Message.appendChild(span);
});

function createBubble() {
  if (lettersRevealed >= sentence.length) return; // stop spawning

  const bubble = document.createElement("div");
  bubble.classList.add("floating-bubble");
  bubble.textContent = sentence[lettersRevealed]; // next letter

  const leftPos = Math.random() * 90; // horizontal start
  bubble.style.left = leftPos + "vw";

  const size = 30 + Math.random() * 20;
  bubble.style.width = bubble.style.height = size + "px";
  bubble.style.fontSize = Math.max(16, size / 2) + "px";

  const duration = 5000 + Math.random() * 3000;
  bubble.style.animationDuration = duration + "ms";
  bubble.style.animationName = "floatBubble";

  // Wiggle continuously
  bubble.style.animationIterationCount = "infinite";
  bubble.style.animationTimingFunction = "linear";
  bubble.style.animationDirection = "normal";

  // Tap/click to pop
  const popBubble = () => {
    bubble.style.animation = "popBubble 0.4s forwards";
    const spans = panel9Message.querySelectorAll("span");
    spans[lettersRevealed].style.opacity = 1;
    spans[lettersRevealed].style.transform = "scale(1.2)";
    setTimeout(() => {
      spans[lettersRevealed].style.transform = "scale(1)";
    }, 150);

    lettersRevealed++;

    // Stop spawning when all letters revealed
    if (lettersRevealed >= sentence.length) stopPanel9Bubbles();

    setTimeout(() => bubble.remove(), 400);
  };

  bubble.addEventListener("click", popBubble);
  bubble.addEventListener("touchstart", popBubble);

  panel9Container.appendChild(bubble);

  // Auto remove if bubble reaches top
  setTimeout(() => {
    if (bubble.parentElement) bubble.remove();
  }, duration);
}

let panel9Interval;

function startPanel9Bubbles() {
  panel9Interval = setInterval(createBubble, 500);
  panel9Message.classList.add("show");
  lettersRevealed = 0;
}

function stopPanel9Bubbles() {
  clearInterval(panel9Interval);
  panel9Container.innerHTML = "";
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
