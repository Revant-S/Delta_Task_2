
import { ctx, survivor,groundLevel } from "./script.js";
export let walls = [];

export function objectsCollideAlongX({ obj1, obj2 }) {
  if (
    obj1.position.x + obj1.dimensions.width > obj2.position.x &&
    obj1.position.x < obj2.position.x + obj2.dimensions.width
  ) {
    return true;
  }
  return false;
}

export function objectsCollideAlongY({ obj1, obj2 }) {
  if (
    obj1.position.y > obj2.position.y - obj2.dimensions.height &&
    obj1.position.y - obj1.dimensions.height < obj2.position.y
  ) {
    return true;
  }
  return false;
}

export class Wall {
  constructor({position, dimensions}) {
    (this.position = position), (this.dimensions = dimensions);
    this.totalLife = 100;
    this.life = 100;
    walls.push(this);
  }
  draw() {
    console.log("HERE");
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.dimensions.width,
      this.dimensions.height
    );
    this.survivorCollide()
  }
  survivorCollide() {
    if (objectsCollideAlongX({ obj1: survivor, obj2: this })) {
      survivor.velocity.x = 0;
    }
    if (
      objectsCollideAlongY({ obj1: survivor, obj2: this }) &&
      (survivor.position.x  < this.position.x+ this.dimensions.width ||
        survivor.position.x + survivor.dimensions.width >
          this.position.x )
    ) {
      survivor.velocity.y = 0;
    }
  }
}


export function generateWalls(locations) {
  locations.forEach(location => {
    const wall =  new Wall({
      position : {
        x : location,
        y : groundLevel - 100
      },
      dimensions : {
        height : 100,
        width : 100
      }
    })
    walls.push(wall)
  });
}
