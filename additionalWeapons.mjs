import { survivor, ctx } from "./script.js";
import { Bullet, bullets } from "./weapons.mjs";

export class AdditionalWezapons {
  constructor({ type, dimensions, fireRate }) {
    this.type = type;
    this.dimensions = dimensions;
    this.fireRate = fireRate;
  }

  draw() {
    if (this.type == "gun") {
      ctx.save();
      ctx.fillStyle = "yellow";
      ctx.fillRect(
        survivor.position.x,
        survivor.position.y,
        this.dimension.length,
        this.dimension.width
      );
      ctx.restore();
    }
    if (this.type == "throw") {
    }
  }
  shootTheBullet() {
    if (this.type == "gun") {
        const bullet = new Bullet(this.bulletInfo);
        bullets.push(bullet);
    }

  }
}

export class MachineGun extends AdditionalWezapons {
  constructor() {
    super({
      type: "gun",
      dimensions: {
        length: 50,
        width: 20,
      },
      fireRate: 30,
    });
    this.selected = false;
    this.totalBullets = 3000;
    this.remainingBullets = 3000;
    this.direction = "right";
    this.weaponName = "machineGun"
    this.bulletInfo = {
      weapon: this,
      dimensions: {
        radius: 10,
      },
      velocity: {
        x: 20,
        y: 0,
      },
      direction: this.direction,
    };
  }
}
