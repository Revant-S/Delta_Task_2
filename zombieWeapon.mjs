import { Bullet, bullets } from "./weapons.mjs";
import { ctx } from "./script.js";
export class ZombieWeapon {
  constructor({ zombie }) {
    (this.position = {
      x: zombie.position.x,
      y: zombie.position.y,
    }),
      (this.dimension = {
        width: 5,
        height: 10,
      });
    this.totalBullets = 10;
    this.remainingBullets = 10;
    this.weaponName = "zombieGun";
    this.type = "gun";
    this.selected = true;
    this.direction = "right";
    this.zombie = zombie;
    this.shot = false
    this.shootingIntervalId = null;
    this.alive = true
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.bulletInfo = {
      weapon: this,
      dimensions: {
        shape: "circle",
        radius: 10,
      },
      velocity: {
        x: this.velocity.x + 5,
        y: 0,
      },
      direction: this.direction,
    };
  }

  draw() {

    ctx.save();
    ctx.fillStyle = "brown";
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.dimension.height,
      this.dimension.width
    );
    ctx.restore();
  }

  moveWithTheZombie() {
    if (this.zombie.type == "flying") {
      if (this.zombie.velocity.x > 0) {
        this.position.x =
          this.zombie.position.x + this.zombie.dimensions.width - 20;
        this.position.y = this.zombie.position.y;
      } else {
        this.position.x = this.zombie.position.x + 10;
        this.position.y = this.zombie.position.y;
      }
    }
    this.draw();
  }
  startShootingInterval() {
    if (this.shootingIntervalId !== null) {
      clearInterval(this.shootingIntervalId);
    }

  
    this.shootingIntervalId = setInterval(() => {
      this.shootTheBullet();
    }, 3000);
  }
  shootTheBullet() {
    if (!this.alive) {
      return
    }
    this.shot = true;
    const bullet = new Bullet(this.bulletInfo);
    bullet.owner = "zombie";
    bullets.push(bullet);
  }
}
