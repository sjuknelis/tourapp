let mapKey,building,level,points,edges,roomPoints,doorPoints,stairPoints,arcs;
let translatedPoints;
let canvas,ctx,map;

let fromFinal,toFinal,steps;
let stepIndex = 0;
let modalFromSelected = false;
let navigationOn = false;
let firstOpen = true;

let currentBox;
let nextBox = null;
let transitionTime = 0;
let realCurrentBox,realNextBox;
let lineDashTick = 0;

const KEY_COLOR = "rgb(25,61,119)";
const BUFFER = 1000;
const GLOBAL_SCALE = 1;

let drawer = Point(0,0);
let lastPoint = -1;
let keys = {};

let maps = {};

function clonePoint(p) { return Point(p.x,p.y); }

function getPointPath(from,to) {
  let edgeMatrix = Array.from(Array(points.length),_ => new Array(points.length).fill(0));
  let distanceMatrix = Array.from(Array(points.length),_ => new Array(points.length).fill(0));
  for ( let i = 0; i < points.length - 1; i++ ) {
    for ( let j = i + 1; j < points.length; j++ ) {
      let val = Math.hypot(points[i].x - points[j].x,points[i].y - points[j].y);
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
  return aStar(edgeMatrix,distanceMatrix,from,to);
}

function distanceOfPath(path) {
  let dist = 0;
  for ( let i = 0; i < path.length - 1; i++ ) {
    dist += Math.hypot(points[path[i]].x - points[path[i + 1]].x,points[path[i]].y - points[path[i + 1]].y);
  }
  return dist;
}

function closestStaircase(origin,destKey) {
  let minCandidate = null;
  let minDist = Number.MAX_VALUE;
  for ( const candidate of stairPoints ) {
    if ( Object.keys(candidate.paths).indexOf(destKey) == -1 ) continue;
    const path = getPointPath(origin.point,candidate.point);
    const dist = distanceOfPath(path);
    if ( dist < minDist ) {
      minDist = dist;
      minCandidate = candidate;
    }
  }
  return minCandidate;
}

function shortestOutsideRoute(originKey,destKey) {
  const oldMapKey = mapKey;
  loadActiveMapData("outside");
  let minCandidate = null;
  let minDist = Number.MAX_VALUE;
  for ( const originDoor of mapData[originKey].doorPoints ) {
    for ( const destDoor of mapData[destKey].doorPoints ) {
      const path = getPointPath(originDoor.outside,destDoor.outside);
      const dist = distanceOfPath(path);
      if ( dist < minDist ) {
        minDist = dist;
        minCandidate = {originDoor,destDoor};
      }
    }
  }
  loadActiveMapData(oldMapKey);
  return minCandidate;
}

function constructSteps() {
  loadActiveMapData(fromFinal.mapKey);

  const base = [fromFinal];
  const mirror = [null];
  const instructions = [];

  const fromPoint = points[fromFinal.point];
  const toPoint = mapData[toFinal.mapKey].points[toFinal.point];
  const toBuilding = mapData[toFinal.mapKey].building;
  const toLevel = mapData[toFinal.mapKey].level;
  if ( building == toBuilding && mapKey != "shattuck0a" && toFinal.mapKey != "shattuck0a" ) {
    if ( fromFinal.mapKey != toFinal.mapKey ) {
      const staircase = closestStaircase(fromFinal,toFinal.mapKey);

      base.push({point: staircase.point,mapKey});
      mirror.push({point: staircase.paths[toFinal.mapKey],mapKey: toFinal.mapKey});
      instructions.push(`Go to level ${Math.max(toLevel,0)}`);
    }
  } else {
    const shattuckHACCase = (
      (building == "shattuck" && toBuilding == "hac") ||
      (building == "hac" && toBuilding == "shattuck")
    );
    const shattuck0ACase = mapKey == "shattuck0a" || toFinal.mapKey == "shattuck0a";

    if ( level != 1 && ! (shattuckHACCase && mapKey == "shattuck0a") ) {
      const staircase = closestStaircase(fromFinal,`${building}1`);

      base.push({point: staircase.point,mapKey});
      mirror.push({point: staircase.paths[`${building}1`],mapKey: `${building}1`});
      instructions.push(`Go to level 1`);
    }

    if ( shattuckHACCase ) {
      let shattuckItem;
      if ( shattuck0ACase ) shattuckItem = {point: mapData["shattuck0a"].hacPoint,mapKey: "shattuck0a"};
      else shattuckItem = {point: mapData["shattuck1"].hacPoint,mapKey: "shattuck1"};
      const hacItem = {point: mapData["hac1"].shattuckPoint,mapKey: "hac1"};
      if ( building == "shattuck" ) {
        base.push(shattuckItem);
        mirror.push(hacItem);
      } else {
        base.push(hacItem);
        mirror.push(shattuckItem);
      }
      if ( toFinal.mapKey == "shattuck0a" ) instructions.push(`Go to level 0 of ${buildingNames["shattuck"]}`);
      else instructions.push(`Go to ${buildingNames[toBuilding]}`);
    } else if ( building != toBuilding ) {
      const {originDoor,destDoor} = shortestOutsideRoute(`${building}1`,`${toBuilding}1`);

      base.push({point: originDoor.inside,mapKey: `${building}1`});
      mirror.push({point: originDoor.outside,mapKey: "outside"});
      instructions.push(`Leave ${buildingNames[building]}`);

      base.push({point: destDoor.outside,mapKey: "outside"});
      mirror.push({point: destDoor.inside,mapKey: toFinal.mapKey});
      instructions.push(`Go to ${buildingNames[toBuilding]}`);
    }

    if ( toLevel != 1 && ! (shattuckHACCase && shattuck0ACase) ) {
      loadActiveMapData(toFinal.mapKey);
      const staircase = closestStaircase(toFinal,`${toBuilding}1`);

      base.push({point: staircase.paths[`${building}1`],mapKey: `${toBuilding}1`});
      mirror.push({point: staircase.point,mapKey: toFinal.mapKey});
      instructions.push(`Go to level ${Math.max(toLevel,0)}`);
      loadActiveMapData(fromFinal.mapKey);
    }
  }

  base.push(toFinal);
  mirror.push(null);
  instructions.push("Go to your destination");
  return {base,mirror,instructions};
}

function selectPoint(index) {
  lastPoint = index;
  drawer = clonePoint(points[lastPoint]);
}

function removeEdge(a,b) {
  edges = edges.filter(item => ! (item[0] == a && item[1] == b || item[0] == b && item[1] == a));
}

function mapDimsForViewDims(viewWidth,viewHeight,overallScale) {
  const scaleFactor = Math.min(viewWidth / maps[mapKey].width,viewHeight / maps[mapKey].height);
  const imageWidth = maps[mapKey].width * scaleFactor * overallScale;
  const imageHeight = maps[mapKey].height * scaleFactor * overallScale;
  const imageX = (viewWidth - imageWidth) / 2;
  const imageY = (viewHeight - imageHeight) / 2;
  return {
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    imageCenterX: imageX + imageWidth / 2,
    imageCenterY: imageY + imageHeight / 2
  };
}

function redrawView() {
  canvas.width = screen.availWidth + BUFFER * 2;
  canvas.height = document.getElementById("bottomBar").offsetTop - document.getElementById("canvasBox").offsetTop + BUFFER * 2;
  document.getElementById("canvasBox").style.height = `${document.getElementById("bottomBar").offsetTop - document.getElementById("canvasBox").offsetTop}px`;
  const viewWidth = canvas.width - BUFFER * 2;
  const viewHeight = canvas.height - BUFFER * 2;

  const {imageX,imageY,imageWidth,imageHeight,imageCenterX,imageCenterY} = mapDimsForViewDims(viewWidth,viewHeight,GLOBAL_SCALE);
  ctx.fillStyle = "white";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(
    maps[mapKey],
    0,
    0,
    maps[mapKey].width,
    maps[mapKey].height,
    BUFFER + imageX,
    BUFFER + imageY,
    imageWidth,
    imageHeight
  );

  if ( location.search == "?drawer" ) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(BUFFER + drawer.x,BUFFER + drawer.y,5,0,Math.PI * 2);
    ctx.fill();
    if ( keys.KeyW > 0 ) drawer.y -= 3;
    if ( keys.KeyA > 0 ) drawer.x -= 3;
    if ( keys.KeyS > 0 ) drawer.y += 3;
    if ( keys.KeyD > 0 ) drawer.x += 3;
    if ( keys.KeyI == 1 ) {
      keys.KeyI = 2;
      drawer.y -= 1;
    }
    if ( keys.KeyJ == 1 ) {
      keys.KeyJ = 2;
      drawer.x -= 1;
    }
    if ( keys.KeyK == 1 ) {
      keys.KeyK = 2;
      drawer.y += 1;
    }
    if ( keys.KeyL == 1 ) {
      keys.KeyL = 2;
      drawer.x += 1;
    }
    if ( keys.Space == 1 ) {
      keys.Space = 2;
      points.push(clonePoint(drawer));
      if ( lastPoint != -1 ) edges.push([lastPoint,points.length - 1]);
      lastPoint = points.length - 1;
    }
    if ( keys.KeyZ == 1 ) {
      keys.KeyZ = 2;
      lastPoint--;
      lastPoint = Math.max(lastPoint,0);
      drawer = clonePoint(points[lastPoint]);
    }
    if ( keys.KeyX == 1 ) {
      keys.KeyX = 2;
      lastPoint++;
      lastPoint = Math.min(lastPoint,points.length - 1);
      drawer = clonePoint(points[lastPoint]);
    }

    ctx.font = `${12 * GLOBAL_SCALE}px Arial`;
    for ( let i in points ) {
      if ( i != lastPoint ) ctx.fillStyle = "navy";
      else ctx.fillStyle = "cyan";
      ctx.beginPath();
      ctx.arc(BUFFER + translatedPoints[i].x,BUFFER + translatedPoints[i].y,5 * GLOBAL_SCALE,0,Math.PI * 2);
      ctx.fill();
    }
    for ( let i in points ) {
      ctx.fillStyle = "red";
      ctx.fillText(i,BUFFER + translatedPoints[i].x + 5,BUFFER + translatedPoints[i].y - 5);
    }
    for ( let i in edges ) {
      ctx.strokeStyle = "navy";
      ctx.lineWidth = 3 * GLOBAL_SCALE;
      ctx.beginPath();
      ctx.moveTo(BUFFER + translatedPoints[edges[i][0]].x,BUFFER + translatedPoints[edges[i][0]].y);
      ctx.lineTo(BUFFER + translatedPoints[edges[i][1]].x,BUFFER + translatedPoints[edges[i][1]].y);
      ctx.stroke();
    }
  }

  if ( navigationOn ) {
    let fromPoint = steps.base[stepIndex];
    if ( fromPoint.mapKey != steps.base[stepIndex + 1].mapKey ) fromPoint = steps.mirror[stepIndex];
    let path = getPointPath(fromPoint.point,steps.base[stepIndex + 1].point);
    
    ctx.strokeStyle = KEY_COLOR;
    ctx.lineWidth = 5 * GLOBAL_SCALE;
    ctx.setLineDash([7 * GLOBAL_SCALE,7 * GLOBAL_SCALE]);
    lineDashTick += 1 * GLOBAL_SCALE;
    lineDashTick %= 14 * GLOBAL_SCALE;
    ctx.lineDashOffset = -lineDashTick;

    let arcIndices = [];
    ctx.beginPath();
    ctx.moveTo(BUFFER + translatedPoints[path[0]].x,BUFFER + translatedPoints[path[0]].y);
    for ( let i = 1; i < path.length; i++ ) {
      let arcUsed = false;
      for ( const arc of arcs ) {
        if ( arc.points.indexOf(path[i - 1]) > -1 && arc.points.indexOf(path[i]) > -1 ) {
          const coreDirection = arc.points[0] == path[i - 1];
          const dist = Math.abs(translatedPoints[path[i - 1]].y - translatedPoints[path[i]].y) / 2;
          if ( arc.type == "half" ) {
            ctx.ellipse(
              BUFFER + translatedPoints[path[i]].x,
              BUFFER + Math.min(translatedPoints[path[i - 1]].y,translatedPoints[path[i]].y) + dist,
              dist,
              dist * arc.factor,
              -Math.PI / 2,
              coreDirection ? 0 : Math.PI,
              coreDirection ? Math.PI : 0,
              ! coreDirection
            );
          } else if ( arc.type == "quarter" ) {
            ctx.ellipse(
              BUFFER + Math.min(translatedPoints[path[i - 1]].x,translatedPoints[path[i]].x),
              BUFFER + Math.max(translatedPoints[path[i - 1]].y,translatedPoints[path[i]].y),
              Math.abs(translatedPoints[path[i - 1]].x - translatedPoints[path[i]].x),
              Math.abs(translatedPoints[path[i - 1]].y - translatedPoints[path[i]].y),
              0,
              coreDirection ? 3 * Math.PI / 2 : 0,
              coreDirection ? 0 : 3 * Math.PI / 2,
              ! coreDirection
            );
          }
          ctx.stroke();
          ctx.moveTo(BUFFER + translatedPoints[path[i]].x,BUFFER + translatedPoints[path[i]].y);
          arcIndices.push(i);
          arcUsed = true;
          break;
        }
      }
      if ( ! arcUsed ) ctx.lineTo(BUFFER + translatedPoints[path[i]].x,BUFFER + translatedPoints[path[i]].y);
    }
    ctx.stroke();

    ctx.lineWidth = 2 * GLOBAL_SCALE;
    ctx.setLineDash([1,0]);
    ctx.fillStyle = "white";
    for ( let i = 0; i < path.length; i++ ) {
      if (
        i > 0 &&
        i < path.length - 1 &&
        (
          (points[path[i]].x == points[path[i - 1]].x && points[path[i]].x == points[path[i + 1]].x) ||
          (points[path[i]].y == points[path[i - 1]].y && points[path[i]].y == points[path[i + 1]].y)
        ) &&
        arcIndices.indexOf(i) == -1 &&
        arcIndices.indexOf(i + 1) == -1
      ) continue;
      let radius = 5;
      if ( i == 0 || i == path.length - 1 ) radius = 8;
      radius *= GLOBAL_SCALE;
      ctx.beginPath();
      ctx.arc(BUFFER + translatedPoints[path[i]].x,BUFFER + translatedPoints[path[i]].y,radius,0,2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }

  window.requestAnimationFrame(redrawView);
}

function moveInstruction(change) {
  const oldKey = steps.base[stepIndex + 1].mapKey
  const newStepIndex = stepIndex + change;
  if ( newStepIndex < 0 || newStepIndex >= steps.base.length - 1 ) return;
  stepIndex = newStepIndex;
  if ( oldKey != steps.base[stepIndex + 1].mapKey ) loadActiveMapData(steps.base[stepIndex + 1].mapKey);
  document.getElementById("instruction").innerText = `${stepIndex + 1}. ${steps.instructions[stepIndex]}`;
  document.getElementById("leftArrow").classList.toggle("hidden",stepIndex <= 0);
  document.getElementById("rightArrow").classList.toggle("hidden",stepIndex >= steps.instructions.length - 1);
}

function generateSelectorTable() {
  const buildingRooms = {};
  for ( const key in mapData ) {
    const building = mapData[key].building;
    if ( building == "outside" ) continue;
    if ( ! buildingRooms[building] ) buildingRooms[building] = [];
    for ( const room in mapData[key].roomPoints ) {
      buildingRooms[building].push(room);
    }
  }

  let qrRoom,qrElement;
  if ( location.search.length > 1 && location.search != "?drawer" ) {
    let [qrKey,qrPoint] = location.search.slice(1).split(":");
    qrPoint = parseInt(qrPoint);
    for ( const [room,point] of Object.entries(mapData[qrKey].roomPoints) ) {
      if ( point == qrPoint ) {
        qrRoom = room;
        break;
      }
    }
  }

  function selectionButton(text) {
    const button = document.createElement("button");
    button.innerText = text;
    button.classList.add("selection");
    button.onclick = function() {
      selectItem(this);
    }
    if ( text == qrRoom ) {
      selectItem(button);
      qrElement = button;
    }
    return button;
  }

  let firstHeader;
  const table = document.getElementById("routeSelectorTable");
  for ( const building in buildingRooms ) {
    const headerRow = document.createElement("div");
    headerRow.classList.add("row");
    const headerItem = document.createElement("div");
    headerItem.colSpan = 2;
    headerItem.classList.add("header");
    headerItem.innerText = buildingNames[building];
    if ( ! firstHeader ) firstHeader = headerItem;
    headerRow.appendChild(headerItem);
    table.appendChild(headerRow);
    const rooms = buildingRooms[building];
    for ( let i = 0; i < rooms.length; i += 2 ) {
      const row = document.createElement("div");
      row.classList.add("row");
      const leftSelection = document.createElement("div");
      leftSelection.classList.add("selectionBox");
      leftSelection.appendChild(selectionButton(rooms[i]));
      row.appendChild(leftSelection);
      const rightSelection = document.createElement("div");
      if ( i + 1 < rooms.length ) {
        rightSelection.classList.add("selectionBox");
        rightSelection.appendChild(selectionButton(rooms[i + 1]));
      } else {
        rightSelection.classList.add("hidden");
      }
      row.appendChild(rightSelection);
      table.appendChild(row);
    }
  }
  const pad = document.createElement("div");
  pad.classList.add("pad");
  table.appendChild(pad);

  if ( qrElement ) {
    window.requestAnimationFrame(() => {
      table.scrollTop = qrElement.offsetTop - firstHeader.offsetTop;
    });
  }
}

function selectItem(button) {
  if ( fromFinal && toFinal ) return;
  button.classList.add("selected");

  let roomKey;
  for ( const key in mapData ) {
    if ( Object.keys(mapData[key].roomPoints).indexOf(button.innerText) > -1 ) {
      roomKey = key;
      break;
    }
  }

  if ( ! fromFinal ) {
    fromFinal = {
      mapKey: roomKey,
      point: mapData[roomKey].roomPoints[button.innerText]
    };
    button.classList.add("origin");
  } else {
    toFinal = {
      mapKey: roomKey,
      point: mapData[roomKey].roomPoints[button.innerText]
    };
    if ( toFinal.mapKey == fromFinal.mapKey && toFinal.point == fromFinal.point ) {
      button.classList.remove("selected");
      button.classList.remove("origin");
      fromFinal = null;
      toFinal = null;
    } else {
      button.classList.add("destination");
      stepIndex = 0;
      steps = constructSteps();
      moveInstruction(0);
      navigationOn = true;
      setTimeout(_ => {
        setSelectorOpen(false);
      },1000);
    }
  }
}

function setSelectorOpen(open) {
  const selector = document.getElementById("routeSelector");
  if ( open ) {
    if ( ! firstOpen ) {
      fromFinal = null;
      toFinal = null;
      const selections = document.getElementsByClassName("selection");
      for ( const selection of selections ) {
        selection.classList.remove("selected");
        selection.classList.remove("origin");
        selection.classList.remove("destination");
      }
    }
    selector.classList.remove("hidden");
    window.requestAnimationFrame(() => {
      if ( ! firstOpen ) document.getElementById("routeSelectorTable").scrollTop = 0;
      selector.classList.add("open");
      firstOpen = false;
    });
  } else {
    selector.classList.remove("open");
    setTimeout(() => {
      selector.classList.add("hidden");
    },1000);
  }
}

function loadActiveMapData(newMapKey) {
  mapKey = newMapKey;
  const activeMapData = mapData[mapKey];
  building = activeMapData.building;
  level = activeMapData.level;
  points = activeMapData.points.map(item => clonePoint(item));
  edges = activeMapData.edges;
  roomPoints = activeMapData.roomPoints;
  doorPoints = activeMapData.doorPoints;
  stairPoints = activeMapData.stairPoints;
  arcs = activeMapData.arcs || [];

  // this might need to be recalculated on change
  canvas.width = screen.availWidth + BUFFER * 2;
  canvas.height = document.getElementById("bottomBar").offsetTop - document.getElementById("canvasBox").offsetTop + BUFFER * 2;
  document.getElementById("canvasBox").style.height = `${document.getElementById("bottomBar").offsetTop - document.getElementById("canvasBox").offsetTop}px`;
  const viewWidth = canvas.width - BUFFER * 2;
  const viewHeight = canvas.height - BUFFER * 2;
  const {imageX,imageY,imageWidth,imageHeight,imageCenterX,imageCenterY} = mapDimsForViewDims(viewWidth,viewHeight,GLOBAL_SCALE);
  translatedPoints = points.map(item => clonePoint(item));
  const refImage = mapDimsForViewDims(390,675,1);
  for ( const i in translatedPoints ) {
    translatedPoints[i].x = (translatedPoints[i].x - refImage.imageCenterX) / refImage.imageWidth * imageWidth + imageCenterX;
    translatedPoints[i].y = (translatedPoints[i].y - refImage.imageCenterY) / refImage.imageHeight * imageHeight + imageCenterY;
  }
}

function loadMaps(mapList,callback) {
  let completed = 0;
  for ( const {key,path} of mapList ) {
    maps[key] = new Image();
    maps[key].onload = () => {
      completed++;
      if ( completed >= mapList.length ) callback();
    }
    maps[key].src = `maps/${path}`;
  }
}

window.onload = _ => {
  generateSelectorTable();
  if ( location.search != "?drawer" ) setSelectorOpen(true);

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  loadMaps([
    {key: "outside",path: "outside.png"},
    {key: "lib1",path: "lib 1st floor.png"},
    {key: "lib2",path: "lib 2nd floor.png"},
    {key: "shattuck1",path: "shattuck first floor.png"},
    {key: "shattuck2",path: "shattuck second floor.png"},
    {key: "shattuck0a",path: "shattuck basement a.png"},
    {key: "shattuck0b",path: "shattuck basement b.png"},
    {key: "hac1",path: "hac first floor.png"},
    {key: "hac2",path: "hac second floor.png"},
    {key: "ms1",path: "middle school first.png"},
    {key: "ms2",path: "middle school second.png"},
    {key: "baker1",path: "baker 1st floor.png"},
    {key: "baker2",path: "baker 2nd floor.png"},
  ],() => {
    loadActiveMapData("lib1");
    redrawView();
  });
}

window.onkeydown = event => {
  keys[event.code]++;
}

window.onkeyup = event => {
  keys[event.code] = 0;
}

window.onbeforeunload = _ => {
  //return "Did you save";
}