import { survivor } from "./script.js";

function isInBetween(compare, coordinate1, coordinate2) {
  if (compare <= coordinate2 && compare >= coordinate1) {
    return true;
  }
  return false;
}

export function zombieTouchSurvivor({ zombie }) {
  const zombieLeftEnd = zombie.position.x;
  const zombieRightEnd = zombie.position.x + zombie.zombieDimensions.width;
  const survivorLeftEnd = survivor.position.x;
  const survivorRightEnd = survivor.position.x + survivor.width;

  if (
    isInBetween(survivorLeftEnd, zombieLeftEnd, zombieRightEnd) ||
    isInBetween(survivorRightEnd, zombieLeftEnd, zombieRightEnd)
  ) {
    return true;
  }
  return false;
}
