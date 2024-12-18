
import { ctx, survivor, mousePosition } from "./script.js";
import { Canon, bullets, MachineGun, Granite } from "./weapons.mjs";

import { zombies } from "./zombies.mjs";
import { updateNumberOfBullets, canonBullets, machineGunBullet, graniteGunBullet, gameIsPaused } from "./scoreDomElement.mjs";
import { AuroMaticCanon } from "./weapons.mjs";
export let baseGun ;
import { groundLevel } from "./script.js";
export let selectedWeapon;
export let baseGun2 
export let baseGun3
export let baseGun4
export function shoot() {
  selectedWeapon.shootTheBullet();
  let domElement = canonBullets;
  if (selectedWeapon instanceof MachineGun) {
    domElement = machineGunBullet
  }
  else if (selectedWeapon instanceof Granite) {
    domElement = graniteGunBullet
  }
  updateNumberOfBullets({ object: selectedWeapon, domElement: domElement });
}

// Called only once
export function equipSurvivor() {
  const canonGun = new Canon();
  const graniteGun = new Granite();
  const machineGun = new MachineGun();
  baseGun = new AuroMaticCanon(0 , {x : 700 , y : groundLevel})
  baseGun2 = new AuroMaticCanon(-Math.PI , {x : 700 , y : groundLevel })

  selectedWeapon = canonGun;
  survivor.weapons.push(canonGun);
  survivor.weapons.push(machineGun);
  survivor.weapons.push(graniteGun);
}

export function switchTheWeapon(from, to) {
  const prevWeapon = survivor.weapons[from];
  const selectedWeaponNow = survivor.weapons[to];
  prevWeapon.selected = false;
  selectedWeaponNow.selected = true;
  selectedWeapon = selectedWeaponNow;
}

export function drawTheWeapon() {
  survivor.weapons.forEach((weapon) => {
    if (weapon.selected) {
      weapon.moveWithPlayer(survivor.position);
      weapon.followTheMouse({ mouseCoordinates: mousePosition, ctx: ctx });
    }
  });
}
function distanceBetween({ x1, x2, y1, y2 }) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function zombiesInRange(granite) {
  const graniteCenter = granite.position;
  let zombiesToKill = [];
  zombies.forEach((zombie) => {
    let midPointX = zombie.position.x + zombie.dimensions.width / 2;
    let midPointY = zombie.position.y - zombie.dimensions.height / 2;
    let distance = distanceBetween({
      x1: graniteCenter.x,
      x2: midPointX,
      y1: graniteCenter.y,
      y2: midPointY,
    });
    console.log(distance);
    if (distance < 800) {
      zombiesToKill.push(zombie);
    }
  });
  console.log(zombiesToKill);
  return zombiesToKill;
}
export function checkGraniteTime(granite, index) {
  if (granite.timer.secondsSpend <= 5) {
    return false;
  }

  let zombiesInRangeArray = zombiesInRange(granite);
  zombiesInRangeArray.forEach((zombie) => {
    zombie.life = 0;
    zombie.kill();
  });
  console.log(zombies);
  console.log(zombiesInRangeArray);
  bullets.splice(index, 1);
  return true;
}
