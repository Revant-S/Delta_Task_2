import { Zombie, FlyingZombie, PowerZombie } from "./zombies.mjs";
import { zombies } from "./zombies.mjs";
import { groundLevel } from "./script.js";
import { manupulateZombieArray } from "./zombies.mjs";
import { ZombieWeapon } from "./zombieWeapon.mjs";
import { StopWatch } from "./timer.mjs";
let xPosition = 0;
let zombieIndex = 0;
let count = 0;
let skyZombies = [];
const zombieTimer = new StopWatch();
const zombiesInfo = {
  normalZombies: {
    position: { x: 4, y: 0 },
    velocity: {
      x: 1,
      y: 0,
    },
    dimensions: {
      height: 70,
      width: 15,
    },
    index: zombieIndex,
    zombieName: "normalZombie",
    life: 3,
  },
  flyingZombie: {
    position: { x: window.innerWidth - 120, y: 400 },
    velocity: {
      x: -2,
      y: 0,
    },
    dimensions: {
      height: 15,
      width: 100,
    },
    index: zombieIndex,
    zombieName: "flyingZombie",
    life: 5,
  },
  powerzombie: {
    position: { x: 0, y: 0 },
    velocity: {
      x: 2,
      y: 0,
    },
    dimensions: {
      height: 70,
      width: 15,
    },
    index: zombieIndex,
    zombieName: "powerZombie",
    life: 5,
  },
};
function switchxPosition() {
  if (xPosition == 0) {
    xPosition = window.innerWidth
    return
  }
  xPosition = 0;
}



export function populateWithZombies() {
  if (zombies.length >= 8) {
    return
  }
  console.log("Index blbglreul;iuealulyewrkluyvwrkuyewkuyvkluyv   " + count);
  console.log("zombie created");
  console.log(zombies);
  if (count % 2 == 0) {
    zombiesInfo["normalZombies"].index = zombieIndex;
    zombiesInfo["normalZombies"].position = {
      x: xPosition,
      y: groundLevel - zombiesInfo["normalZombies"].dimensions.height,
    };
    const zombie = new Zombie(zombiesInfo["normalZombies"]);
    manupulateZombieArray(true, zombie);
    zombieIndex++;
    count++;
    switchxPosition()
  } else if (count % 3 == 0) {
    if (skyZombies.length > 2) {
      return;
    }
    zombiesInfo["flyingZombie"].index = zombieIndex;
    const zombie = new FlyingZombie(zombiesInfo["flyingZombie"]);
    const zombieWeapon = new ZombieWeapon({ zombie });
    zombie.weapon = zombieWeapon;
    manupulateZombieArray(true, zombie);
    count++;
    skyZombies.push(zombie);
    zombieIndex++;
  } else if (count % 5 == 0) {
    zombiesInfo["powerzombie"].position.x = xPosition
    zombiesInfo["powerzombie"].index = zombieIndex;
    const zombie = new PowerZombie(zombiesInfo["powerzombie"]);
    count++;
    manupulateZombieArray(true, zombie);
    zombieIndex++;
    switchxPosition()
  } else {
    count++;
  }
}
