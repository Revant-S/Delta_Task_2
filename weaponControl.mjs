import { ctx, survivor, mousePosition, groundLevel } from "./script.js";
import { Canon, bullets, MachineGun, Granite } from "./weapons.mjs";

import { zombies } from "./zombies.mjs";
import { updateNumberOfBullets, canonBullets } from "./scoreDomElement.mjs";

let selectedWeapon;
export function shoot() {
  selectedWeapon.shootTheBullet();
  updateNumberOfBullets({ object: selectedWeapon, domElement: canonBullets });
}

// Called only once
export function equipSurvivor() {
  const canonGun = new Canon();
  const graniteGun = new Granite();
  const machineGun = new MachineGun();
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
  updateNumberOfBullets({ object: selectedWeapon, domElement: canonBullets });
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

    if (distance < 200) {
      zombiesToKill.push(zombie);
    }
  });
  return zombiesToKill;
}
export function checkGraniteTime(granite, index) {
  if (granite.timer.secondsSpend <= 3) {
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
