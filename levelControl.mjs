import { Zombie,  PowerZombie } from "./zombies.mjs";
import { groundLevel } from "./script.js";
import { manupulateZombieArray } from "./zombies.mjs";

let xPosition = 0;
let count = 0;


const zombiesInfo = {
  normalZombies: {
    position: { x: 80, y: 300 },
    velocity: {
      x: 1,
      y: 0,
    },
    dimensions: {
      height: 70,
      width: 25,
    },

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
    index: Zombie.zombieIndex++,
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
      height: 90,
      width: 40,
    },
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

  if (count % 2 == 0) {
    zombiesInfo["normalZombies"].position = {
      x: xPosition,
      y: groundLevel - zombiesInfo["normalZombies"].dimensions.height,
    };

    const zombie = new Zombie(zombiesInfo["normalZombies"]);
    zombie.velocity = {
      x : 1,
      y: 0
    }
    console.log(zombie);
    manupulateZombieArray(true, zombie);
    count++;
    switchxPosition()
  } 
  else if (count % 5 == 0) {
    zombiesInfo["powerzombie"].position.x = xPosition
    
    const zombie = new PowerZombie(zombiesInfo["powerzombie"]);
    zombie.velocity = {
      x : 2,
      y : 0
    }
    console.log(zombie);
    count++;
    manupulateZombieArray(true, zombie);
    switchxPosition()
  } else {
    count++;
  }
}
