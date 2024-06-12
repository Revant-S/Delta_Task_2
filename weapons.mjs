import { groundLevel } from "./gameEvnironment.mjs";
import { base } from "./script.js";
import { updateNumberOfBullets , canonBullets,normalGunBullets } from "./gameInfo.mjs";  


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
    this.fired = false;
    console.log(this.weapon);
    if (this.weapon.weaponName == "survivorNormalGun") {
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

  draw(ctx) {
    if (this.dimensions.shape === "circle") {
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.dimensions.radius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "green";
      ctx.fill();
    }
  }

  update() {
    if (this.position.y === groundLevel) {
      this.velocity.y *= -1;
    }
    if (this.weapon.weaponName === "survivorNormalGun") {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    } else {
      this.velocity.y += gravity;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
    if (this.position.y + this.dimensions.radius >= groundLevel) {
      this.velocity.y *= -0.9;
      this.position.y = groundLevel - this.dimensions.radius;
    }

    // Check for collision with left wall
    if (
      this.position.x - this.dimensions.radius <=
        base.wallCoordinates.left.x + base.wallDimensions.left.width &&
      this.position.x + this.dimensions.radius >= base.wallCoordinates.left.x
    ) {
      // Check for collision with the top surface of the left wall
      if (
        this.position.y + this.dimensions.radius >=
          groundLevel - base.wallDimensions.left.height &&
        this.position.y - this.dimensions.radius <=
          groundLevel - base.wallDimensions.left.height
      ) {
        this.velocity.y *= -1;
        base.wallLife.left -= 1;
      } else if (
        this.position.y + this.dimensions.radius >=
        groundLevel - base.wallDimensions.left.height
      ) {
        this.velocity.x *= -1;
        base.wallLife.left -= 1;
      }
    }

    // Check for collision with right wall
    if (
      this.position.x + this.dimensions.radius >=
        base.wallCoordinates.right.x &&
      this.position.x - this.dimensions.radius <=
        base.wallCoordinates.right.x + base.wallDimensions.right.width
    ) {
      // Check for collision with the top surface of the right wall
      if (
        this.position.y + this.dimensions.radius >=
          groundLevel - base.wallDimensions.right.height &&
        this.position.y - this.dimensions.radius <=
          groundLevel - base.wallDimensions.right.height
      ) {
        this.velocity.y *= -1;
        base.wallLife.right -= 1;
      } else if (
        this.position.y + this.dimensions.radius >=
        groundLevel - base.wallDimensions.right.height
      ) {
        this.velocity.x *= -1;
        base.wallLife.right -= 1;
      }
    }
  }
}

export class SurvivorNormalGun {
  constructor({ survivor, groundLevel }) {
    this.position = {
      x: survivor.position.x,
      y: survivor.position.y - survivor.height,
    };
    this.bulletRemaining = 50;
    this.dimension = {
      width: 100,
      height: 20,
    };
    this.totalBullets = 100;
    this.remainingBullets = 100;
    this.weaponName = "survivorNormalGun";
    this.displayName = "Gun Bullets"
    this.survivor = survivor;
    this.direction = "right";
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.dimension.width,
      this.dimension.height
    );
  }

  moveWithPlayer() {
    this.position.x = this.survivor.position.x;
    if (this.direction === "left") {
      this.position.x =
        this.position.x - this.dimension.width + this.survivor.width;
    }
    this.position.y = this.survivor.position.y - this.survivor.height + 20;
  }

  shootTheBullet(bullets) {
    this.remainingBullets -= 1;
    if (this.remainingBullets < 0) return;
    updateNumberOfBullets({object : this , domElement : normalGunBullets})
    const bullet = new Bullet({
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
    });
    bullets.push(bullet);
  }
}

export class Canon {
  constructor({ canonTowerDetails, ctx }) {
    this.ctx = ctx;
    this.angle = 0; // kept as default ... in reference to the top center of the tower
    this.canonTowerDetails = canonTowerDetails;
    this.totalBullets = 100;
    this.remainingBullets = 100;
    this.displayName = "Canon Bullets"
    this.dimensions = {
      length: 150,
      width: 20
    };
    this.center = {
      x: this.canonTowerDetails.location,
      y: groundLevel - this.canonTowerDetails.height,
    };
    this.weaponName = "canon";
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
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.restore();
  }

  followTheMouse({ mouseCoordinates, ctx }) {
    let mouseX = mouseCoordinates.x - this.center.x;
    let mouseY = mouseCoordinates.y - this.center.y;
    const angle = Math.atan2(mouseY, mouseX);
    this.draw(ctx, angle);
  }

  shoot() {
    this.remainingBullets--;
    if (this.remainingBullets < 0) return;
    updateNumberOfBullets({object:this , domElement : canonBullets})
    const bullet = new Bullet({
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
        x:
          this.canonTowerDetails.location +
          this.dimensions.length * Math.cos(this.angle),
        y:
          groundLevel -
          this.canonTowerDetails.height +
          this.dimensions.length * Math.sin(this.angle),
      },
    });

    bullets.push(bullet);
  }
}
