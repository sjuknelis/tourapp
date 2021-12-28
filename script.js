let canvas,ctx;
let map;
let points = [[45.8,101.68125],[48.5,99.88125],[53.1,99.18125],[56.9,98.38125],[59.4,97.58125],[62.5,96.88125],[65.4,95.78125],[68.5,94.78125],[71.5,93.48125],[75,91.58125],[77.7,93.38125],[80.2,94.78125],[82.3,96.18125],[84.5,97.78125],[87.3,99.48125],[89.6,100.88125],[92.4,102.48125],[94.6,104.28125],[97.5,105.48125],[101.5,107.28125],[104.1,107.98125],[107.2,109.38125],[109.3,110.28125],[112.1,111.68125],[115.4,113.78125],[117.8,115.28125],[120.8,117.18125],[124.1,119.88125],[125.7,121.88125],[127.7,123.88125],[129.4,125.98125],[130.6,127.68125],[131.2,128.88125],[133,127.78125],[135.1,126.68125],[137.7,124.38125],[140.3,122.28125],[142.2,120.58125],[144.4,119.18125],[147,116.68125],[149.2,115.48125],[151.8,113.88125],[154.8,112.88125],[157.3,111.28125]];
let edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[19,20],[20,21],[21,22],[22,23],[23,24],[24,25],[25,26],[26,27],[27,28],[28,29],[29,30],[30,31],[31,32],[32,33],[33,34],[34,35],[35,36],[36,37],[37,38],[38,39],[39,40],[40,41],[41,42],[42,43]];

function buildPath() {
  ctx.drawImage(map,0,0,500,500);
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
  console.log("here")
  let path = aStar(edgeMatrix,distanceMatrix,parseInt(document.getElementById("from").value),parseInt(document.getElementById("to").value));
  console.log(path)
  ctx.strokeStyle = "green";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(points[path[0]][0] * 2.5,points[path[0]][1] * 2.5);
  for ( let i = 1; i < path.length; i++ ) {
    ctx.lineTo(points[path[i]][0] * 2.5,points[path[i]][1] * 2.5);
  }
  ctx.stroke();
}

window.onload = function() {
  map = document.getElementById("map");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  ctx.drawImage(map,0,0,500,500);
}
