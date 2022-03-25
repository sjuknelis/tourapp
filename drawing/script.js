let canvas,ctx;
let map;
let points = [[24.3,49.8],[27.3,49.8],[30.5,49.8],[30.5,39.9],[30.5,37.8],[30.5,27.7],[30.5,20.8],[32.6,39.9],[32.6,37.8],[32.6,36.35],[32.6,41.6],[32.7,27.7],[32.7,29.15]]; let edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[3,7],[3,7],[7,8],[8,9],[7,10],[7,10],[5,11],[11,12],[4,8]];
let horizontal = false;
let vertical = false;
let from = NaN;

function drawPoints() {
  ctx.drawImage(map,0,0);
  ctx.fillStyle = "green";
  ctx.strokeStyle = "green";
  ctx.font = "14px Arial";
  for ( let i in points ) {
    ctx.beginPath();
    ctx.arc(points[i][0] * 10,points[i][1] * 10,3,0,Math.PI * 2);
    ctx.fill();
    ctx.fillText(i,points[i][0] * 10 - 10,points[i][1] * 10);
  }
  for ( let i in edges ) {
    let edge = edges[i];
    let a = points[edge[0]];
    let b = points[edge[1]];
    ctx.beginPath();
    ctx.moveTo(a[0] * 10,a[1] * 10);
    ctx.lineTo(b[0] * 10,b[1] * 10);
    ctx.stroke();
  }
  document.getElementById("data").innerText = `let points = ${JSON.stringify(points)}; let edges = ${JSON.stringify(edges)};`;
}

function setMode() {
  document.getElementById("mode").innerText = `Straight line: ${horizontal ? "H" : (vertical ? "V" : "-")} From: ${from}`;
}

window.onload = function() {
  map = document.getElementById("map");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  drawPoints();
  canvas.onclick = function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    if ( horizontal ) y = points[from][1] * 10;
    if ( vertical ) x = points[from][0] * 10;
    points.push([x / 10,y / 10]);
    if ( points.length != 1 ) edges.push([from,points.length - 1]);
    from = points.length - 1;
    setMode();
    drawPoints();
  }
  window.onkeypress = function() {
    horizontal = false;
    vertical = false;
    if ( event.code == "KeyH" ) horizontal = true;
    else if ( event.code == "KeyV" ) vertical = true;
    setMode();
  }
}
