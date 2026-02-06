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

// ---------------- SHOW PANEL ----------------
function showPanel(i){
  panels[current].classList.add("hidden");
  current = i;
  panels[current].classList.remove("hidden");

  if(current>0){
    navLeft.classList.add("visible");
    navRight.classList.add("visible");
  } else {
    navLeft.classList.remove("visible");
    navRight.classList.remove("visible");
  }

  if(current===1 && !countdownStarted) startCountdown();
  if(current===2 && !messageCountStarted) startMessageCounter();
  if(current===3) animateTimeline();
}

// ---------------- NAVIGATION ----------------
function nextPanel(){ if(current<panels.length-1) showPanel(current+1); }
function prevPanel(){ if(current>0) showPanel(current-1); }

// ---------------- DAYS SINCE ----------------
function daysSinceDate(){
  const start = new Date("2024-12-30");
  const today = new Date();
  return Math.floor((today - start) / (1000*60*60*24));
}

// ---------------- CLOCK-TICK ANIMATION ----------------
function animateClockNumber(finalNumber, containerId, suffix=""){
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  [...finalNumber.toString()].forEach((num,i)=>{
    const span = document.createElement("span");
    span.className="digit";
    span.textContent="0";
    container.appendChild(span);

    let currentDigit=0;
    const interval=setInterval(()=>{
      span.textContent=currentDigit;
      currentDigit=(currentDigit+1)%10;
    },50);

    setTimeout(()=>{
      clearInterval(interval);
      span.textContent=num;
    },800+i*400);
  });
  if(suffix){
    setTimeout(()=>{
      const suffixSpan=document.createElement("span");
      suffixSpan.textContent=suffix;
      suffixSpan.style.marginLeft="4px";
      suffixSpan.style.color="#ff3b3b";
      suffixSpan.style.fontWeight="800";
      container.appendChild(suffixSpan);
    },800+finalNumber.toString().length*400);
  }
}

// ---------------- START COUNTERS ----------------
function startCountdown(){
  countdownStarted=true;
  setTimeout(()=>{ animateClockNumber(daysSinceDate(),"number"); },300);
}
function startMessageCounter(){
  messageCountStarted=true;
  setTimeout(()=>{ animateClockNumber(64725,"msg-number","k+"); },300);
}

// ---------------- FOR VERNICE CLICK ----------------
document.getElementById("forVernice").addEventListener("click",()=>{
  showPanel(1);
  music.play().catch(()=>{ playBtn.style.display="inline-block"; });
});

// ---------------- FALLBACK PLAY BUTTON ----------------
playBtn.addEventListener("click", ()=>{
  music.play();
  playBtn.style.display="none";
});

// ---------------- FLOATING HEARTS ----------------
const heartsContainer=document.querySelector(".hearts-container");
function createHeart(){
  const heart=document.createElement("div");
  heart.classList.add("heart");
  heart.style.left=Math.random()*100+"%";
  heart.style.fontSize=12+Math.random()*16+"px";
  heart.textContent="❤️";
  heartsContainer.appendChild(heart);
  setTimeout(()=>{ heart.remove(); },8000);
}
setInterval(createHeart,500);

// ---------------- TIMELINE ANIMATION ----------------
function animateTimeline() {
  const svg = document.getElementById("timeline");
  svg.innerHTML = "";
  const width = svg.clientWidth;
  const height = svg.clientHeight / 2;

  // Main horizontal line
  const mainLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  mainLine.setAttribute("x1", 0);
  mainLine.setAttribute("y1", height);
  mainLine.setAttribute("x2", 0);
  mainLine.setAttribute("y2", height);
  mainLine.setAttribute("stroke", "#ff1a75");
  mainLine.setAttribute("stroke-width", 4);
  svg.appendChild(mainLine);

  const events = document.querySelectorAll(".timeline-events .event");
  const branchLength = 40; // branch length in px
  const connectorOffset = 4; // match ::after circle

  // Reset events
  events.forEach(ev => {
    ev.style.opacity = 0;
    ev.style.transform = "translateX(-50%) scale(0)";
    ev.dataset.branchCreated = "";
  });

  let progress = 0;

  const interval = setInterval(() => {
    progress += 2; // speed of main line
    if (progress > width) progress = width;

    // Update main line
    mainLine.setAttribute("x2", progress);

    events.forEach((ev) => {
      const evRect = ev.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const eventCenterX = evRect.left + evRect.width / 2 - svgRect.left;

      const branchEndY = ev.classList.contains("top")
        ? height - branchLength + connectorOffset
        : height + branchLength - connectorOffset;

      if (progress >= eventCenterX && !ev.dataset.branchCreated) {
        // Create branch
        const branch = document.createElementNS("http://www.w3.org/2000/svg", "line");
        branch.setAttribute("x1", eventCenterX);
        branch.setAttribute("y1", height);
        branch.setAttribute("x2", eventCenterX);
        branch.setAttribute("y2", height); // start at main line
        branch.setAttribute("stroke", "#ff1a75");
        branch.setAttribute("stroke-width", 2);
        svg.appendChild(branch);

        // Animate branch grow
        let branchProgress = 0;
        const branchInterval = setInterval(() => {
          branchProgress += 2; // speed of branch growth
          if (branchProgress > branchLength) branchProgress = branchLength;

          branch.setAttribute("y2", ev.classList.contains("top")
            ? height - branchProgress + connectorOffset
            : height + branchProgress - connectorOffset);

          if (branchProgress === branchLength) clearInterval(branchInterval);
        }, 16);

        // Animate event pop after branch grows
        setTimeout(() => {
          ev.classList.add("pop");
        }, 100); // tiny delay for branch first

        ev.dataset.branchCreated = "true";
      }
    });

    if (progress === width) clearInterval(interval);
  }, 16);
}
