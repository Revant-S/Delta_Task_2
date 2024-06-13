import { bullets, changeTheValue, gravity } from "./weapons.mjs";
import { groundLevel } from "./gameEvnironment.mjs";
import { base } from "./script.js";
import { ctx } from "./script.js";
import { updateTheScoreBoard } from "./gameInfo.mjs";
import { zombieTouchSurvivor } from "./contactlogic.mjs";
import { isInBetween } from "./contactlogic.mjs";

export function drawHealthBar({ object }) {
  let healthBarPositionY = object.position.y - 25;
  let healthBarPositionX = object.position.x;
  let lifeRemaining = object.life;
  let totalLife = object.totalLife;
  let percentage = lifeRemaining / totalLife;
  let totalLen = 30;

  if (object.name == "survivor") {
    healthBarPositionY -= object.height;
    totalLen = 80;
  }
  if (object.name == "regularZombie") {
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

function hasTheBulletHit(movingObject) {
  if (!bullets || !bullets.length) return false;

  for (const bullet of bullets) {
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

export class Survivor {
  constructor({ position, velocity }) {
    this.position = position;
    this.name = "survivor";
    this.color = "red";
    this.life = 1000;
    this.totalLife = 1000;
    this.velocity = velocity;
    this.originalVelocity = velocity;
    this.height = 200;
    this.width = 50;
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
      if (this.weapons[0]) {
        this.weapons[0].direction = "left";
      }
    }
    if (keys["KeyD"].pressed && keys.LastPressed == "KeyD") {
      this.velocity.x += 4;
      if (this.weapons[0]) {
        this.weapons[0].direction = "right";
      }
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
    this.position = position; // position.y is the position of the base
    this.velocity = velocity;
    this.zombieDimensions = zombieDimensions;
    this.survivorToFollow = survivor;
    this.isAlive = true;
    this.zombieName = zombieName;
    this.life = life;
    this.totalLife = 3;
    this.isOnGround = true;
    this.isOnTheWall = false;
    this.isOverWall = false;
  }

  kill() {
    manupulateZombieArray(false, this);
    this.survivorToFollow.score += 5;
    updateTheScoreBoard({ survivor: this.survivorToFollow });
  }

  jump() {
    if (this.isOnGround) {
      this.velocity.y = -4;
      this.isOnGround = false;
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
      }
      return;
    }
    if (zombieTouchSurvivor({ zombie: this })) {
      this.survivorToFollow.life--;
      if (this.totalLife > this.life) {
        this.life += 0.25;
      } else {
        this.totalLife += 0.25;
        this.life += 0.25;
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
    const rightSideLeftWall = base.wallCoordinates.left.x + base.wallDimensions.left.width;
    const topsideLeftWall = groundLevel - base.wallDimensions.left.height;
    const bottomLeftWall = base.wallCoordinates.left.y;

    // wallSide
    //Right
    const leftSideRightWall = base.wallCoordinates.right.x;
    const rightSideRightWall = base.wallCoordinates.right.x + base.wallDimensions.right.width;
    const topsideRightWall = groundLevel - base.wallDimensions.right.height;
    const bottomRightWall = base.wallCoordinates.right.y;

    // Check if the zombie should jump onto the wall
    if (
      (isInBetween(rightSide, leftSideLeftWall, rightSideLeftWall) ||
        isInBetween(leftSide, leftSideLeftWall , rightSideLeftWall) ||
        isInBetween(rightSide, leftSideRightWall, rightSideRightWall ) ||
        isInBetween(leftSide, leftSideRightWall, rightSideRightWall ))
    ) {
      if (
        (isInBetween(bottom, topsideLeftWall, bottomLeftWall) ||
          isInBetween(bottom, topsideRightWall, bottomRightWall)) &&
        !this.isOnTheWall
      ) {
        this.velocity.y = 0;
        this.position.y = topsideLeftWall;
        this.isOnTheWall = true;
        this.isOnGround = false
      } else if (!this.isOnTheWall) {
        this.jump();
      }
    }
    else{
      this.isOnTheWall = false
    }
    // Apply gravity if the zombie is not on the ground or on the wall
    if (bottom < groundLevel && !this.isOnTheWall && !this.isOnGround) {
      this.velocity.y += gravity;
    }
    if (bottom > groundLevel && !this.isOnGround) {
      this.velocity.y = 0
      this.position.y = groundLevel;
      this.isOnGround = true;
      this.isOnTheWall = false
    }

    // Move the zombie
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Follow the survivor
    if (this.survivorToFollow.position.x - this.position.x < 0) {
      this.velocity.x = -1 * Math.abs(this.velocity.x);
    } else {
      this.velocity.x = Math.abs(this.velocity.x);
    }

    // Check if the zombie has reached the end of the wall
    if (this.isOnTheWall) {
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
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.position.x,
      this.position.y - this.zombieDimensions.height,
      this.zombieDimensions.width,
      this.zombieDimensions.height
    );
  }
}
