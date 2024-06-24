import { ctx, groundLevel, mousePosition,isUnderSetup } from "./script.js";
import { StopWatch } from "./timer.mjs";
import { checkWallCollision, walls } from "./walls.mjs";
export let putTheWall = true
export const setUpTimer = new StopWatch();

function overLapExistingWall() {
  for (let index = 0; index < walls.length; index++) {
    const wall = walls[index];
    let imaginaryWall = {
      position: {
        x: mousePosition.x,
        y: mousePosition.y,
      },
      dimensions: {
        height: 100,
        width: 100,
      },
    };

    if (checkWallCollision(imaginaryWall)) {
      return true;
    }
  }
  return false;
}
function showOutLine() {
  if (!isUnderSetup) {
    return
  }
  if (mousePosition.x == undefined || mousePosition.y == undefined) {
    return
  }
  if (
    mousePosition.x < 0 ||
    mousePosition.x > window.innerWidth ||
    (mousePosition.y > groundLevel - 100 || overLapExistingWall())
  ) {
    putTheWall = false
    return;
  }
  putTheWall = true
  ctx.save();
  const x = mousePosition.x;
  const y = mousePosition.y;
  const width = 100;
  const height = 100;

  const perimeter = 2 * (width + height);
  const dotRadius = 1;
  const numDots = 100;
  const dotGap = (perimeter - numDots * 2 * dotRadius) / numDots;

  console.log("Hello");
  const dashArray = [];
  for (let i = 0; i < numDots; i++) {
    dashArray.push(dotRadius, dotGap);
  }
  ctx.strokeStyle = "white";
  ctx.setLineDash(dashArray);
  console.log(mousePosition);
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}

export function customSetupStart() {
  showOutLine();
}
