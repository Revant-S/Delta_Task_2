import { Canon, bullets } from "./weapons.mjs";
import { ctx } from "./script.js";
export const groundLevel = 500;
export function generateGround(ctx, canvasWidth) {
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
  this.wallCoordinates = {
    left: {
      x: 400,
      y: groundLevel,
    },
    right: {
      x: 900,
      y: groundLevel,
    },
  };

  this.wallDimensions = {
    left: {
      height: 120,
      width: 120,
    },
    right: {
      height: 120,
      width: 120,
    },
  };
  this.canonTowerDetails = {
    location:
      (this.wallCoordinates.left.x +
        this.wallDimensions.left.width +
        this.wallCoordinates.right.x) /
      2,
    height: 200,
    width: 40,
    bullets: 500,
  };
  this.wallLife = {
    left: this.totalLife,
    right: this.totalLife,
  };
  this.draw = function () {
    ctx.fillStyle = "black";
   if (this.wallLife.left>0) {
    ctx.fillRect(
      this.wallCoordinates.left.x,
      this.wallCoordinates.left.y - this.wallDimensions.left.height,
      this.wallDimensions.left.width,
      this.wallDimensions.left.height
    );
  ctx.fill();
   }
   else{
    this.wallCoordinates.left.x = undefined;
    this.wallCoordinates.left.y = undefined
   }
    if (this.wallLife.right>0) {
      ctx.fillRect(
        this.wallCoordinates.right.x,
        this.wallCoordinates.right.y - this.wallDimensions.right.height,
        this.wallDimensions.right.width,
        this.wallDimensions.right.height
      );
      ctx.fill();
    }
    else{
      this.wallCoordinates.left.x = undefined;
      this.wallCoordinates.left.y = undefined
     }
    ctx.fillStyle = "grey";
    ctx.fillRect(
      this.canonTowerDetails.location - this.canonTowerDetails.width / 2,
      groundLevel - this.canonTowerDetails.height,
      this.canonTowerDetails.width,
      this.canonTowerDetails.height
    );
    ctx.fill();
    baseHealthBar({ object: this });
  };
}