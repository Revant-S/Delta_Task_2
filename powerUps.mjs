//  powerUps == Health , temporary Immunity, Extra Gunbullets , Extra Canon Bullets
import { canonGun, ctx,groundLevel } from "./script.js";
import { survivor } from "./script.js";
import { isInBetween } from "./contactlogic.mjs";
import { machineGunBullet, updateNumberOfBullets } from "./scoreDomElement.mjs";
import { Sprite } from "./sprit.mjs";
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
    if (this instanceof HealthBoost || this instanceof TemporaryImmunity) {
      this.sprite.draw()  
    }
   
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
    this.sprite = new Sprite({
      position: this.position,
      imageSrc: "./spriteAnimations/powerUps/life.png",
      scale: { x: 1.7, y:1.7 },
      offset: {
        x: 0,
        y: 50,
      },
      dimension: {
        height: this.height,
        width: this.width,
      },
      frames: 1,
      framesHold: 1,
    })
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

  
}

export class ExtraCanonBullets extends PowerUp {
  static instanceExists = false;

  constructor(position) {
    super(position);
    this.color = "Yellow";
  }

  onTake() {
    survivor.weapons[0].remainingBullets += 500;
    if (survivor.weapons[0].remainingBullets > survivor.weapons[0].totalBullets) {
      survivor.weapons[0].totalBullets = survivor.weapons[0].remainingBullets;
    }
    updateNumberOfBullets({ object: survivor.weapons[0], domElement: canonBullets });
    ExtraCanonBullets.instanceExists = false;
    removePowerUp({ powerUp: this });
  }
}

// gets only once else have to pay with points

export class TemporaryImmunity extends PowerUp {
  static Taken = false;
  constructor(position) {
    super(position);
    this.color = "purple";
    this.sprite = new Sprite({
      position: this.position,
      imageSrc: "./spriteAnimations/powerUps/shield.png",
      scale: { x: 1.7, y:1.7 },
      offset: {
        x: 0,
        y: 100,
      },
      dimension: {
        height: this.height,
        width: this.width,
      },
      frames: 1,
      framesHold: 1,
    })
  }
  onTake() {
    TemporaryImmunity.instanceExists = false;
    removePowerUp({ powerUp: this });
  }
}

export class ExtraMachineGunBullets extends PowerUp{
  static instanceExists = false;

  constructor(position) {
    super(position);
    this.color = "green";
  }

  onTake() {
    survivor.weapons[1].remainingBullets += 500;
    if (survivor.weapons[1].remainingBullets > survivor.weapons[1].totalBullets) {
      survivor.weapons[1].totalBullets = survivor.weapons[1].remainingBullets;
    }
    updateNumberOfBullets({ object: survivor.weapons[1], domElement: machineGunBullet });
    ExtraCanonBullets.instanceExists = false;
    removePowerUp({ powerUp: this });
  }
}