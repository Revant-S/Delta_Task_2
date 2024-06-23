import { groundLevel } from "./script.js";
import { walls } from "./walls.mjs";
export let leftEnd = 350
export let RightEnd = 950;

export function changeLeftRIght(shift) {
  leftEnd+= shift;
  RightEnd+= shift
}

export function generateGround(ctx, canvasWidth) {
  // return
  ctx.beginPath();
  ctx.moveTo(0, groundLevel);
  ctx.lineTo(canvasWidth, groundLevel);
  ctx.stroke();
  return groundLevel;
}



export function createTheBase({ groundLevel, ctx }) {
  this.weaponsAvailabe = [];
  this.name = "base";


  this.draw = function () {
    walls.forEach(wall =>{
      ctx.save()
      wall.draw(groundLevel)
      ctx.restore();
    })
  };
}


