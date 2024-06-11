import { bullets, changeTheValue, gravity } from "./weapons.mjs";
import { groundLevel } from "./gameEvnironment.mjs";
import { base } from "./script.js";

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
    this.color = "red";
    this.life = 100;
    this.velocity = velocity;
    this.originalVelocity = velocity;
    this.height = 200;
    this.width = 50;
    this.isJumping = false;
    this.isOnGround = true;
    this.isStandingOnTheWall = false;
    this.weapons = [];
    this.originalPosition = position;
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
        this.isStandingOnTheWall = true
    }
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
        base.wallCoordinates.right.y - base.wallDimensions.right.height;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  // For the left wall
}

export class Zombie {
  constructor({
    position,
    survivor,
    velocity,
    zombieDimensions,
    index,
    zombieName,
    zombieLife,
  }) {
    this.index = index;
    this.name = zombieName;
    this.position = position;
    this.velocity = velocity;
    this.zombieDimensions = zombieDimensions;
    this.survivorToFollow = survivor;
    this.zombieLife = zombieLife;
    this.isAlive = true;
    this.zombieName = zombieName;
  }

  kill() {
    manupulateZombieArray(false, this);
  }

  run(ctx, base) {
    if (!this.isAlive) return;

    if (hasTheBulletHit(this)) {
      this.isAlive = false;
      this.kill();
      return;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // Follow the survivors
    if (this.survivorToFollow.position.x - this.position.x < 0) {
      this.velocity.x = -1 * Math.abs(this.velocity.x);
      this.velocity.y = -1 * Math.abs(this.velocity.y);
    } else {
      this.velocity.x = Math.abs(this.velocity.x);
      this.velocity.y = Math.abs(this.velocity.y);
    }
    if (this.zombieName === "regularZombie") {
      const baseBoundariesleft = base.wallCoordinates.left.x;
      const baseBoundariesRight =
        base.wallCoordinates.right.x + base.wallDimensions.right.width;

      if (this.velocity.x > 0) {
        if (
          this.position.x + this.zombieDimensions.width >=
          normalZStopPoint.left
        ) {
          this.velocity.x = 0;
          this.position.x = normalZStopPoint.left - this.zombieDimensions.width;
          normalZStopPoint.left = this.position.x - 5;
        }
      } else if (this.velocity.x < 0) {
        if (this.position.x <= normalZStopPoint.right) {
          this.velocity.x = 0;
          this.position.x = normalZStopPoint.right;
          normalZStopPoint.right =
            this.position.x + this.zombieDimensions.width + 5;
        }
      }

      if (
        this.position.x + this.zombieDimensions.width >= baseBoundariesleft &&
        this.velocity.x > 0
      ) {
        this.velocity.x = -1 * Math.abs(this.velocity.x);
        this.velocity.y = -1 * Math.abs(this.velocity.y);
        normalZStopPoint.left = this.position.x;
      } else if (
        this.position.x <= baseBoundariesRight &&
        this.velocity.x < 0
      ) {
        this.velocity.x = Math.abs(this.velocity.x);
        this.velocity.y = Math.abs(this.velocity.y);
        normalZStopPoint.right = this.position.x + this.zombieDimensions.width;
      }
    }
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.position.x,
      this.position.y - this.zombieDimensions.height,
      this.zombieDimensions.width,
      this.zombieDimensions.height
    );
  }
}
