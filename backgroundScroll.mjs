import { survivor } from "./script.js";
import { walls } from "./walls.mjs";
import { zombies } from "./zombies.mjs";
let backgroundIsScrolling = false
let backgroundVelocity = 3
export function backgroundScroll(position) {
    if (position.x >= 1000) {
        backgroundVelocity = -3
    }
    else if (position.x <= 100) {
        backgroundVelocity = 3
    }
    backgroundIsScrolling = true
    walls.forEach(wall =>{
        wall.position.x+= backgroundVelocity;
    })
    zombies.forEach(zombie =>{
        zombie.position.x += backgroundVelocity
        zombie.velocity.x= 0
    })
    
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
        console.log(zombie.velocity);
    })
}