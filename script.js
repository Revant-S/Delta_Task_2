import {
  Survivor,
  Zombie,
  manupulateZombieArray,
  zombies,
  changeNormalZpoints,
} from "./playerAndZombies.mjs";
import { generateGround, createTheBase } from "./gameEvnironment.mjs";
import { bullets, Canon } from "./weapons.mjs";
import { showPauseMenu, gameIsPaused } from "./gameInfo.mjs";
import { renderPowerUps } from "./powerUpControls.mjs";

import { equipSurvivor, shoot, drawTheWeapon } from "./weaponControl.mjs";
let animationId;

const weaponOptions = document.getElementById("weaponOptions");
let currentlySelectedWeapon = 1;
let currentlyShowingWeapon = 1;
const weaponDivList = document.querySelectorAll(".weaponOptionElement");
const numberOfZombiesArray = [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
const gameCanvas = document.getElementById("gameCanvas");
const canvasHeight = window.innerHeight;
export const canvasWidth = window.innerWidth;
const pauseBtn = document.getElementById("pauseBtn");
gameCanvas.height = canvasHeight;
gameCanvas.width = canvasWidth;

export const ctx = gameCanvas.getContext("2d");
export const mousePosition = {
  x: undefined,
  y: undefined,
};

const groundLevel = generateGround(ctx, canvasWidth);

const keys = {
  KeyA: { pressed: false },
  KeyD: { pressed: false },
  KeyW: { pressed: false },
  KeyS: { pressed: false },
  Space: { pressed: false },
  LastPressed: "",
};
export function clearAnimationId() {
  cancelAnimationFrame(animationId);
}
export const survivor = new Survivor({
  position: {
    x: 700,
    y: groundLevel,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

export function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export const base = new createTheBase({ groundLevel, ctx });

function populateWithZombies(numberOfZombies) {
  for (let index = 0; index < numberOfZombies; index++) {
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
      index: index,
      zombieName: "regularZombie",
      life: 3,
      base: base,
    });
    manupulateZombieArray(true, zombie);
  }
}

//  call equip
equipSurvivor();
base.draw();
export const canonGun = new Canon({
  ctx: ctx,
  canonTowerDetails: base.canonTowerDetails,
});
export const normalGun = survivor.weapons[0];
survivor.weapons.push(canonGun);
populateWithZombies(3);

export function startAnimation() {
  console.log(gameIsPaused);
  if (gameIsPaused) {
    return;
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  base.draw();
  generateGround(ctx, canvasWidth);
  survivor.move(keys);
  survivor.draw(ctx);
  drawTheWeapon();

  zombies.forEach((zombie) => {
    zombie.run(ctx, base);
  });
  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw(ctx);
    if (bullet.position.x > canvasWidth || bullet.position.x < 0) {
      bullets.splice(index, 1);
    }
  });
  if (zombies.length <= 0) {
    numberOfZombiesArray.shift();
    // populateWithZombies(numberOfZombiesArray[0]);
    populateWithZombies(3);
    changeNormalZpoints({
      left: base.wallCoordinates.left,
      right: base.wallCoordinates.right + base.wallDimensions.width,
    });
  }
  renderPowerUps();
  clearAnimationId();
  animationId = requestAnimationFrame(startAnimation);
}

startAnimation();

window.addEventListener("keydown", (e) => {
  if (keys[e.code] !== undefined) {
    keys[e.code].pressed = true;
    keys.LastPressed = e.code;
    if (e.code === "Space") {
      normalGun.shootTheBullet(bullets);
      shoot();
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (keys[e.code] !== undefined) {
    keys[e.code].pressed = false;
  }
});

window.addEventListener("mousemove", (e) => {
  mousePosition.x = e.x;
  mousePosition.y = e.y - 60.3;
});

window.addEventListener("click", () => {
  canonGun.shoot();
});

window.addEventListener("load", () => {
  pauseBtn.addEventListener("click", () => {
    showPauseMenu();
  });
});

window.addEventListener("keydown", (e) => {
  weaponDivList[currentlyShowingWeapon].classList.remove("show");
  if (e.code == "ArrowLeft") {
    if (currentlyShowingWeapon == 0) {
      currentlyShowingWeapon = 3;
    } else {
      currentlyShowingWeapon = (currentlyShowingWeapon - 1) % 4;
    }
  }
  if (e.code == "ArrowRight") {
    currentlyShowingWeapon = (currentlyShowingWeapon + 1) % 4;
  }
  weaponDivList[currentlyShowingWeapon].classList.add("show");
});
window.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    weaponDivList[currentlySelectedWeapon].classList.remove("selectedWeapon");
    weaponDivList[currentlyShowingWeapon].classList.remove("show");
    weaponDivList[currentlyShowingWeapon].classList.add("selectedWeapon");
    currentlySelectedWeapon = currentlyShowingWeapon;
  }
});
