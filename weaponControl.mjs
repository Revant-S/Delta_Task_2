import { groundLevel } from "./gameEvnironment.mjs";
import { ctx, survivor, mousePosition } from "./script.js";
import { SurvivorNormalGun } from "./weapons.mjs";
import { MachineGun } from "./additionalWeapons.mjs";

let selectedWeapon;
export function shoot() {
  if (selectedWeapon instanceof MachineGun) {
    setInterval(selectedWeapon.shootTheBullet(),10)
  }else{

    selectedWeapon.shootTheBullet();
  }
}

// Called only once
export function equipSurvivor() {
  const normalGun = new SurvivorNormalGun({
    survivor: survivor,
    groundLevel: groundLevel,
  });
  const machineGun = new MachineGun();
  selectedWeapon = machineGun;
  survivor.weapons.push(normalGun);
  survivor.weapons.push(machineGun);
}

export function switchTheWeapon() {}

export function drawTheWeapon() {
  survivor.weapons.forEach((weapon) => {
    if (weapon.selected && weapon.type != "canon") {
      weapon.draw(ctx);
    }
    if (weapon.type == "gun" && weapon.selected) {
      weapon.moveWithPlayer(survivor.position);
    }
    if (weapon.type == "canon") {
      weapon.followTheMouse({ mouseCoordinates: mousePosition, ctx: ctx });
    }
  });
}
