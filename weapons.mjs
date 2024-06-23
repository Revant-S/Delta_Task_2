import { ctx, groundLevel, survivor } from "./script.js";
import {
  updateNumberOfBullets,
  canonBullets,
  machineGunBullet,
} from "./scoreDomElement.mjs";
import { checkBulletWallContact } from "./contactlogic.mjs";
import { checkGraniteTime } from "./weaponControl.mjs";
import { StopWatch } from "./timer.mjs";
export let bullets = [];
export let gravity = 0.4;

export function changeTheValue(add, object) {
  if (add) {
    bullets.push(object);
    return;
  }
  bullets.splice(object.index, 1);
}

export class Bullet {
  constructor({ weapon, dimensions, velocity, direction }) {
    this.weapon = weapon;

    this.dimensions = dimensions;
    this.direction = direction;

    if (this.weapon.type == "gun" || this.weapon.type == "throw") {
      this.position = {
        x:
          direction === "right"
            ? weapon.position.x + weapon.dimension.width
            : weapon.position.x,
        y: weapon.position.y + weapon.dimension.height / 2,
      };
      this.velocity = {
        x: direction === "right" ? velocity.x : -velocity.x,
        y: velocity.y,
      };
    } else {
      this.velocity = velocity;
      this.position = direction;
      if (this.position.y + this.dimensions.radius >= groundLevel) {
        this.velocity.y *= -0.9;
        this.position.y = groundLevel - this.dimensions.radius;
      }
    }
  }

  draw() {
    if (this.dimensions.shape === "circle") {
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.dimensions.radius,
        0,
        Math.PI * 2
      );
      if (this.owner == "zombie") {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "green";
      }
      ctx.fill();
      ctx.stroke();
    }
  }

  update(indexOfBullet) {
    if (this.position.y === groundLevel) {
      this.velocity.y *= -1;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y += gravity;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    const isBulletHit = checkBulletWallContact(this);
    if (isBulletHit && !(this.weapon instanceof Granite)) {
      const j = bullets.indexOf(this);
      bullets.splice(j, 1);
    }
    if (isBulletHit && this.weapon instanceof Granite) {
      this.velocity.x *= -1;
    }
    if (this.weapon instanceof Granite) {
      let goFurther = checkGraniteTime(this, indexOfBullet);
      if (goFurther) {
        return;
      }
    }
    if (this.position.y + this.dimensions.radius >= groundLevel) {
      this.velocity.y *= -0.9;
      this.position.y = groundLevel - this.dimensions.radius;
    }
    this.draw();
  }
}

export class Canon {
  constructor() {
    this.angle = 0;
    this.totalBullets = 1000;
    this.remainingBullets = 1000;
    this.displayName = "Normal Gun Bullets";
    this.selected = true;
    this.dimensions = {
      length: 50,
      width: 20,
    };
    this.center = {
      x: survivor.position.x,
      y: survivor.position.y - survivor.dimensions.height + 50,
    };
    this.weaponName = "Normal Gun";
    this.type = "canon";
    this.bulletInfo = {
      weapon: this,
      dimensions: {
        shape: "circle",
        radius: 10,
      },
      velocity: {
        x: 15 * Math.cos(this.angle),
        y: 15 * Math.sin(this.angle),
      },
      direction: {
        x: this.center.x + this.dimensions.length * Math.cos(this.angle),
        y:
          groundLevel -
          survivor.height +
          this.dimensions.length * Math.sin(this.angle),
      },
    };
  }

