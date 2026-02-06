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

  // Reset events and auto-position
  events.forEach((ev, i) => {
    ev.style.opacity = 0;
    ev.style.transform = "translate(-50%, -50%) scale(0)";
    ev.dataset.branchCreated = "";

    // Evenly space along timeline
    const percent = ((i + 1) / (events.length + 1)) * 100;
    ev.style.left = percent + "%";

    // Alternate top/bottom automatically
    ev.classList.remove("top", "bottom");
    ev.classList.add(i % 2 === 0 ? "top" : "bottom");
  });

  let progress = 0;

  const interval = setInterval(() => {
    progress += 2; // main line speed
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

// Redraw timeline on window resize
window.addEventListener("resize", () => animateTimeline());
