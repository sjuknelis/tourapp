let canvas,ctx,viewCanvas,viewCtx,map;
let currentBox = combinedBox(buildingBoxes["Baker"],buildingBoxes["Shattuck"]);
let nextBox = buildingBoxes["Baker"];
let transitionTime = 0;

function combinedBox(a,b) {
  let minX = Math.min(a.x,b.x);
  let maxX = Math.max(a.x + a.w,b.x + b.w);
  let minY = Math.min(a.y,b.y);
  let maxY = Math.max(a.y + a.h,b.y + b.h);
  return Rectangle(
    minX,
    minY,
    maxX - minX,
    maxY - minY
  );
}

function scaledTransitionBox(a,b,t) {
  t = Math.max(Math.min(t,1),0);
  let xd = b.x - a.x;
  let yd = b.y - a.y;
  let wd = b.w - a.w;
  let hd = b.h - a.h;
  return Rectangle(
    a.x + xd * t,
    a.y + yd * t,
    a.w + wd * t,
    a.h + hd * t,
  );
}

function redrawView() {
  ctx.drawImage(map,2,2,map.width - 2,map.height - 2,0,0,map.width,map.height);

  let boxInUse;
  if ( ! nextBox ) {
    boxInUse = currentBox;
  } else {
    boxInUse = scaledTransitionBox(currentBox,nextBox,transitionTime / 100);
    transitionTime += 5;
    if ( transitionTime >= 100 ) {
      currentBox = nextBox;
      nextBox = null;
      transitionTime = 0;
    }
  }
  viewCtx.clearRect(0,0,canvas.width,canvas.height);
  let viewDim = Math.max(boxInUse.w,boxInUse.h) + 20;
  viewCtx.drawImage(
    canvas,
    boxInUse.x + (boxInUse.w / 2) - (viewDim / 2),
    boxInUse.y + (boxInUse.h / 2) - (viewDim / 2),
    viewDim,
    viewDim,
    0,
    0,
    viewCanvas.width,
    viewCanvas.height
  );
}

window.onload = _ => {
  viewCanvas = document.getElementById("viewCanvas");
  viewCtx = viewCanvas.getContext("2d");
  canvas = new OffscreenCanvas(1,1);
  ctx = canvas.getContext("2d");
  map = new Image();
  map.onload = _ => {
    canvas.width = map.width;
    canvas.height = map.height;
    setInterval(redrawView,25);
  }
  map.src = "map_level1.png";
}
