import { zombies, FlyingZombie } from "./zombies.mjs";
import { Survivor } from "./Survivor.mjs";
import { generateGround, createTheBase } from "./gameEvnironment.mjs";
import { bullets } from "./weapons.mjs";
import { showPauseMenu, gameIsPaused } from "./scoreDomElement.mjs";
import { renderPowerUps } from "./powerUpControls.mjs";
import { drawBackground } from "./sprit.mjs";

import {
  equipSurvivor,
  shoot,
  drawTheWeapon,
  switchTheWeapon,
} from "./weaponControl.mjs";
import { generateWalls, walls } from "./walls.mjs";
import { populateWithZombies } from "./levelControl.mjs";

export const groundLevel = 550;
let animationId;
let numberOfFrames = 0;
let holdFrames = 120;
let currentlySelectedWeapon = 0;
let currentlyShowingWeapon = 0;
const weaponDivList = document.querySelectorAll(".weaponOptionElement");
const gameCanvas = document.getElementById("gameCanvas");
export const canvasHeight = window.innerHeight;
export const canvasWidth = window.innerWidth;
const pauseBtn = document.getElementById("pauseBtn");
gameCanvas.height = canvasHeight;
gameCanvas.width = canvasWidth;
generateWalls([{
  x : 400,
  y : groundLevel-100
}, {
  x : 800 ,
  y : groundLevel-100
},
{
  x : 450,
  y : groundLevel-200
},
{
  x : 850,
  y : groundLevel -200
},
{
  x : 900,
  y : groundLevel-100
}
]);
export const ctx = gameCanvas.getContext("2d");
export const mousePosition = {
  x: undefined,
  y: undefined,
};

generateGround(ctx, canvasWidth);

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
export function chageBase(newBase) {
  base = newBase;
}
export const base = new createTheBase({ groundLevel, ctx });

equipSurvivor();
base.draw();
export const canonGun = survivor.weapons[0];
survivor.weapons.push(canonGun);

export function startAnimation() {
  if (gameIsPaused) {
    return;
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBackground();
  base.draw();
  survivor.move(keys);
  survivor.draw(ctx);
  drawTheWeapon();

  zombies.forEach((zombie) => {
    zombie.run(ctx, base);
    if (zombie instanceof FlyingZombie && !zombie.weapon.shot) {
      zombie.weapon.startShootingInterval();
      zombie.weapon.shot = true;
    }
  });

  bullets.forEach((bullet, index) => {
    bullet.update(index);
    bullet.draw(ctx);
    if (bullet.position.x > canvasWidth || bullet.position.x < 0) {
      bullets.splice(index, 1);
    }
  });
  canonGun.moveWithPlayer();
  numberOfFrames++;

  walls.forEach((wall) => {
    wall.draw(); 
  });
  if (numberOfFrames % holdFrames == 0) {
    populateWithZombies();
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

window.addEventListener("click", (e) => {
  shoot();
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
      currentlyShowingWeapon = 2;
    } else {
      currentlyShowingWeapon = (currentlyShowingWeapon - 1) % 3;
    }
  }
  if (e.code == "ArrowRight") {
    currentlyShowingWeapon = (currentlyShowingWeapon + 1) % 3;
  }
  weaponDivList[currentlyShowingWeapon].classList.add("show");
});
window.addEventListener("keydown", (e) => {
  if (e.code == "Enter") {
    switchTheWeapon(currentlySelectedWeapon, currentlyShowingWeapon);
    weaponDivList[currentlySelectedWeapon].classList.remove("selectedWeapon");
    weaponDivList[currentlyShowingWeapon].classList.remove("show");
    currentlySelectedWeapon = currentlyShowingWeapon;
    weaponDivList[currentlyShowingWeapon].classList.add("selectedWeapon");
  }
});
