import { bullets, changeTheValue, gravity, Granite } from "./weapons.mjs";
import { base, canvasWidth, survivor, groundLevel } from "./script.js";
import { ctx } from "./script.js";
import { updateNumberOfBullets, updateTheScoreBoard } from "./gameInfo.mjs";
import {
  zombieTouchSurvivor,
  zombieTouchOtherZombie,
  checkSurvivorCollision,
  ckeckIfLandOnWAll
} from "./contactlogic.mjs";
import { isInBetween } from "./contactlogic.mjs";
import { anyPowerUpTaken } from "./powerUpControls.mjs";
import { Sprite } from "./sprit.mjs";
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
    return;
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
          if (
            zombieA instanceof FlyingZombie &&
            zombieB instanceof FlyingZombie
          ) {
            // Reverse direction for both flying zombies
            zombieA.velocity.x = -zombieA.velocity.x;
            zombieB.velocity.x = -zombieB.velocity.x;
          } else {
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
    this.isAlive = true;
    this.originalVelocity = { ...velocity };
    this.height = 130;
    this.width = 40;
    this.isJumping = false;
    this.dimensions = {
      height: this.height,
      width: this.width,
    };
    this.isOnGround = true;
    this.isStandingOnTheWall = false;
    this.weapons = [];
    this.originalPosition = position;
    this.score = 0;
    this.direction = "right";
    this.once = false;
    this.sprite = new Sprite({
      position: this.position,
      imageSrc: "./spriteAnimations/character/Idle.png",
      scale: { x: 2, y: 2 },
      offset: {
        x: 100,
        y: 255,
      },
      dimensions: {
        height: this.height,
        width: this.width,
      },
      frames: 7,
      framesHold: 3,
    });
  }
  updateSprite(sprite, frames, framesHold) {
    this.sprite.image.src = `./spriteAnimations/character/${sprite}.png`;
    (this.sprite.frames = frames), (this.framesHold = framesHold);
  }
  draw() {
    if (!this.once) {
      this.sprite.position.y -= this.sprite.dimensions.height;
      this.once = true;
    }
    this.sprite.draw();
  }

  move(keys) {
    if (this.life < 0) {
      alert("GAME OVER !!!!");
      return;
    }
    if (this.velocity.x != 0) {
      if (this.velocity.x < 0) {
        this.updateSprite("RunLeft", 8, 13);
      } else {
        this.updateSprite("Run", 8, 13);
      }
    } else {
      if (this.direction == "right") {
        this.updateSprite("Idle", 7, 13);
      } else {
        this.updateSprite("IdleLeft", 7, 13);
      }
    }
    this.sprite.update();
    anyPowerUpTaken();
    drawHealthBar({ object: this });
    this.velocity.x = 0;
    if (this.position.y >= groundLevel) {
      this.position.y = groundLevel;
      this.velocity.y = 0;
      this.isJumping = false;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
      this.velocity.y += gravity;
    }

    if (keys["KeyA"].pressed && keys.LastPressed == "KeyA") {
      this.velocity.x -= 5;
      updateWeaponDirection("left");
      this.direction = "left";
    }
    if (keys["KeyD"].pressed && keys.LastPressed == "KeyD") {
      this.velocity.x += 5;
      this.direction = "right";

      updateWeaponDirection("right");
    }
    if (keys["KeyW"].pressed && keys.LastPressed == "KeyW") {
      this.velocity.y = -8; // Jump velocity
      this.isJumping = true;
      this.isOnGround = false;
    }
    checkSurvivorCollision();
    ckeckIfLandOnWAll();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
export class Zombie {
  constructor({
    position,
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
    this.isAlive = true;
    this.zombieName = zombieName;
    this.life = life;
    this.totalLife = 3;
    this.isOnGround = true;
    this.isOnTheWall = false;
    this.isOverWall = false;
    this.once = false;
    this.color = "green";
    this.isAttacking = false;
    this.touchingTheWall = false;
    this.offsetOriginal = {
      x: 20,
      y: 106,
    };
    this.sprite = new Sprite({
      position: this.position,
      imageSrc: "./spriteAnimations/character/ZIdle.png",
      scale: { x: 2.75, y: 3.3 },
      offset: {
        x: 20,
        y: 106,
      },
      dimensions: {
        height: this.height,
        width: this.width,
      },
      frames: 11,
      framesHold: 5,
    });
  }

  kill() {
    this.isAlive = false;
    manupulateZombieArray(false, this);
    survivor.score += 5;
    updateTheScoreBoard({ survivor: survivor });
    if (this instanceof FlyingZombie) {
      this.weapon.alive = false;
    }
  }

  run(ctx) {
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
      if (this.direction == "right") {
        this.updateSprite("Attack", 18, 3);
      } else {
        this.updateSprite("Attack2", 18, 3);
      }
      this.isAttacking = true;
      this.velocity.x = 0;
      if (!survivor.isImmune) {
        survivor.life -= 0.25;
      }

      if (survivor.noOfZAfterImmunity > 4) {
        survivor.isImmune = false;
      }
      this.sprite.update();
    } else {
      this.isAttacking = false;
    }
    const leftSide = this.position.x;
    const rightSide = this.position.x + this.zombieDimensions.width;

    // Follow the survivor
    if (!(this instanceof FlyingZombie)) {
      if (survivor.position.x - this.position.x < 0) {
        this.velocity.x = -1 * Math.abs(this.originalVelocity.x);
      } else {
        this.velocity.x = Math.abs(this.originalVelocity.x);
      }
    } else {
      if (leftSide < 0 || rightSide >= canvasWidth) {
        this.velocity.x *= -1;
      }
    }

    if (this.isAttacking) {
      this.velocity.x = 0;
    }
    if (this.position.y < groundLevel && !(this instanceof FlyingZombie)) {
      this.velocity.y += gravity;
    }
    if (this.position.y >= groundLevel) {
      this.velocity.y = 0;
    }

    // Move the zombie
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.type == "flying") {
      this.weapon.moveWithTheZombie();
    }
    if (!this.isAttacking) {
      if (this.velocity.x == 0) {
        if (this.direction == "right") {
          this.updateSprite("ZIdle", 11, 3);
        } else {
          this.updateSprite("ZIdleLeft", 11, 3);
        }
        this.sprite.update();
      } else if (this.velocity.x > 0) {
        this.updateSprite("Walk", 13, 3);
        this.sprite.update();
        this.direction = "right";
      } else {
        this.updateSprite("WalkRight", 13, 3);
        this.sprite.update();
        this.direction = "left";
      }
    }
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y - this.zombieDimensions.height,
      this.zombieDimensions.width,
      this.zombieDimensions.height
    );
  }
  updateSprite(sprite, frames, framesHold) {
    this.sprite.image.src = `./spriteAnimations/skeletonZombie/${sprite}.png`;
    (this.sprite.frames = frames), (this.framesHold = framesHold);
  }
  draw() {
    if (!this.once) {
      this.sprite.position.y -= this.sprite.dimensions.height;
      this.once = true;
    }
    this.sprite.draw();
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
    this.inAir = false;
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
