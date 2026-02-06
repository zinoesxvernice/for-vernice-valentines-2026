// PANELS
const panels=[document.getElementById("panel1"),document.getElementById("panel2"),document.getElementById("panel3"),document.getElementById("panel4")];
let current=0;
const navLeft=document.querySelector(".arrow-left");
const navRight=document.querySelector(".arrow-right");

// COUNTERS
let countdownStarted=false;
let messageCountStarted=false;

// MUSIC
const music=document.getElementById("music");

// SHOW PANEL
function showPanel(i){
  panels[current].classList.add("hidden");
  current=i;
  panels[current].classList.remove("hidden");
  if(current>0){ navLeft.classList.add("visible"); navRight.classList.add("visible"); }
  else{ navLeft.classList.remove("visible"); navRight.classList.remove("visible"); }

  if(current===1&&!countdownStarted) startCountdown();
  if(current===2&&!messageCountStarted) startMessageCounter();
  if(current===3){ positionTimelineEventsAndDrawLine(); }
}

// NAVIGATION
function nextPanel(){ if(current<panels.length-1) showPanel(current+1); }
function prevPanel(){ if(current>0) showPanel(current-1); }

// DAYS SINCE
function daysSinceDate(){ const start=new Date("2024-12-30"); const today=new Date(); return Math.floor((today-start)/(1000*60*60*24)); }

// CLOCK-TICK
function animateClockNumber(finalNumber,containerId,suffix=""){
  const container=document.getElementById(containerId); container.innerHTML="";
  [...finalNumber.toString()].forEach((num,i)=>{
    const span=document.createElement("span"); span.className="digit"; span.textContent="0"; container.appendChild(span);
    let currentDigit=0;
    const interval=setInterval(()=>{ span.textContent=currentDigit; currentDigit=(currentDigit+1)%10; },50);
    setTimeout(()=>{ clearInterval(interval); span.textContent=num; },800+i*400);
  });
  if(suffix){ setTimeout(()=>{ const suffixSpan=document.createElement("span"); suffixSpan.textContent=suffix; suffixSpan.style.marginLeft="4px"; suffixSpan.style.color="#ff3b3b"; suffixSpan.style.fontWeight="800"; container.appendChild(suffixSpan); },800+finalNumber.toString().length*400); }
}

// COUNTERS
function startCountdown(){ countdownStarted=true; setTimeout(()=>{ animateClockNumber(daysSinceDate(),"number"); },300); }
function startMessageCounter(){ messageCountStarted=true; setTimeout(()=>{ animateClockNumber(64725,"msg-number","k+"); },300); }

// FOR VERNICE
document.getElementById("forVernice").addEventListener("click",()=>{ showPanel(1); music.play().catch(()=>{}); });

// FLOATING HEARTS
const heartsContainer=document.querySelector(".hearts-container");
function createHeart(){ const heart=document.createElement("div"); heart.classList.add("heart"); heart.style.left=Math.random()*100+"%"; heart.style.fontSize=12+Math.random()*16+"px"; heart.textContent="❤️"; heartsContainer.appendChild(heart); setTimeout(()=>{ heart.remove(); },8000); }
setInterval(createHeart,500);

// TIMELINE EVENTS & LINE
function positionTimelineEventsAndDrawLine(){
  const events = document.querySelectorAll(".timeline-events .event");
  const svg = document.querySelector(".timeline-graph");
  const path = document.querySelector(".timeline-line");
  const svgRect = svg.getBoundingClientRect();
  const points = [];
  const total = events.length;

  events.forEach((event, index) => {
    const x = (index / (total - 1)) * svgRect.width;
    const y = 20; // box top
    const dot = event.querySelector(".dot");

    // Position the box
    event.style.left = x + 'px';
    event.style.top = y + 'px';
    setTimeout(() => { event.classList.add("pop"); }, index * 300);

    // Calculate dot position relative to SVG
    const eventRect = event.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    const dotCenterX = dotRect.left + dotRect.width / 2 - svgRect.left;
    const dotCenterY = dotRect.top + dotRect.height / 2 - svgRect.top;

    points.push({ x: dotCenterX, y: dotCenterY });
  });

  // Build smooth curved path
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpX = (points[i - 1].x + points[i].x) / 2;
    const cpY = points[i - 1].y;
    d += ` Q ${cpX} ${cpY} ${points[i].x} ${points[i].y}`;
  }

  path.setAttribute("d", d);

  // Animate the line drawing
  const pathLength = path.getTotalLength();
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;
  setTimeout(() => {
    path.style.transition = "stroke-dashoffset 2s ease";
    path.style.strokeDashoffset = 0;
  }, 100);
}



// MODAL
const modal=document.getElementById("eventModal");
const modalDate=document.getElementById("modalDate");
const modalDesc=document.getElementById("modalDesc");
const closeModal=document.getElementById("closeModal");
const modalWindow=document.getElementById("modalWindow");
const modalTitleBar=document.getElementById("modalTitleBar");

document.querySelectorAll(".timeline-events .event").forEach(event=>{
  event.addEventListener("click",()=>{
    modalDate.textContent=event.dataset.date;
    modalDesc.textContent=event.dataset.desc;
    modal.classList.add("show");
  });
});
closeModal.addEventListener("click",()=> modal.classList.remove("show"));

// DRAG MODAL
let isDragging=false, offsetX=0, offsetY=0;
modalTitleBar.addEventListener("mousedown",(e)=>{
  isDragging=true;
  const rect=modalWindow.getBoundingClientRect();
  offsetX=e.clientX-rect.left;
  offsetY=e.clientY-rect.top;
  modalWindow.style.transition="none";
});
document.addEventListener("mousemove",(e)=>{
  if(isDragging){
    modalWindow.style.left=e.clientX-offsetX+"px";
    modalWindow.style.top=e.clientY-offsetY+"px";
    modalWindow.style.position="fixed";
  }
});
document.addEventListener("mouseup",()=>{ if(isDragging) isDragging=false; modalWindow.style.transition="all 0.3s ease"; });
