import { canvasHeight, canvasWidth, ctx,groundLevel } from "./script.js";

export class Sprite {
  constructor({
    position,
    imageSrc,
    scale = {x:1,y:1},
    dimensions,
    frames = 1,
    spriteSheetAvailabe = true,
    offset = { x: 0, y: 0 },
    framesHold = 1,
    sprites
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.dimensions = dimensions;
    this.frames = frames;
    this.currentFrames = 0;
    this.spriteSheetAvailabe = spriteSheetAvailabe;
    this.offset = offset;
    this.framesHold = framesHold;
    this.framesElapsed = 0;
    this.sprites = sprites
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.currentFrames * (this.image.width / this.frames),
      0,
      this.image.width / this.frames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frames) * this.scale.x,
      (this.image.height * this.scale.y)
    );
  }
  update() {
    this.draw();
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold == 0) {
      if (this.currentFrames < this.frames-1) {
        this.currentFrames++;
      }else{
        this.currentFrames = 0
      }
    }
  }
}

export const background = new Sprite({
  position: {
    x: 0,
    y: -76.3,
  },
  imageSrc: "./spriteAnimations/background/file.png",
  scale : {
    x : 2,
    y : 1
  },
  offset: { x: 0, y: 0 },
});

export const background2 = new Sprite({
  position: {
    x: window.innerWidth,
    y: -76.3,
  },
  imageSrc: "./spriteAnimations/background/file.png",
  scale : {
    x : 2,
    y : 1
  },
  offset: { x: -background.offset.x, y: 0 },
})
export const background3 = new Sprite({
  position: {
    x: -window.innerWidth,
    y: -76.3,
  },
  imageSrc: "./spriteAnimations/background/file.png",
  scale : {
    x : 2,
    y : 1
  },
  offset: { x: background.offset.x, y: 0 },
})
export const background4 = new Sprite({
  position: {
    x: -2*window.innerWidth,
    y: -76.3,
  },
  imageSrc: "./spriteAnimations/background/file.png",
  scale : {
    x : 2,
    y : 1
  },
  offset: { x: background.offset.x, y: 0 },
})
export const background5 = new Sprite({
  position: {
    x: 2*window.innerWidth,
    y: -76.3,
  },
  imageSrc: "./spriteAnimations/background/file.png",
  scale : {
    x : 2,
    y : 1
  },
  offset: { x: -background.offset.x, y: 0 },
})
export function drawBackground() {
  if (Math.abs(background.offset.x) == window.innerWidth) {
    background.offset.x = 0
  }
  background.draw();
  background2.draw();
  background3.draw();
}