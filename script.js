// ---------------- PANELS ----------------
const panels=[document.getElementById("panel1"),document.getElementById("panel2"),document.getElementById("panel3"),document.getElementById("panel4")];
let current=0;
const navLeft=document.querySelector(".arrow-left");
const navRight=document.querySelector(".arrow-right");

// ---------------- COUNTERS ----------------
let countdownStarted=false;
let messageCountStarted=false;

// ---------------- MUSIC ----------------
const music=document.getElementById("music");

// ---------------- SHOW PANEL ----------------
function showPanel(i){
  panels[current].classList.add("hidden");
  current=i;
  panels[current].classList.remove("hidden");
  if(current>0){ navLeft.classList.add("visible"); navRight.classList.add("visible"); }
  else{ navLeft.classList.remove("visible"); navRight.classList.remove("visible"); }

  if(current===1&&!countdownStarted) startCountdown();
  if(current===2&&!messageCountStarted) startMessageCounter();
  if(current===3) positionTimelineEvents();
}

// ---------------- NAVIGATION ----------------
function nextPanel(){ if(current<panels.length-1) showPanel(current+1); }
function prevPanel(){ if(current>0) showPanel(current-1); }

// ---------------- DAYS SINCE ----------------
function daysSinceDate(){ const start=new Date("2024-12-30"); const today=new Date(); return Math.floor((today-start)/(1000*60*60*24)); }

// ---------------- CLOCK-TICK ANIMATION ----------------
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

// ---------------- START COUNTERS ----------------
function startCountdown(){ countdownStarted=true; setTimeout(()=>{ animateClockNumber(daysSinceDate(),"number"); },300); }
function startMessageCounter(){ messageCountStarted=true; setTimeout(()=>{ animateClockNumber(64725,"msg-number","k+"); },300); }

// ---------------- FOR VERNICE CLICK ----------------
document.getElementById("forVernice").addEventListener("click",()=>{ showPanel(1); music.play().catch(()=>{}); });

// ---------------- FLOATING HEARTS ----------------
const heartsContainer=document.querySelector(".hearts-container");
function createHeart(){ const heart=document.createElement("div"); heart.classList.add("heart"); heart.style.left=Math.random()*100+"%"; heart.style.fontSize=12+Math.random()*16+"px"; heart.textContent="❤️"; heartsContainer.appendChild(heart); setTimeout(()=>{ heart.remove(); },8000); }
setInterval(createHeart,500);

// ---------------- TIMELINE EVENT POSITIONS ----------------
function positionTimelineEvents(){
  const events=document.querySelectorAll(".timeline-events .event");
  const total=events.length;
  events.forEach((event,index)=>{
    const percent=(index/(total-1))*100;
    event.style.left=percent+"%";
    setTimeout(()=>{ event.classList.add("pop"); },index*300);
  });
}

// ---------------- MODAL ----------------
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

// ---------------- DRAG MODAL ----------------
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
