import {  groundLevel } from "./script.js";
import { Sprite } from "./sprit.mjs";
import { gravity } from "./weapons.mjs";
export let walls = [];

export function objectsCollideAlongX({ obj1, obj2 }) {
  if (
    obj1.position.x + obj1.dimensions.width + obj1.velocity.x >
      obj2.position.x &&
    obj1.position.x + obj1.velocity.x < obj2.position.x + obj2.dimensions.width
  ) {
    return true;
  }
  return false;
}

export function objectsCollideAlongY({ obj1, obj2 }) {
  if (
    obj1.position.y + obj1.velocity.y > obj2.position.y &&
    obj1.position.y - obj1.dimensions.height + obj1.velocity.y < obj2.position.y
  ) {
    return true;
  }
  return false;
}
export function checkWallCollision(wallToCheck) {
  for (let index = 0; index < walls.length; index++) {
    const wall = walls[index];
    if (wall == wallToCheck) {
      continue;
    }
    if (
      wallToCheck.position.y + wallToCheck.dimensions.height + 2>
        wall.position.y &&
      (wallToCheck.position.x + wallToCheck.dimensions.width >
        wall.position.x &&
      wallToCheck.position.x < wall.position.x + wall.dimensions.width )
    ) {
      return true;
    }
  }
  return false;
}
export class Wall {
  constructor({ position, dimensions }) {
    (this.position = position), (this.dimensions = dimensions);
    this.totalLife = 4;
    this.life = 4;
    this.velocity = { x: 0, y: -4 };
    walls.push(this);
    this.sprite = new Sprite({
      position: this.position,
      imageSrc: "./spriteAnimations/enviromnent/box.png",
      scale: { x: 0.2, y: 0.2 },
      offset: {
        x: -1.5,
        y: 0,
      },
      dimensions: {
        height: this.height,
        width: this.width,
      },
      frames: 1,
      framesHold: 1,
    });
  }
  draw() {
    if (this.life <= 0) {
      const index = walls.indexOf(this);
      walls.splice(index, 1);
      return;
    }
    if (this.position.y + this.dimensions.height < groundLevel) {
      if (!checkWallCollision(this)) {
        this.position.y += this.velocity.y;
        this.velocity.y += gravity;
      }
    }
    this.sprite.draw();
    this.position.x += this.velocity.x;
  }
  update() {}
}

export function generateWalls(locations) {
  locations.forEach((location) => {
    const wall = new Wall({
      position: location,
      dimensions: {
        height: 100,
        width: 100,
      },
    });
    walls.push(wall);
  });
}
