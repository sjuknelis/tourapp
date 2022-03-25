let canvas,ctx;
let map;
let points = [[24.3,49.8],[27.3,49.8],[30.5,49.8],[30.5,39.9],[30.5,37.8],[30.5,27.7],[30.5,20.8],[32.6,39.9],[32.6,37.8],[32.6,36.35],[32.6,41.6],[32.7,27.7],[32.7,29.15]]; let edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[3,7],[3,7],[7,8],[8,9],[7,10],[7,10],[5,11],[11,12],[4,8]];

function buildPath() {
  ctx.drawImage(map,0,0);
  let edgeMatrix = Array.from(Array(points.length),_ => new Array(points.length).fill(0));
  let distanceMatrix = Array.from(Array(points.length),_ => new Array(points.length).fill(0));
  for ( let i = 0; i < points.length - 1; i++ ) {
    for ( let j = i + 1; j < points.length; j++ ) {
      let val = Math.hypot(points[i][0] - points[j][0],points[i][1] - points[j][1]);
      distanceMatrix[i][j] = val;
      distanceMatrix[j][i] = val;
    }
  }
  for ( let i in edges ) {
    let edge = edges[i];
    let a = edge[0];
    let b = edge[1];
    edgeMatrix[a][b] = distanceMatrix[a][b];
    edgeMatrix[b][a] = distanceMatrix[a][b];
  }
  let path = aStar(edgeMatrix,distanceMatrix,parseInt(document.getElementById("from").value),parseInt(document.getElementById("to").value));
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[path[0]][0] * 10,points[path[0]][1] * 10);
  for ( let i = 1; i < path.length; i++ ) {
    ctx.lineTo(points[path[i]][0] * 10,points[path[i]][1] * 10);
  }
  ctx.stroke();
}

window.onload = function() {
  map = document.getElementById("map");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.drawImage(map,0,0);
}
