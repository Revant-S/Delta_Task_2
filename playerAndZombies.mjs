export class Survivor {
  constructor({ position, velocity }) {
    this.position = position;
    this.color = "red";
    this.life = 100;
    this.velocity = velocity;
    this.originalVelocity = velocity;
    this.height = 150;
    this.width = 50;
    this.weapons = [];
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y - this.height,
      50,
      this.height
    );
    ctx.fill();
  }

  move(keys) {
    this.velocity.x = 0;
    if (keys["ArrowLeft"].pressed && keys.LastPressed == "ArrowLeft") {
      this.velocity.x -= 4;
      this.weapons[0].direction = "left";
    }
    if (keys["ArrowRight"].pressed && keys.LastPressed == "ArrowRight") {
      this.velocity.x += 4;
      this.weapons[0].direction = "right";
    }
    this.position.x += this.velocity.x;
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
  }) {
    this.index = index;
    this.name = zombieName;
    this.position = position;
    this.velocity = velocity;
    this.zombieDimensions = zombieDimensions;
    this.survivorToFollow = survivor;
  }
  run(ctx) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.survivorToFollow.position.x - this.position.x < 0) {
      this.velocity.x = -1*Math.abs(this.velocity.x);
      this.velocity.y = -1*Math.abs(this.velocity.y);
    }
    else {
      this.velocity.x = Math.abs(this.velocity.x)
      this.velocity.y = Math.abs(this.velocity.y)
    }
    ctx.fillRect(
      this.position.x,
      this.position.y - this.zombieDimensions.height,
      this.zombieDimensions.width,
      this.zombieDimensions.height
    );
  }
}
