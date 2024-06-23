import { changeLeftRIght } from "./gameEvnironment.mjs";
import { powerUps } from "./powerUps.mjs";
import { survivor } from "./script.js";
import { background, background2, background3, background4, background5 } from "./sprit.mjs";
import { walls } from "./walls.mjs";
import { zombies } from "./zombies.mjs";
let backgroundIsScrolling = false
let backgroundVelocity = 3

export function backgroundScroll(position) {
    if (position.x >= 1000) {
        backgroundVelocity = -Math.abs(survivor.velocity.x)
    }
    else if (position.x <= 100) {
        backgroundVelocity = Math.abs(survivor.velocity.x)
    }
    backgroundIsScrolling = true
    walls.forEach(wall =>{
        wall.position.x+= backgroundVelocity;
    })
    zombies.forEach(zombie =>{
        zombie.position.x += backgroundVelocity
        zombie.velocity.x= 0
    })
    powerUps.forEach(powerUp =>{
        powerUp.position.x+=backgroundVelocity
    })
    background.offset.x -= backgroundVelocity
    background2.offset.x-=backgroundVelocity
    background3.offset.x -= backgroundVelocity
    // changeLeftRIght(backgroundVelocity)
    
}

export function stopScrolling() {
    if (!backgroundIsScrolling) {
        return
    }
    backgroundIsScrolling = false;
    walls.forEach(wall =>{
        wall.position.x -= backgroundVelocity;
    })
    zombies.forEach(zombie =>{
        zombie.position.x -= backgroundVelocity
        zombie.velocity.x= 0
    })
    changeLeftRIght(-backgroundVelocity)

}