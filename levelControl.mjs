// Control The Zombies generation and the number
import { groundLevel } from "./gameEvnironment.mjs";
import { Zombie, FlyingZombie, PowerZombie } from "./playerAndZombies.mjs";
import { zombies } from "./playerAndZombies.mjs";
import { canvasWidth, randomInRange,base , survivor } from "./script.js";
import { manupulateZombieArray } from "./playerAndZombies.mjs";
import { ZombieWeapon } from "./zombieWeapon.mjs";

let flyingZombies = [];
let i = 0;
export function populateWithZombies() {
  for (let index = 0; index < 5; index++) {
    const position = {};
    let isOverlapping = true;

    while (isOverlapping) {
      if (index % 2 === 0) {
        position.x = randomInRange(0, base.leftEnd);
      } else {
        position.x = randomInRange(base.rigntEnd, canvasWidth);
      }

      position.y = groundLevel;

      isOverlapping = false;
      for (let i = 0; i < zombies.length; i++) {
        const existingZombie = zombies[i];
        const existingX = existingZombie.position.x;
        const existingWidth = existingZombie.zombieDimensions.width;

        // Check if the new zombie's position.x falls within the bounds of an existing zombie
        if (
          position.x < existingX + existingWidth + 10 &&
          position.x + 20 > existingX
        ) {
          isOverlapping = true;
          break;
        }
      }
    }
    if (index < 3) {
      const zombie = new Zombie({
        position: position,
        survivor: survivor,
        velocity: {
          x: 1,
          y: 0,
        },
        zombieDimensions: {
          height: 100,
          width: 15,
        },
        index: i,
        zombieName: "normalZombie",
        life: 3,
        base: base,
      });
      manupulateZombieArray(true, zombie);
    } else {
      const zombie = new PowerZombie({
        position: position,
        survivor: survivor,
        velocity: {
          x: 2,
          y: 0,
        },
        zombieDimensions: {
          height: 100,
          width: 15,
        },
        index: i,
        zombieName: "powerZombie",
        life: 5,
        base: base,
      });
      manupulateZombieArray(true, zombie);
      i++;
    }
  }
}

export function populateTheSky() {
  for (let index = 0; index < 2; index++) {
    const position = {};
    let isOverlapping = true;

    while (isOverlapping) {
      position.x = randomInRange(0, canvasWidth);
      position.y = 200;

      isOverlapping = false;
      for (let i = 0; i < flyingZombies.length; i++) {
        const existingZombie = flyingZombies[i];
        const existingX = existingZombie.position.x;
        const existingWidth = existingZombie.zombieDimensions.width;

        // Check if the new zombie's position.x falls within the bounds of an existing zombie
        if (
          position.x < existingX + existingWidth + 10 &&
          position.x - 20 > existingX
        ) {
          isOverlapping = true;
          break;
        }
      }
    }
    const zombie = new FlyingZombie({
      position: position,
      survivor: survivor,
      velocity: {
        x: 2,
        y: 0,
      },
      zombieDimensions: {
        height: 15,
        width: 100,
      },
      index: i,
      zombieName: "flyingZombie",
      life: 5,
      base: base,
    });
    const zombieWeapon = new ZombieWeapon({ zombie });
    zombie.weapon = zombieWeapon;
    flyingZombies.push(zombie)
    manupulateZombieArray(true, zombie);
    i++;
  }
}
