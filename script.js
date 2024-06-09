import { Survivor, Zombie,manupulateZombieArray,zombies } from "./playerAndZombies.mjs";
import { generateGround } from "./gameEvnironment.mjs";
import { SurvivorNormalGun, bullets , changeTheValue } from "./weapons.mjs";

const gameCanvas = document.getElementById("gameCanvas");
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;

gameCanvas.height = canvasHeight;
gameCanvas.width = canvasWidth;

const ctx = gameCanvas.getContext("2d");

const groundLevel = generateGround(ctx, canvasWidth);

const keys = {
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowUp: { pressed: false },
  ArrowDown: { pressed: false },
  Space: { pressed: false },
  LastPressed: "",
};

const survivor = new Survivor({
  position: {
    x: 700,
    y: groundLevel,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});



function populateWithZombies(numberOfZombies) {
  // loop to create regularzombie
  for (let index = 0; index < numberOfZombies; index++) {
    const position = {};
    position.x = Math.random() * canvasWidth;
    position.y = groundLevel;
    const zombie = new Zombie({
      position: position,
      survivor: survivor,
      velocity: {
        x: 1,
        y: 0,
      },
      zombieDimensions: {
        height: 150,
        width: 50,
      },
      index: index,
      zombieName: "regularZombie",
      zombieLife: 3,
    });
    manupulateZombieArray(true , zombie)
  }
}

const normalGun = new SurvivorNormalGun({
  survivor: survivor,
  groundLevel: groundLevel,
});

survivor.draw(ctx);
normalGun.draw(ctx);
survivor.weapons.push(normalGun);
populateWithZombies(5);


function startAnimation() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  generateGround(ctx, canvasWidth);
  survivor.move(keys);
  survivor.draw(ctx);
  normalGun.moveWithPlayer(survivor.position);
  normalGun.draw(ctx);
  zombies.forEach((zombie) => {
    zombie.run(ctx);
  });
  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw(ctx);
    if (bullet.position.x > canvasWidth || bullet.position.x < 0) {
      bullets.splice(index, 1);
    }
  });

  console.log(zombies.length);
  if (zombies.length <= 2) {
    console.log("Fired");
    populateWithZombies(10);
  }
  requestAnimationFrame(startAnimation);
}

startAnimation();

window.addEventListener("keydown", (e) => {
  if (keys[e.code] !== undefined) {
    keys[e.code].pressed = true;
    keys.LastPressed = e.code;
    if (e.code === "Space") {
      normalGun.shootTheBullet(bullets);
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (keys[e.code] !== undefined) {
    keys[e.code].pressed = false;
  }
});
