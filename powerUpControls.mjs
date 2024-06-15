import { groundLevel } from "./gameEvnironment.mjs";
import {
  ExtraGunBullets,
  HealthBoost,
  powerUps,
  ExtraCanonBullets,
  TemporaryImmunity,
} from "./powerUps.mjs";
import { base, canonGun, canvasWidth, normalGun, survivor } from "./script.js";
import { randomInRange } from "./script.js";

function getALocation() {
  let location = randomInRange(0, base.leftEnd);
  let location2 = randomInRange(
    base.rigntEnd,
    canvasWidth
  );
  let p = Math.floor(Math.random()*2);
  console.log(p);
  if (!p) {
    return location
  }
  return location2
}

function placeThePowerUps() {
  if (survivor.life < 400 && !HealthBoost.instanceExists) {
    const location = getALocation()
    const lifeBooster = new HealthBoost({
      x: location,
      y: groundLevel,
    });
    HealthBoost.instanceExists = true;
    powerUps.push(lifeBooster);
  }
  if (normalGun.remainingBullets < 80 && !ExtraGunBullets.instanceExists) {
    const location = getALocation()
    const bulletBooster = new ExtraGunBullets({
      x: location,
      y: groundLevel,
    });
    ExtraGunBullets.instanceExists = true;
    powerUps.push(bulletBooster);
  }
  if (canonGun.remainingBullets < 500 && !ExtraCanonBullets.instanceExists) {
    const location = getALocation()
    const bulletBoosterCanon = new ExtraCanonBullets({
      x: location,
      y: groundLevel,
    });
    ExtraCanonBullets.instanceExists = true;
    powerUps.push(bulletBoosterCanon);
  }
  if (survivor.life < 600 && !TemporaryImmunity.instanceExists) {
    const location = getALocation()
    const immuity = new TemporaryImmunity({
      x: location,
      y: groundLevel,
    });
    TemporaryImmunity.instanceExists = true;
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
