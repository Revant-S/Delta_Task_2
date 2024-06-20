
import { ctx,groundLevel } from "./script.js";
import { walls } from "./walls.mjs";

export function generateGround(ctx, canvasWidth) {
  // return
  ctx.beginPath();
  ctx.moveTo(0, groundLevel);
  ctx.lineTo(canvasWidth, groundLevel);
  ctx.stroke();
  return groundLevel;
}

function baseHealthBar({ object }) {
  
  let leftLifeRemaining = object.wallLife.left;
  let rightLifeRemaining = object.wallLife.right;

  let leftBarCoordinateX = object.wallCoordinates.left.x + 8;
  let leftBarCoordinateY = groundLevel;
  let rightBarCoordinateX = object.wallCoordinates.right.x + 8;
  let rightBarCoordinateY = groundLevel;
  let length = object.wallDimensions.left.width - 15;
  let totalLife = object.totalLife;
  let percentage = leftLifeRemaining / totalLife;
  let innerLen = length * percentage;
  ctx.save();

  ctx.fillStyle = "white";
  ctx.fillRect(leftBarCoordinateX, leftBarCoordinateY - 25, length, 15);
  ctx.fillStyle = "rgb(86, 240, 86)";
  ctx.fillRect(leftBarCoordinateX, leftBarCoordinateY - 25, innerLen, 15);
  ctx.strokeStyle = "black"; 
  ctx.strokeRect(leftBarCoordinateX, leftBarCoordinateY - 25, length, 15); 
  ctx.restore();
  percentage = rightLifeRemaining / totalLife;
  innerLen = length * percentage;
  ctx.fillStyle = "white";
  ctx.fillRect(rightBarCoordinateX, rightBarCoordinateY - 25, length, 15);
  ctx.fillStyle = "rgb(86, 240, 86)";
  ctx.fillRect(rightBarCoordinateX, rightBarCoordinateY - 25, innerLen, 15);
  ctx.strokeStyle = "black"; 
  ctx.strokeRect(rightBarCoordinateX, rightBarCoordinateY - 25, length, 15);
  ctx.restore();
}

export function createTheBase({ groundLevel, ctx }) {
  this.weaponsAvailabe = [];
  this.name = "base";
  this.totalLife = 400;
  this.leftEnd = 400;
  this.rigntEnd = 900;
  this.canonTowerDetails = {
    location:700,
    height: 200,
    width: 40,
    bullets: 500,
  };

  this.draw = function () {
    walls.forEach(wall =>{
      wall.draw(groundLevel)
    })
  };
}

export class Platform {
  
}