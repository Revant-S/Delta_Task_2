import { groundLevel } from "./gameEvnironment.mjs";
import { ctx, survivor, mousePosition } from "./script.js";
import { SurvivorNormalGun, bullets } from "./weapons.mjs";
import { MachineGun,Granite } from "./additionalWeapons.mjs";
import { StopWatch } from "./timer.mjs";
import { zombies } from "./playerAndZombies.mjs";

let selectedWeapon;
export function shoot() {
  selectedWeapon.shootTheBullet();
}

// Called only once
export function equipSurvivor() {
  const normalGun = new SurvivorNormalGun({
    survivor: survivor,
    groundLevel: groundLevel,
  });
  const graniteGun = new Granite()
  const machineGun = new MachineGun();
  selectedWeapon = graniteGun;
  survivor.weapons.push(normalGun);
  survivor.weapons.push(machineGun);
  survivor.weapons.push(graniteGun);
}

export function switchTheWeapon() {}

export function drawTheWeapon() {
  survivor.weapons.forEach((weapon) => {
    if (weapon.selected && weapon.type != "canon") {
      weapon.draw(ctx);
    }
    if ((weapon.type == "gun" || weapon.type == "throw") && weapon.selected) {
      weapon.moveWithPlayer(survivor.position);
    }
    if (weapon.type == "canon") {
      weapon.followTheMouse({ mouseCoordinates: mousePosition, ctx: ctx });
    }
  });
}
function distanceBetween({ x1, x2, y1, y2 }) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function zombiesInRange(granite) {
  const graniteCenter = granite.position;
  console.log("Position Of Granite");
  console.log(granite.position);
  let zombiesToKill = [];
  zombies.forEach((zombie) => {
    let midPointX = zombie.position.x + zombie.zombieDimensions.width / 2; // x midpont of the zombie
    let midPointY = zombie.position.y - zombie.zombieDimensions.height / 2; // y midpoint
    let distance = distanceBetween({
      x1: graniteCenter.x,
      x2: midPointX,
      y1: graniteCenter.y,
      y2: midPointY,
    });
    console.log("Distances");
    console.log(distance);
    if (distance < 90) {
      zombiesToKill.push(zombie);
    }
    });
  console.log(zombiesToKill);
  return zombiesToKill;
}
export function checkGraniteTime(granite, index) {
  if (granite.timer.secondsSpend <= 10) {
    return false;
  }
  let zombiesInRangeArray = zombiesInRange(granite);
  zombiesInRangeArray.forEach((zombie) => {
    zombie.life = 0;
    zombie.kill();
  });
  bullets.splice(index, 1);
  return true;
}
