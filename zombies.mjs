import { bullets, changeTheValue, gravity, Granite } from "./weapons.mjs";
import { canvasWidth, survivor, groundLevel } from "./script.js";
import { ctx } from "./script.js";
import { updateTheScoreBoard } from "./scoreDomElement.mjs";
import {
  zombieTouchSurvivor,
  checkCollisionWithZombie,
  checkCollisionWithWall,
  ckeckIfLandOnWAll,
} from "./contactlogic.mjs";
import { Sprite } from "./sprit.mjs";
import { Survivor } from "./Survivor.mjs";
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
    healthBarPositionY -= object.dimensions.height;
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
    const bulletPosition = bullet.position;
    const bulletRadius = bullet.dimensions.radius;
    const zombiePosition = movingObject.position;
    const zombieWidth = movingObject.dimensions.width;
    const zombieHeight = movingObject.dimensions.height;

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
function getTheZombie(zombie) {
  const index = zombie.Zombieindex
  for (let i = 0; i < zombies.length; i++) {
    const element = zombies[i];
    if (element.Zombieindex === index) {
      return i
    }
  }
  return -1;
}

export class Zombie {
  static zombieIndex = 0;
  constructor({ position, velocity, dimensions, zombieName, life }) {
    this.Zombieindex = Zombie.zombieIndex++
    this.name = zombieName;
    this.position = position;
    this.velocity = velocity;
    this.originalVelocity = { ...velocity };
    this.dimensions = dimensions;
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
    survivor.score += 5;
    const index = getTheZombie(this)
   
    zombies.splice(index,1)
    updateTheScoreBoard({ survivor: survivor });
    if (this instanceof FlyingZombie) {
      this.weapon.alive = false;
    }

  }

  run(ctx) {
    drawHealthBar({ object: this });
    if (!this.isAlive) return;
    console.log(hasTheBulletHit(this));
    if (hasTheBulletHit(this)) {
      this.life -= 1;
      if (!this.life) {
        this.isAlive = false;
        this.kill();
        return;
      }
    }

    if (zombieTouchSurvivor({ zombie: this })) {
      let frames = 18
      let offset = {x:30 , y : 120}
      if (this instanceof PowerZombie) {
        frames = 8
        offset = {x:20 , y : 100}

      }
      if (this.direction == "right") {
        this.updateSprite("Attack", frames, 3, offset, true);
      } else {
        let frames = 18
      if (this instanceof PowerZombie) {
        frames = 8
      }
        this.updateSprite("Attack2", frames, 3, offset, true);
      }
      this.isAttacking = true;
      if (!survivor.isImmune) {
        survivor.life -= 0.25;
      }

      if (survivor.noinAirOfZAfterImmunity > 4) {
        survivor.isImmune = false;
      }
      this.sprite.update();
    } else {
      this.isAttacking = false;
    }
    const leftSide = this.position.x;
    const rightSide = this.position.x + this.dimensions.width;

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
    if (this.position.y > groundLevel) {
      this.velocity.y = 0;
      this.inAir = false;
    }
    const s = checkCollisionWithZombie(this);
    if (s && this instanceof PowerZombie) {
      this.velocity.y -= 4;
      this.inAir = true;
    }

    const p = checkCollisionWithWall(this);
    if (p && this instanceof PowerZombie) {
      this.velocity.y -= 2;
      this.inAir = true;
    }
    const t = ckeckIfLandOnWAll(this);
    if (t) {
      this.inAir = false;
    }
    if (this.inAir) {
      this.velocity.y += gravity;
    }

    if (this.position.x < 0 || this.position.x > window.innerWidth) {
      this.velocity.x*=-1;
    }

    // Move the zombie
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.type == "flying") {
      this.weapon.moveWithTheZombie();
    }
    if (!this.isAttacking) {
      if (this.velocity.x == 0 && !(this instanceof PowerZombie)) {
        if (this.direction == "right") {
          this.updateSprite("ZIdle", 11, 3);
        } else {
          this.updateSprite("ZIdleLeft", 11, 3);
        }
        this.sprite.update();
      } else if (this.velocity.x > 0) {
        let frames = 13
        if (this instanceof PowerZombie) {
          frames = 10
        }
        this.updateSprite("Walk", frames, 3);
        this.sprite.update();
        this.direction = "right";
      } else {
        let frames = 13
        if (this instanceof PowerZombie) {
          frames = 10
        }
        this.updateSprite("WalkRight", frames, 3);
        this.sprite.update();
        this.direction = "left";
      }
    }
  }
  updateSprite(
    sprite,
    frames,
    framesHold,
    newOffeset = { x: 20, y: 106 },
    changeOffset = false
  ) {
    (this.sprite.frames = frames), (this.framesHold = framesHold);
    if (!(this instanceof PowerZombie)) {
      this.sprite.image.src = `./spriteAnimations/skeletonZombie/${sprite}.png`;
     
      if (changeOffset) {
        this.sprite.offset = newOffeset;
      } else {
        this.sprite.offset = { x: 20, y: 106 };
      }
    }
    else if (this instanceof PowerZombie) {
      this.sprite.image.src = `./spriteAnimations/powerZombie/${sprite}.png`;
      if (changeOffset) {
        this.sprite.offset = newOffeset;
      } else {
        this.sprite.offset = { x: 50, y: 100 };
      }
    }
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
    dimensions,
    index,
    zombieName,
    velocity,
    life,
  }) {
    super({
      position,
      survivor,
      velocity: { x: 0, y: 0 },
      dimensions,
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
    this.sprite = new Sprite({
      position: this.position,
      imageSrc: "./spriteAnimations/powerZombie/idleLeft.png",
      scale: { x: 0.20, y: 0.20 },
      offset: {
        x: 1,
        y: 1,
      },
      dimensions: {
        height: this.height,
        width: this.width,
      },
      frames: 15,
      framesHold: 3,
    });
  }
}
export class FlyingZombie extends Zombie {
  constructor({
    position,
    survivor,
    dimensions,
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
      dimensions,
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
