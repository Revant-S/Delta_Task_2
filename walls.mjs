
import { ctx, survivor,groundLevel } from "./script.js";
import { Sprite } from "./sprit.mjs";
export let walls = [];

export function objectsCollideAlongX({ obj1, obj2 }) {
  if (
    obj1.position.x + obj1.dimensions.width+obj1.velocity.x > obj2.position.x &&
    obj1.position.x + obj1.velocity.x < obj2.position.x + obj2.dimensions.width
  ) {
    console.log("Collision ");
    return true;
  }
  return false;
}

export function objectsCollideAlongY({ obj1, obj2 }) {
  if (
    obj1.position.y + obj1.velocity.y> obj2.position.y  &&
    obj1.position.y - obj1.dimensions.height + obj1.velocity.y < obj2.position.y
  ) {
    return true;
  }
  return false;
}

export class Wall {
  constructor({position, dimensions}) {
    (this.position = position), (this.dimensions = dimensions);
    this.totalLife = 4;
    this.life = 4;
    this.velocity = {x : 0 , y : 0 }
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
    if (this.life <= 0
    ) {
      const index = walls.indexOf(this)
      walls.splice(index,1)
      return
    }
    this.sprite.draw()
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
   
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
