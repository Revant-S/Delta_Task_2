export const scoreDomElement = document.getElementById("scoreBoard");
export const canonBullets = document.getElementById("canonBullets");
export const normalGunBullets = document.getElementById("normalGunBullets")
export function updateTheScoreBoard({survivor}) {
    scoreDomElement.innerText = `Survivor Score : ${survivor.score}`
}

export function updateNumberOfBullets({object  , domElement}) {
    domElement.innerText = `${object.displayName} : ${object.remainingBullets}/${object.totalBullets}`
}