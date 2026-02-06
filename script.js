// ---------------- PANELS ----------------
const panels = [
  document.getElementById("panel1"),
  document.getElementById("panel2"),
  document.getElementById("panel3"),
  document.getElementById("panel4")
];
let current = 0;

const navLeft = document.querySelector(".arrow-left");
const navRight = document.querySelector(".arrow-right");

// ---------------- COUNTERS ----------------
let countdownStarted = false;
let messageCountStarted = false;

// ---------------- MUSIC ----------------
const music = document.getElementById("music");
const playBtn = document.getElementById("play-music");

// ---------------- LETTER ANIMATION ----------------
const forVerniceTitle = document.getElementById("forVernice");

// Split letters into spans
const text = forVerniceTitle.textContent;
forVerniceTitle.textContent = "";
[...text].forEach(letter=>{
    const span = document.createElement("span");
    span.textContent = letter;
    span.classList.add("letter");
    forVerniceTitle.appendChild(span);
});

// ---------------- SHOW PANEL ----------------
function showPanel(i) {
    panels[current].classList.add("hidden");
    current = i;
    panels[current].classList.remove("hidden");

    // Show navigation arrows only if not on first panel
    if(current > 0){
        navLeft.classList.add("visible");
        navRight.classList.add("visible");
    } else {
        navLeft.classList.remove("visible");
        navRight.classList.remove("visible");
    }

    // Start counters if panel is visible
    if(current === 1 && !countdownStarted) startCountdown();
    if(current === 2 && !messageCountStarted) startMessageCounter();
}

// ---------------- NAVIGATION ----------------
function nextPanel() {
    if(current < panels.length -1) showPanel(current + 1);
}

function prevPanel() {
    if(current > 0) showPanel(current - 1);
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

    [...finalNumber.toString()].forEach((num,i)=>{
        const span = document.createElement("span");
        span.className = "digit";
        span.textContent = "0";
        container.appendChild(span);

        let currentDigit = 0;
        const interval = setInterval(()=>{
            span.textContent = currentDigit;
            currentDigit = (currentDigit + 1) % 10;
        },50);

        setTimeout(()=>{
            clearInterval(interval);
            span.textContent = num;
        }, 800 + i*400);
    });

    if(suffix){
        setTimeout(()=>{
            const suffixSpan = document.createElement("span");
            suffixSpan.textContent = suffix;
            suffixSpan.style.marginLeft = "4px";
            suffixSpan.style.color = "#ff3b3b";
            suffixSpan.style.fontWeight = "800";
            container.appendChild(suffixSpan);
        }, 800 + finalNumber.toString().length*400);
    }
}

// ---------------- START COUNTERS ----------------
function startCountdown(){
    countdownStarted = true;
    setTimeout(()=>{ animateClockNumber(daysSinceDate(), "number"); },300);
}

function startMessageCounter(){
    messageCountStarted = true;
    setTimeout(()=>{ animateClockNumber(64725, "msg-number","k+"); },300);
}

// ---------------- FOR VERNICE CLICK ----------------
forVerniceTitle.addEventListener("click", ()=>{
    // animate letters
    forVerniceTitle.classList.add("animate-letters");

    // start pulsing after 9 seconds
    setTimeout(()=>{
        forVerniceTitle.classList.add("pulse-letters");
    },9000);

    // show panel2 and play music
    showPanel(1);
    music.play().catch(()=>{
        playBtn.style.display = "inline-block";
    });
});

// ---------------- FALLBACK PLAY BUTTON ----------------
playBtn.addEventListener("click", ()=>{
    music.play();
    playBtn.style.display = "none";
});

// ---------------- FLOATING HEARTS ----------------
const heartsContainer = document.querySelector(".hearts-container");

function createHeart(){
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random()*100+"%";
    heart.style.fontSize = 12 + Math.random()*16 + "px";
    heart.textContent = "❤️";
    heartsContainer.appendChild(heart);

    setTimeout(()=>{ heart.remove(); }, 8000);
}

setInterval(createHeart, 500);
