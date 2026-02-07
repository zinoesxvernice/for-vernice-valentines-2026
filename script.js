const panels=[document.getElementById("panel1"),document.getElementById("panel2"),document.getElementById("panel3"),document.getElementById("panel4"),document.getElementById("panel5")];
let current=0;
const navLeft=document.querySelector(".arrow-left");
const navRight=document.querySelector(".arrow-right");
let countdownStarted=false,messageCountStarted=false;
const music=document.getElementById("music");

function showPanel(i){
  panels[current].classList.add("hidden");
  current=i;
  panels[current].classList.remove("hidden");
  if(current>0){navLeft.classList.add("visible");navRight.classList.add("visible");}else{navLeft.classList.remove("visible");navRight.classList.remove("visible");}
  if(current===1&&!countdownStarted)startCountdown();
  if(current===2&&!messageCountStarted)startMessageCounter();
  if(current===3)positionTimelineEventsAndDrawLine();
  if(current===4)startPanel5Counters();
}

function nextPanel(){if(current<panels.length-1)showPanel(current+1);}
function prevPanel(){if(current>0)showPanel(current-1);}

function daysSinceDate(){return Math.floor((new Date()-new Date("2024-12-30"))/(1000*60*60*24));}

function animateNumber(finalNumber,container){
  container.innerHTML="";
  [...finalNumber.toString()].forEach((num,i)=>{
    const span=document.createElement("span");
    span.className="digit";
    span.textContent="0";
    container.appendChild(span);
    let currentDigit=0;
    const interval=setInterval(()=>{span.textContent=currentDigit;currentDigit=(currentDigit+1)%10;},50);
    setTimeout(()=>{clearInterval(interval);span.textContent=num;},800+i*400);
  });
}

function startCountdown(){countdownStarted=true;animateNumber(daysSinceDate(),document.getElementById("number"));}
function startMessageCounter(){messageCountStarted=true;animateNumber(64725,document.getElementById("msg-number"));}
document.getElementById("forVernice").addEventListener("click",()=>{showPanel(1);music.play().catch(()=>{});});

// Hearts
const heartsContainer=document.querySelector(".hearts-container");
function createHeart(){const heart=document.createElement("div");heart.classList.add("heart");heart.style.left=Math.random()*100+"%";heart.style.fontSize=12+Math.random()*16+"px";heart.textContent="❤️";heartsContainer.appendChild(heart);setTimeout(()=>heart.remove(),8000);}
setInterval(createHeart,500);

// Timeline
function positionTimelineEventsAndDrawLine(){
  const events=document.querySelectorAll(".timeline-events .event");
  const svg=document.querySelector(".timeline-graph");
  const path=document.querySelector(".timeline-line");
  const svgRect=svg.getBoundingClientRect();
  const points=[];
  const containerWidth=svgRect.width;

  events.forEach((event,i)=>{
    const total=events.length;
    const x=((i+0.5)/total)*containerWidth;
    const minTop=40,maxTop=svgRect.height-60;
    const amplitude=Math.min(50,(maxTop-minTop)/2);
    let y=minTop+Math.sin(i*1.3)*amplitude;
    y=Math.min(Math.max(y,minTop),maxTop);
    event.style.left=x+"px";
    event.style.top=y+"px";
    event.classList.add("pop");
    points[i]={x:x,y:y+event.offsetHeight/2};
    event.addEventListener("click",()=>{document.getElementById("modalDate").textContent=event.dataset.date;document.getElementById("modalDesc").textContent=event.dataset.desc;document.getElementById("eventModal").classList.add("show");});
  });

  drawTimelineLine(points,path);
}

function drawTimelineLine(points,path){
  if(!points.length)return;
  let d=`M ${points[0].x} ${points[0].y}`;
  for(let i=1;i<points.length;i++){
    const prev=points[i-1],curr=points[i];
    const cp1X=prev.x+(curr.x-prev.x)/2,cp1Y=prev.y;
    const cp2X=prev.x+(curr.x-prev.x)/2,cp2Y=curr.y;
    d+=` C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${curr.x} ${curr.y}`;
  }
  path.setAttribute("d",d);
  const pathLength=path.getTotalLength();
  path.style.strokeDasharray=pathLength;
  path.style.strokeDashoffset=pathLength;
  setTimeout(()=>path.style.strokeDashoffset=0,100);
}

window.addEventListener("resize",()=>{if(!panels[3].classList.contains("hidden"))positionTimelineEventsAndDrawLine();});

// Modal
const modal=document.getElementById("eventModal");
const modalWindow=document.getElementById("modalWindow");
const modalTitleBar=document.getElementById("modalTitleBar");
const closeModal=document.getElementById("closeModal");
closeModal.addEventListener("click",()=>modal.classList.remove("show"));
let isDragging=false,offsetX=0,offsetY=0;
modalTitleBar.addEventListener("mousedown",e=>{isDragging=true;const rect=modalWindow.getBoundingClientRect();offsetX=e.clientX-rect.left;offsetY=e.clientY-rect.top;modalWindow.style.transition="none";});
document.addEventListener("mousemove",e=>{if(isDragging){modalWindow.style.left=e.clientX-offsetX+"px";modalWindow.style.top=e.clientY-offsetY+"px";modalWindow.style.position="fixed";}});
document.addEventListener("mouseup",()=>{if(isDragging)isDragging=false;modalWindow.style.transition="all 0.3s ease";});

// Panel 5 counters
function startPanel5Counters(){
  const daysElems=document.querySelectorAll("#panel5 .days");
  const today=new Date();
  daysElems.forEach(elem=>{
    const targetDate=new Date(elem.dataset.date);
    let diffDays=Math.ceil((targetDate-today)/(1000*60*60*24));
    if(diffDays<0)diffDays=0;
    animateNumber(diffDays,elem);
  });
}
