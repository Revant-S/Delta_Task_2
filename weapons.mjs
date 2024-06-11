import { groundLevel } from "./gameEvnironment.mjs";
import { base } from "./script.js";
export let bullets = [];
export let gravity = 0.5;
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
     
      console.log(this.velocity.y);
      this.position = direction;
      if (this.position.y + this.dimensions.radius >= groundLevel) {
        this.velocity.y *= -0.8; // Reduce velocity to simulate energy loss
        this.position.y = groundLevel - this.dimensions.radius;
      }

      if (
        this.position.x - this.dimensions.radius <=
          base.wallCoordinates.left + base.wallDimensions.width &&
        this.position.x - this.dimensions.radius >= base.wallCoordinates.left
      ) {
        this.velocity.x *= -1; // Reverse the x velocity to simulate bouncing
        console.log("Collided With wall");
      }

      if (
        this.position.x + this.dimensions.radius >=
          base.wallCoordinates.right &&
        this.position.x + this.dimensions.radius <=
          base.wallCoordinates.right + base.wallDimensions.width
      ) {
        this.velocity.x *= -1; // Reverse the x velocity to simulate bouncing
      }
      console.log("Collided with wall");
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
    if (this.position.y == groundLevel) {
      this.velocity.y *= -1;
    }
    if (this.weapon.weaponName == "survivorNormalGun") {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    } else {
      this.velocity.y += gravity;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
    if (this.position.y + this.dimensions.radius >= groundLevel) {
      this.velocity.y = -this.velocity.y;
    }

  }
}

export class SurvivorNormalGun {
  constructor({ survivor, groundLevel }) {
    this.position = {
      x: survivor.position.x,
      y: groundLevel - survivor.height + 20,
    };
    this.bulletRemaining = 50;
    this.dimension = {
      width: 100,
      height: 20,
    };
    this.weaponName = "survivorNormalGun";
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
  }

  shootTheBullet(bullets) {
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
    this.angle = 0; // kept as default ... in refrence to the top canter of the tower
    this.canonTowerDetails = canonTowerDetails;
    this.dimensions = {
      length: 150,
      width: 20,
    };
    this.center = {
      x: this.canonTowerDetails.location,
      y: groundLevel - this.canonTowerDetails.height,
    };
    this.weaponNameame = "canon";
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
