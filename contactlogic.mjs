import { survivor } from "./script.js";
import { zombies } from "./playerAndZombies.mjs";
import { groundLevel } from "./gameEvnironment.mjs";

export function isInBetween(compare, coordinate1, coordinate2) {
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

export function distanceWithSurvivor({zombie}) {
  if (zombie.velocity.x >0) {
    return survivor.position.x-(zombie.position.x+ zombie.zombieDimensions.width)
  }
  else{
    return zombie.position.x - survivor.position.x
  }
}


export function zombieTouchOtherZombie({ zombie }) {
  for (const zombieToCheck of zombies) {
    if (zombie.index === zombieToCheck.index) continue;

    const leftSide = zombie.position.x;
    const rightSide = zombie.position.x + zombie.zombieDimensions.width;

    const leftSidezombieToCheck = zombieToCheck.position.x;
    const rightSidezombieToCheck = zombieToCheck.position.x + zombieToCheck.zombieDimensions.width;

    const distanceBetweenZombies = 15;

    const disZombie = distanceWithSurvivor({ zombie: zombie });
    const disZombieToCheck = distanceWithSurvivor({ zombie: zombieToCheck });

    if (
      (leftSide < rightSidezombieToCheck + distanceBetweenZombies && rightSide > leftSidezombieToCheck) ||
      (rightSide > leftSidezombieToCheck - distanceBetweenZombies && leftSide < rightSidezombieToCheck)
    ) {
      if (disZombie < disZombieToCheck) {
        zombieToCheck.velocity.x = 0;
        zombie.velocity.x = zombie.originalVelocity.x;
      } else {
        zombie.velocity.x = 0;
        zombieToCheck.velocity.x = zombieToCheck.originalVelocity.x;
      }
    } else {
      // Reset velocity if no collision is detected
      zombie.velocity.x = zombie.originalVelocity.x;
      zombieToCheck.velocity.x = zombieToCheck.originalVelocity.x;
    }
  }
}