  draw(ctx, angle) {
    ctx.save();
    ctx.translate(this.center.x, this.center.y);
    ctx.rotate(angle);
    this.angle = angle;
    ctx.fillStyle = "black";
    ctx.fillRect(
      0,
      -this.dimensions.width / 2,
      this.dimensions.length,
      this.dimensions.width
    );
    ctx.restore();
  }
  moveWithPlayer() {
    this.center.x = survivor.position.x + 10;
    this.center.y = survivor.position.y - survivor.dimensions.height + 40;
  }
  updateBulletInfo() {
    this.bulletInfo.velocity = {
      x: 15 * Math.cos(this.angle),
      y: 15 * Math.sin(this.angle),
    };
    if (this instanceof Granite) {
      this.bulletInfo.velocity = {
        x: 2 * Math.cos(this.angle),
        y: 2 * Math.sin(this.angle),
      };
    }
    this.bulletInfo.direction = {
      x: this.center.x + this.dimensions.length * Math.cos(this.angle),
      y:
        groundLevel -
        survivor.height +
        this.dimensions.length * Math.sin(this.angle),
    };
  }
  followTheMouse({ mouseCoordinates, ctx }) {
    let mouseX = mouseCoordinates.x - this.center.x;
    let mouseY = mouseCoordinates.y - this.center.y;
    this.angle = Math.atan2(mouseY, mouseX);
    this.draw(ctx, this.angle);
    this.updateBulletInfo();
  }

  shootTheBullet() {
    this.remainingBullets--;
    if (this.remainingBullets < 0) return;
    updateNumberOfBullets({ object: this, domElement: canonBullets });
    console.log(this.bulletInfo);
    const bullet = new Bullet(this.bulletInfo);
    console.log(bullet);
    bullets.push(bullet);
  }
}

export class MachineGun extends Canon {
  constructor() {
    super();
    this.selected = false;
    this.totalBullets = 3000;
    this.remainingBullets = 3000;
    this.direction = "right";
    this.weaponName = "machineGun";
    this.displayName = "Machine Gun";
    this.position = {
      x: survivor.position.x,
      y: survivor.position.y,
    };
    this.bulletInfo = {
      weapon: this,
      dimensions: {
        shape: "circle",
        radius: 10,
      },
      velocity: {
        x: 2 * Math.cos(this.angle),
        y: 2 * Math.sin(this.angle),
      },
      direction: {
        x: this.center.x + this.dimensions.length * Math.cos(this.angle),
        y:
          groundLevel -
          survivor.height +
          this.dimensions.length * Math.sin(this.angle),
      },
    };
  }

  shootTheBullet() {
    if (this.remainingBullets < 10) return;
    this.remainingBullets -= 10;
    updateNumberOfBullets({ object: this, domElement: machineGunBullet });

    for (let i = 0; i < 10; i++) {
      const bulletXOffset = 40 * i * Math.cos(this.angle);
      const bulletYOffset = 40 * i * Math.sin(this.angle);

      const bulletInfo = {
        weapon: this,
        dimensions: {
          shape: "circle",
          radius: 10,
        },
        velocity: {
          x: 15 * Math.cos(this.angle),
          y: 15 * Math.sin(this.angle),
        },
        direction: {
          x: this.center.x + bulletXOffset,
          y: this.center.y + bulletYOffset,
        },
      };

      const bullet = new Bullet(bulletInfo);
      bullets.push(bullet);
    }
  }
}

export class Granite extends Canon {
  constructor() {
    super();
    this.selected = false;
    this.totalBullets = 20;
    this.remainingBullets = 20;
    this.displayName = "Granite Gun";
    this.direction = "right";
    this.position = {
      x: survivor.position.x,
      y: survivor.position.y - survivor.height,
    };
    this.bulletInfo = {
      weapon: this,
      dimensions: {
        shape: "circle",
        radius: 10,
      },
      velocity: {
        x: 15 * Math.cos(this.angle),
        y: 15 * Math.sin(this.angle),
      },
      direction: {
        x: this.center.x + this.dimensions.length * Math.cos(this.angle),
        y:
          groundLevel -
          survivor.height +
          this.dimensions.length * Math.sin(this.angle),
      },
    };
  }
  shootTheBullet() {  
    if (this.remainingBullets < 0) return;

    this.remainingBullets -= 1;

    const bullet = new Bullet(this.bulletInfo);
    const timer = new StopWatch();
    timer.start();
    bullet.timer = timer;
    bullets.push(bullet);
  }
}
