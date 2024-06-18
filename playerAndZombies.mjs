import { bullets, changeTheValue, gravity } from "./weapons.mjs";
import { groundLevel } from "./gameEvnironment.mjs";
import { base, canvasWidth, survivor } from "./script.js";
import { ctx } from "./script.js";
import { updateNumberOfBullets, updateTheScoreBoard } from "./gameInfo.mjs";
import {
  zombieTouchSurvivor,
  zombieTouchOtherZombie,
} from "./contactlogic.mjs";
import { isInBetween } from "./contactlogic.mjs";
import { anyPowerUpTaken } from "./powerUpControls.mjs";
import { Granite } from "./additionalWeapons.mjs";

export function updateWeaponDirection(direction) {
  survivor.weapons.forEach((weapon) => {
    if (weapon.type == "gun" || weapon.type == "throw") {
      weapon.direction = direction;
      if (weapon.bulletInfo) {
        weapon.bulletInfo.direction = direction;
      }
    }
  });
}

export function drawHealthBar({ object }) {
  if (object.life == 0 || !object.isAlive) {
    return
  }
  let healthBarPositionY = object.position.y - 25;
  let healthBarPositionX = object.position.x;
  let lifeRemaining = object.life;
  let totalLife = object.totalLife;
  let percentage = lifeRemaining / totalLife;
  let totalLen = 30;

  if (object instanceof Survivor) {
    healthBarPositionY -= object.height;
    totalLen = 80;
  }
  if (object instanceof Zombie) {
    healthBarPositionY -= object.zombieDimensions.height;
  }
  let innerLen = totalLen * percentage;
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(healthBarPositionX, healthBarPositionY, totalLen, 15);
  ctx.fillStyle = "rgb(86, 240, 86)";
  ctx.fillRect(healthBarPositionX, healthBarPositionY, innerLen, 15);
  ctx.strokeStyle = "black";
  ctx.strokeRect(healthBarPositionX, healthBarPositionY, totalLen, 15);
  ctx.restore();

  return;
}

let groundLevelForSurvivor = groundLevel;
export let zombies = [];
export let normalZStopPoint = {
  left: undefined,
  right: undefined,
};
export function changeNormalZpoints(obj) {
  normalZStopPoint = obj;
}

export function manupulateZombieArray(add, object) {
  if (add) {
    zombies.push(object);
  } else {
    zombies.splice(object.index, 1);
    // Update indices of remaining zombies
    zombies.forEach((zombie, index) => {
      zombie.index = index;
    });
  }
}
function bulletHitSurvivor(bullet) {
  let leftSide = survivor.position.x;
  let rightSide = survivor.position.x + survivor.width;
  let top = survivor.position.y - survivor.height;
  let bottom = survivor.position.y;
  // bullet top , bottom and sides
  let bulletTop = bullet.position.y - bullet.dimensions.radius;
  let bulletBottom = bullet.position.y + bullet.dimensions.radius;
  let bulletRight = bullet.position.x + bullet.dimensions.radius;
  let bulletLeft = bullet.position.x - bullet.dimensions.radius;

  //
  if (
    bulletRight >= leftSide &&
    bulletLeft <= rightSide &&
    bulletBottom >= top &&
    bulletTop <= bottom
  ) {
    return true;
  }
}
function hasTheBulletHit(movingObject) {
  if (!bullets || !bullets.length) return false;

  for (const bullet of bullets) {
    if (bullet.weapon instanceof Granite) {
      continue;
    }
    if (bullet.owner == "zombie") {
      if (bulletHitSurvivor(bullet)) {
        changeTheValue(false, bullet);
        survivor.life -= 2;
      }

      continue;
    }
    const bulletPosition = bullet.position;
    const bulletRadius = bullet.dimensions.radius;
    const zombiePosition = movingObject.position;
    const zombieWidth = movingObject.zombieDimensions.width;
    const zombieHeight = movingObject.zombieDimensions.height;

    const bulletLeft = bulletPosition.x - bulletRadius;
    const bulletRight = bulletPosition.x + bulletRadius;
    const bulletTop = bulletPosition.y - bulletRadius;
    const bulletBottom = bulletPosition.y + bulletRadius;

    const zombieLeft = zombiePosition.x;
    const zombieRight = zombiePosition.x + zombieWidth;
    const zombieTop = zombiePosition.y - zombieHeight;
    const zombieBottom = zombiePosition.y;

    if (
      bulletRight >= zombieLeft &&
      bulletLeft <= zombieRight &&
      bulletBottom >= zombieTop &&
      bulletTop <= zombieBottom
    ) {
      changeTheValue(false, bullet);
      return true;
    }
  }
  return false;
}


