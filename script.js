import {
  Survivor,
  Zombie,
  manupulateZombieArray,
  zombies,
  changeNormalZpoints
} from "./playerAndZombies.mjs";
import { generateGround, createTheBase } from "./gameEvnironment.mjs";
import { SurvivorNormalGun, bullets, changeTheValue,Canon } from "./weapons.mjs";

const gameCanvas = document.getElementById("gameCanvas");
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;
gameCanvas.height = canvasHeight;
gameCanvas.width = canvasWidth;

const ctx = gameCanvas.getContext("2d");
const mousePosition = {
  x : undefined,
  y : undefined

}


const groundLevel = generateGround(ctx, canvasWidth);

const keys = {
  KeyA: { pressed: false },
  KeyD: { pressed: false },
  KeyW: { pressed: false },
  KeyS: { pressed: false },
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

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const base = new createTheBase({ groundLevel, ctx });

function populateWithZombies(numberOfZombies) {
  for (let index = 0; index < numberOfZombies; index++) {
    const position = {};
    let isOverlapping = true;

    while (isOverlapping) {
      if (index % 2 === 0) {
        position.x = randomInRange(0, base.wallCoordinates.left.x);
      } else {
        position.x = randomInRange(
          base.wallCoordinates.right.x + base.wallDimensions.right.width,
          canvasWidth
        );
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
        height: 150,
        width: 25,
      },
      index: index,
      zombieName: "regularZombie",
      zombieLife: 3,
      base: base,
    });
    manupulateZombieArray(true, zombie);
  }
}

const normalGun = new SurvivorNormalGun({
  survivor: survivor,
  groundLevel: groundLevel,
});

base.draw();
survivor.draw(ctx);
normalGun.draw(ctx);
const canonGun = new Canon({ctx:ctx,
  canonTowerDetails : base.canonTowerDetails
})

survivor.weapons.push(normalGun);
survivor.weapons.push(canonGun)
populateWithZombies(8);

function startAnimation() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  base.draw();
  generateGround(ctx, canvasWidth);
  survivor.move(keys);
  survivor.draw(ctx);
  normalGun.moveWithPlayer(survivor.position);
  normalGun.draw(ctx);
  canonGun.draw(ctx)
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
    populateWithZombies(8);
    changeNormalZpoints({
      left : base.wallCoordinates.left,
      right : base.wallCoordinates.right+base.wallDimensions.width 
    })
  }
  requestAnimationFrame(startAnimation);
}

startAnimation();

window.addEventListener("keydown", (e) => {
  console.log(e);
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

window.addEventListener("mousemove",(e)=>{
  console.log(e);
  mousePosition.x = e.x;
  mousePosition.y = e.y
}

)