export class Bullet {
    constructor({ weapon, dimensions, velocity, direction }) {
      this.weapon = weapon;
      this.dimensions = dimensions;
      this.direction = direction;
      this.fired = false;
      this.position = {
        x: direction === "right" ? weapon.position.x + weapon.dimension.width : weapon.position.x,
        y: weapon.position.y + weapon.dimension.height / 2,
      };
  
   
      this.velocity = {
        x: direction === "right" ? velocity.x : -velocity.x,
        y: velocity.y,
      };
    }
  
    draw(ctx) {
      if (this.dimensions.shape === "circle") {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.dimensions.radius, 0, Math.PI * 2);
        ctx.fillStyle = "green";
        ctx.fill();
      }
    }
  
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
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
      this.survivor = survivor;
      this.direction = "right";
    }
  
    draw(ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(this.position.x, this.position.y, this.dimension.width, this.dimension.height);
    }
  
    moveWithPlayer() {
      this.position.x = this.survivor.position.x;
      if (this.direction === "left") {
        this.position.x = this.position.x - this.dimension.width + this.survivor.width;
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
  