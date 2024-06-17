import { survivor, ctx } from "./script.js";
import { Bullet, bullets } from "./weapons.mjs";

export class AdditionalWezapons {
  constructor({ type, dimensions, fireRate }) {
    this.type = type;
    this.dimension = dimensions;
    this.fireRate = fireRate;
    this.position = { x: 0, y: 0 };
  }

  draw() {
    if (this.type === "gun") {
      ctx.save();
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        this.position.x,
        this.position.y,
        this.dimension.width,
        this.dimension.height
      );
      ctx.restore();
    }
    if (this.type === "throw") {
      // Add logic for throw weapons if needed
    }
  }

  shootTheBullet() {
    if (this.type === "gun") {
      for (let index = 0; index < 10; index++) {
        const bullet = new Bullet(this.bulletInfo);
        bullet.position.x += index * 5 * (this.direction === "right" ? 1 : -1); // Adjust the spread amount here
        bullets.push(bullet);
      }
    }
  }
}

export class MachineGun extends AdditionalWezapons {
  constructor() {
    super({
      type: "gun",
      dimensions: {
        width: 60,
        height: 10,
      },
      fireRate: 30,
    });
    this.selected = true;
    this.totalBullets = 30000;
    this.remainingBullets = 30000;
    this.direction = "right";
    this.weaponName = "machineGun";
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
        x: 15,
        y: 0,
      },
      direction: this.direction,
    };
  }

  moveWithPlayer() {
    this.position.x = survivor.position.x;
    if (this.direction === "left") {
      this.position.x = survivor.position.x - this.dimension.width + survivor.width;
    }
    this.position.y = survivor.position.y - survivor.height + 20;
  }

  shootTheBullet() {
    if (this.remainingBullets < 10) return;

    this.remainingBullets -= 10; 

    for (let index = 0; index < 10; index++) {
      const bullet = new Bullet(this.bulletInfo);
      bullet.position = { 
        x: this.position.x + index * 40 * (this.direction === "right" ? 1 : -1),
        y: this.position.y + this.dimension.height / 2,
      };
      bullets.push(bullet);
    }
  }
}


export class granite extends AdditionalWezapons{

}