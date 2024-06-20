import { zombies } from "./zombies.mjs";
import { ctx,groundLevel } from "./script.js";
import { walls } from "./walls.mjs";
import { objectsCollideAlongX , objectsCollideAlongY } from "./walls.mjs";
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
  this.totalLife = 400;
  this.leftEnd = 400;
  this.rigntEnd = 900;

  this.draw = function () {
    walls.forEach(wall =>{
      ctx.save()
      wall.draw(groundLevel)
      ctx.restore();
    })
  };
}

