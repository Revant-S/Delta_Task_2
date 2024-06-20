//  powerUps == Health , temporary Immunity, Extra Gunbullets , Extra Canon Bullets
import { canonGun, ctx,groundLevel } from "./script.js";
import { survivor } from "./script.js";
import { isInBetween } from "./contactlogic.mjs";
import { normalGunBullets, updateNumberOfBullets } from "./scoreDomElement.mjs";
export let powerUps = [];

function removePowerUp({ powerUp }) {
  const powerUpIndex2 = powerUp.powerUpObjectIndex;
  for (let i = 0; i < powerUps.length; i++) {
    const element = powerUps[i];
    if (element.powerUpObjectIndex == powerUpIndex2) {
      powerUps.splice(i, 1);
      break;
    }
  }
}

// Parent Class
class PowerUp {
  static powerUpIndex = 0;
  constructor(position) {
    this.position = position;
    this.dimension = {
      height: 50,
      width: 50,
    };
    this.color = "white";
    this.powerUpObjectIndex = PowerUp.powerUpIndex++;
  }
  draw() {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      groundLevel - this.dimension.height,
      this.dimension.width,
      this.dimension.height
    );
    ctx.restore();
  }
  detectTheCollision() {
    let leftSide = survivor.position.x;
    let rightSide = survivor.position.x + survivor.width;
    let leftOfPowerUp = this.position.x;
    let rightOfPowerUp = this.position.x + this.dimension.width;
    if (
      isInBetween(leftSide, leftOfPowerUp, rightOfPowerUp) ||
      isInBetween(rightSide, leftOfPowerUp, rightOfPowerUp)
    ) {
      return true;
    }
    return false;
  }
}

export class HealthBoost extends PowerUp {
  static instanceExists = false;

  constructor(position) {
    super(position);
    this.color = "red";
  }

  onTake() {
    survivor.life += 400;
    if (survivor.totalLife < survivor.life) {
      survivor.totalLife = survivor.life;
    }
    HealthBoost.instanceExists = false;
    removePowerUp({ powerUp: this });
  }
}

export class ExtraGunBullets extends PowerUp {
  static instanceExists = false;

  constructor(position) {
    super(position);
    this.color = "blue";
  }

  onTake() {
    canonGun.remainingBullets += 50;
    if (canonGun.remainingBullets > canonGun.totalBullets) {
      canonGun.totalBullets = canonGun.remainingBullets;
    }
    updateNumberOfBullets({ object: canonGun, domElement: normalGunBullets });
    ExtraGunBullets.instanceExists = false;
    removePowerUp({ powerUp: this });
  }
}

export class ExtraCanonBullets extends PowerUp {
  static instanceExists = false;

  constructor(position) {
    super(position);
    this.color = "Yellow";
  }

  onTake() {
    canonGun.remainingBullets += 500;
    if (canonGun.remainingBullets > canonGun.totalBullets) {
      canonGun.totalBullets = canonGun.remainingBullets;
    }
    updateNumberOfBullets({ object: canonGun, domElement: canonBullets });
    ExtraCanonBullets.instanceExists = false;
    removePowerUp({ powerUp: this });
  }
}

export class TemporaryImmunity extends PowerUp {
  static instanceExists = false;
  static framesPassed = 0;
  constructor(position) {
    super(position);
    this.color = "purple";
  }
  onTake() {
    console.log("HELLO MOTHER FUCKER");
    survivor.isImmune = true
    TemporaryImmunity.instanceExists = false;
    removePowerUp({ powerUp: this });
  }
}