export function preventZombieOverlap() {
  for (let i = 0; i < zombies.length; i++) {
    for (let j = i + 1; j < zombies.length; j++) {
      const zombieA = zombies[i];
      const zombieB = zombies[j];

      const ax1 = zombieA.position.x;
      const ay1 = zombieA.position.y - zombieA.zombieDimensions.height;
      const ax2 = ax1 + zombieA.zombieDimensions.width;
      const ay2 = zombieA.position.y;

      const bx1 = zombieB.position.x;
      const by1 = zombieB.position.y - zombieB.zombieDimensions.height;
      const bx2 = bx1 + zombieB.zombieDimensions.width;
      const by2 = zombieB.position.y;

      if (ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1) {

        const overlapX = Math.min(ax2, bx2) - Math.max(ax1, bx1);

        const overlapY = Math.min(ay2, by2) - Math.max(ay1, by1);

        if (overlapX > 0 && overlapY > 0) {
    
          if (overlapX < overlapY) {
            if (zombieA.position.x < zombieB.position.x) {
              zombieA.position.x -= overlapX / 2;
              zombieB.position.x += overlapX / 2;
            } else {
              zombieA.position.x += overlapX / 2;
              zombieB.position.x -= overlapX / 2;
            }
          } else {
            if (zombieA.position.y < zombieB.position.y) {
              zombieA.position.y -= overlapY / 2;
              zombieB.position.y += overlapY / 2;
            } else {
              zombieA.position.y += overlapY / 2;
              zombieB.position.y -= overlapY / 2;
            }
          }
        }
      }
    }
  }
}
export class Survivor {
  constructor({ position, velocity }) {
    this.position = position;
    this.name = "survivor";
    this.color = "red";
    this.isImmune = false;
    this.noOfZAfterImmunity = 0;
    this.life = 1000;
    this.totalLife = 1000;
    this.velocity = velocity;
    this.isAlive = true
    this.originalVelocity = { ...velocity };
    this.height = 120;
    this.width = 30;
    this.isJumping = false;
    this.isOnGround = true;
    this.isStandingOnTheWall = false;
    this.weapons = [];
    this.originalPosition = position;
    this.score = 0;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y - this.height,
      this.width,
      this.height
    );
    ctx.fill();
  }

  move(keys) {
    if (this.life < 0) {
      alert("GAME OVER !!!!");
      return;
    }
    anyPowerUpTaken();
    drawHealthBar({ object: this });
    this.velocity.x = 0;
    if (this.position.y >= groundLevel) {
      this.position.y = groundLevelForSurvivor;
      this.velocity.y = 0;
      this.isJumping = false;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
      this.velocity.y += gravity;
    }

    if (keys["KeyA"].pressed && keys.LastPressed == "KeyA") {
      this.velocity.x -= 4;

      updateWeaponDirection("left");
    }
    if (keys["KeyD"].pressed && keys.LastPressed == "KeyD") {
      this.velocity.x += 4;

      updateWeaponDirection("right");
    }
    if (keys["KeyW"].pressed && keys.LastPressed == "KeyW") {
      this.velocity.y = -8; // Jump velocity
      this.isJumping = true;
      this.isOnGround = false;
    }

    if (
      this.position.x + this.width >= base.wallCoordinates.right.x &&
      this.position.x + this.width <=
        base.wallCoordinates.right.x + base.wallDimensions.right.width &&
      keys.LastPressed == "KeyD" &&
      this.position.y >= base.wallCoordinates.right.y
    ) {
      this.velocity.x = 0;
    }
    if (
      this.position.x >= base.wallCoordinates.left.x &&
      this.position.x <=
        base.wallCoordinates.left.x + base.wallDimensions.left.width &&
      keys.LastPressed == "KeyA" &&
      this.position.y >= base.wallCoordinates.left.y
    ) {
      this.velocity.x = 0;
    }
    // for right wall
    if (
      ((this.position.x >= base.wallCoordinates.right.x &&
        this.position.x <=
          base.wallCoordinates.right.x + base.wallDimensions.right.width) ||
        (this.position.x + this.width >= base.wallCoordinates.right.x &&
          this.position.x + this.width <=
            base.wallCoordinates.right.x + base.wallDimensions.right.width)) &&
      this.position.y >
        base.wallCoordinates.right.y - base.wallDimensions.right.height &&
      this.position.y < groundLevel
    ) {
      this.velocity.y = 0;
      this.position.y =
        base.wallCoordinates.right.y - base.wallDimensions.right.height;
      this.isStandingOnTheWall = true;
    }

    // For the left wall
    if (
      ((this.position.x >= base.wallCoordinates.left.x &&
        this.position.x <=
          base.wallCoordinates.left.x + base.wallDimensions.left.width) ||
        (this.position.x + this.width >= base.wallCoordinates.left.x &&
          this.position.x + this.width <=
            base.wallCoordinates.left.x + base.wallDimensions.left.width)) &&
      this.position.y >
        base.wallCoordinates.left.y - base.wallDimensions.left.height &&
      this.position.y < groundLevel
    ) {
      this.velocity.y = 0;
      this.position.y =
        base.wallCoordinates.left.y - base.wallDimensions.left.height;
      this.isStandingOnTheWall = true;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
export class Zombie {
  constructor({
    position,
    survivor,
    velocity,
    zombieDimensions,
    index,
    zombieName,
    life,
  }) {
    this.index = index;
    this.name = zombieName;
    this.position = position;
    this.velocity = velocity;
    this.originalVelocity = { ...velocity };
    this.zombieDimensions = zombieDimensions;
    this.survivorToFollow = survivor;
    this.isAlive = true;
    this.zombieName = zombieName;
    this.life = life;
    this.totalLife = 3;
    this.isOnGround = true;
    this.isOnTheWall = false;
    this.isOverWall = false;
    this.color = "green";
    this.touchingTheWall = false;
  }

  kill() {
    this.isAlive = false;
    manupulateZombieArray(false, this);
    this.survivorToFollow.score += 5;
    updateTheScoreBoard({ survivor: this.survivorToFollow });
    if (this instanceof FlyingZombie) {
      this.weapon.alive = false;
    }
  }

  run(ctx, base) {
    drawHealthBar({ object: this });
    if (!this.isAlive) return;

    if (hasTheBulletHit(this)) {
      this.life -= 1;
      if (!this.life) {
        this.isAlive = false;
        this.kill();
        return;
      }
    }
    if (zombieTouchSurvivor({ zombie: this })) {
      if (!this.survivorToFollow.isImmune) {
        this.survivorToFollow.life -= 0.25;
      }

      if (this.survivorToFollow.noOfZAfterImmunity > 4) {
        this.survivorToFollow.isImmune = false;
      }
    }

    // zombie sides
    const leftSide = this.position.x;
    const rightSide = this.position.x + this.zombieDimensions.width;
    const topPart = groundLevel - this.zombieDimensions.height;
    const bottom = this.position.y;

    // wallSides
    //left
    const leftSideLeftWall = base.wallCoordinates.left.x;
    const rightSideLeftWall =
      base.wallCoordinates.left.x + base.wallDimensions.left.width;
    const topsideLeftWall = groundLevel - base.wallDimensions.left.height;
    const bottomLeftWall = base.wallCoordinates.left.y;

    // wallSide
    //Right
    const leftSideRightWall = base.wallCoordinates.right.x;
    const rightSideRightWall =
      base.wallCoordinates.right.x + base.wallDimensions.right.width;
    const topsideRightWall = groundLevel - base.wallDimensions.right.height;
    const bottomRightWall = base.wallCoordinates.right.y;

    // Check if the zombie should jump onto the wall

    if (
      isInBetween(rightSide, leftSideLeftWall, rightSideLeftWall) ||
      isInBetween(leftSide, leftSideLeftWall, rightSideLeftWall) ||
      isInBetween(rightSide, leftSideRightWall, rightSideRightWall) ||
      isInBetween(leftSide, leftSideRightWall, rightSideRightWall)
    ) {
      if (
        (isInBetween(bottom, topsideLeftWall, bottomLeftWall) ||
          isInBetween(bottom, topsideRightWall, bottomRightWall)) &&
        !this.isOnTheWall
      ) {
        if (this instanceof PowerZombie) {
          this.velocity.y = 0;
          this.position.y = isInBetween(bottom, topsideLeftWall, bottomLeftWall)
            ? topsideLeftWall
            : topsideRightWall;
          this.isOnTheWall = true;
          this.isOnGround = false;
        } else if (!(this instanceof FlyingZombie)) {
          this.velocity.x = 0;
          this.touchingTheWall = true;
        }
      }
    } else {
      this.isOnTheWall = false;

      // Apply gravity if the zombie is not on the ground or on the wall
      if (bottom < groundLevel && !this.isOnTheWall && !this.isOnGround) {
        this.velocity.y += gravity;
      }
      if (bottom > groundLevel && !this.isOnGround) {
        this.velocity.y = 0;
        this.position.y = groundLevel;
        this.isOnGround = true;
        this.isOnTheWall = false;
      }
    }

    // Follow the survivor
    if (this.survivorToFollow.position.x - this.position.x < 0 ) {
      this.velocity.x = -1 * Math.abs(this.originalVelocity.x);
    } else {
      this.velocity.x = Math.abs(this.originalVelocity.x);
    }

    if (!(this instanceof PowerZombie) && !(this instanceof FlyingZombie) ) {
      if (this.velocity.x >0 && isInBetween(rightSide , leftSideLeftWall,rightSideLeftWall)) {
        this.velocity.x = 0 
        this.position.x-=1;
      }
      else if (this.velocity.x < 0 && isInBetween(leftSide,leftSideRightWall,rightSideRightWall)) {
        this.velocity.x = 0;
        this.position.x+=1;
      }
      else if (this.velocity.x > 0 && isInBetween(rightSide , leftSideRightWall , rightSideRightWall)) {
        this.velocity.x = 0;
        this.position.x -=1
      }
      else if (this.velocity.x <0 && isInBetween(leftSide, leftSideLeftWall, rightSideLeftWall)) {
        this.velocity.x = 0;
        this.position.x += 1
      }
    }

    // Move the zombie
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.type == "flying") {
      this.weapon.moveWithTheZombie();
    }

    // Check if the zombie has reached the end of the wall
    if (this.isOnTheWall && this.type !== "flying") {
      if (
        (this.position.x + this.zombieDimensions.width < leftSideLeftWall ||
          this.position.x > rightSideLeftWall) &&
        (this.position.x + this.zombieDimensions.width < leftSideRightWall ||
          this.position.x > rightSideRightWall)
      ) {
        this.isOnTheWall = false;
      }
    }

    // Draw the zombie
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y - this.zombieDimensions.height,
      this.zombieDimensions.width,
      this.zombieDimensions.height
    );
  }
}
export class PowerZombie extends Zombie {
  constructor({
    position,
    survivor,
    zombieDimensions,
    index,
    zombieName,
    velocity,
    life,
  }) {
    super({
      position,
      survivor,
      velocity: { x: 0, y: 0 },
      zombieDimensions,
      index,
      zombieName,
      life: 5,
    });

    this.velocity = velocity;
    this.life = life;
    this.color = "grey";
    this.totalLife = 5;
    this.originalVelocity = { ...velocity };
  }
}
export class FlyingZombie extends Zombie {
  constructor({
    position,
    survivor,
    zombieDimensions,
    index,
    zombieName,
    velocity,
    life,
    weapon,
  }) {
    super({
      position: { x: position.x, y: 100 },
      survivor,
      velocity: { x: 3, y: 0 },
      zombieDimensions,
      index,
      zombieName,
      life: 5,
    });

    this.velocity = velocity;
    this.life = life;
    this.color = "yellow";
    this.totalLife = 5;
    this.originalVelocity = { ...velocity };
    this.type = "flying";
    this.weapon = weapon;
  }
}
