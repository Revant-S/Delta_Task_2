import { survivor, groundLevel } from "./script.js";
import { FlyingZombie, PowerZombie, zombies } from "./zombies.mjs";
import { objectsCollideAlongX, objectsCollideAlongY, walls } from "./walls.mjs";
import { bullets } from "./weapons.mjs";
import { Survivor } from "./Survivor.mjs";

export function isInBetween(compare, coordinate1, coordinate2) {
  if (compare <= coordinate2 && compare >= coordinate1) {
    return true;
  }
  return false;
}

export function zombieTouchSurvivor({ zombie }) {
  if (zombie.type === "flying") {
    return;
  }
  const zombieLeftEnd = zombie.position.x - 20;
  const zombieRightEnd = zombie.position.x + zombie.dimensions.width + 20;
  const survivorLeftEnd = survivor.position.x - 2;
  const survivorRightEnd = survivor.position.x + survivor.width + 2;

  if (
    isInBetween(survivorLeftEnd, zombieLeftEnd, zombieRightEnd) ||
    isInBetween(survivorRightEnd, zombieLeftEnd, zombieRightEnd)
  ) {
    return true;
  }
  return false;
}

export function distanceWithSurvivor({ zombie }) {
  if (zombie.velocity.x > 0) {
    return survivor.position.x - (zombie.position.x + zombie.dimensions.width);
  } else {
    return zombie.position.x - survivor.position.x;
  }
}

export function checkCollisionWithWall(obj) {
  let toReturn = false
  walls.forEach((wall) => {
    if (
      objectsCollideAlongX({ obj1: obj, obj2: wall }) &&
      obj.position.y > wall.position.y
    ) {
      obj.velocity.x = 0;
      toReturn = true
    }
  });
  return toReturn
}

export function ckeckIfLandOnWAll(object) {
  let returnValue= false
  walls.forEach((wall) => {
    if (
      objectsCollideAlongY({ obj1: object, obj2: wall }) &&
      object.position.x + object.dimensions.width > wall.position.x &&
      object.position.x < wall.position.x + wall.dimensions.width
    ) {
      object.velocity.y = 0;
      returnValue = true
    }
  });
  return returnValue
}

export function checkCollisionWithZombie(zombieToCheck) {
  if (zombies.length <= 1) {
    return;
  }
  let toReturn = false
  zombies.forEach((zombie) => {
    if (zombie.index == zombieToCheck.index || zombie instanceof FlyingZombie) {
      return;
    }
    if (
      objectsCollideAlongX({ obj1: zombieToCheck, obj2: zombie }) &&
      zombieToCheck.position.y > zombie.position.y - zombie.dimensions.height
    ) {
      if (zombieToCheck instanceof PowerZombie ) {
        toReturn = true
      }else if(zombieToCheck instanceof Survivor){
        survivor.life --;
      }
       else {
        zombieToCheck.velocity.x = 0;
        zombie.velocity.x = 0
      }
    }
  });
  return toReturn
}

export function checkBulletWallContact(bullet) {
  for (let index = 0; index < walls.length; index++) {
    const wall = walls[index];
    if (
      bullet.position.x >= wall.position.x &&
      bullet.position.x <= wall.position.x + wall.dimensions.width &&
      bullet.position.y >= wall.position.y
    ) {

      wall.life--;
      console.log(wall);
      return true

    }

  }
  return false
}
