import {
  ExtraGunBullets,
  HealthBoost,
  powerUps,
  ExtraCanonBullets,
  TemporaryImmunity,
} from "./powerUps.mjs";
import { canonGun, canvasWidth, survivor } from "./script.js";
import { randomInRange,groundLevel } from "./script.js";
import { walls } from "./walls.mjs";

function getALocation() {

  let possibleLocations = []
  walls.forEach(wall =>{
    possibleLocations.push(wall.position.x - 60)
    possibleLocations.push(wall.position.x + wall.dimensions.width +60)
  })
  return possibleLocations[Math.floor(Math.random()*(possibleLocations.length))]
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
  if (canonGun.remainingBullets < 80 && !ExtraGunBullets.instanceExists) {
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
  if (survivor.life < 600 && !TemporaryImmunity.instanceExists && TemporaryImmunity.framesPassed % 200== 0) {
    const location = getALocation()
    const immuity = new TemporaryImmunity({
      x: location,
      y: groundLevel,
    });
    TemporaryImmunity.instanceExists = true;
    TemporaryImmunity.framesPassed =0;
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
