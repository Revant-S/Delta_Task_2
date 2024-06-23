import { RightEnd, leftEnd } from "./gameEvnironment.mjs";
import {
  HealthBoost,
  powerUps,
  ExtraCanonBullets,
  TemporaryImmunity,
  ExtraMachineGunBullets,
} from "./powerUps.mjs";
import {  canvasWidth, survivor } from "./script.js";
import { randomInRange, groundLevel } from "./script.js";

function getALocation() {
  const region = Math.floor(Math.random()*2);
  if (!region) {
    return randomInRange(0, leftEnd)
  }
  return randomInRange(RightEnd , canvasWidth)
}

function placeThePowerUps() {
  if (survivor.life < 700 && !HealthBoost.instanceExists) {
    const location = getALocation();
    const lifeBooster = new HealthBoost({
      x: location,
      y: groundLevel,
    });
    HealthBoost.instanceExists = true;
    powerUps.push(lifeBooster);
  }

  if (survivor.weapons[0].remainingBullets < 800 && !ExtraCanonBullets.instanceExists) {
    const location = getALocation();
    const bulletBoosterCanon = new ExtraCanonBullets({
      x: location,
      y: groundLevel,
    });
    ExtraCanonBullets.instanceExists = true;
    powerUps.push(bulletBoosterCanon);
  }

  if (survivor.weapons[1].remainingBullets < 2000 && !ExtraMachineGunBullets.instanceExists) {
    const location = getALocation();
    const bulletBoosterMachineGun = new ExtraMachineGunBullets({
      x: location,
      y: groundLevel,
    });
    ExtraMachineGunBullets.instanceExists = true;
    powerUps.push(bulletBoosterMachineGun);
  }
  if (
    survivor.life < 600 &&
    !TemporaryImmunity.Taken
  ) {
    const location = getALocation();
    const immuity = new TemporaryImmunity({
      x: location,
      y: groundLevel,
    });
    TemporaryImmunity.Taken = true;
    powerUps.push(immuity);
  }
}

export function renderPowerUps() {
  placeThePowerUps();
  powerUps.forEach((powerUp) => powerUp.draw());
}

export function anyPowerUpTaken() {
  powerUps.forEach((powerUp) => {
    if (powerUp.detectTheCollision()) {
      powerUp.onTake();
    }
  });
}
