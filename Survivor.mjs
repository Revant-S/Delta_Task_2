import { gravity } from "./weapons.mjs";
import { groundLevel } from "./script.js";
import {
  checkCollisionWithWall,
  ckeckIfLandOnWAll
} from "./contactlogic.mjs";
import { anyPowerUpTaken } from "./powerUpControls.mjs";
import { Sprite } from "./sprit.mjs";
import { drawHealthBar, updateWeaponDirection } from "./zombies.mjs";


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
    checkCollisionWithWall(this);
    ckeckIfLandOnWAll(this);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

  }
}
