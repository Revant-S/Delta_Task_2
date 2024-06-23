import { clearAnimationId, startAnimation, survivor } from "./script.js";
export const scoreDomElement = document.getElementById("scoreBoard");
export const canonBullets = document.getElementById("canonBullets");
export const machineGunBullet = document.getElementById("machineGunBullets")
export const graniteGunBullet = document.getElementById("granite")
export const pauseBtn = document.getElementById("pauseMenu");
export const pauseMenuDialog = document.getElementById("pauseMenuDiaglog");
export const playBtn = document.getElementById("playBtn");
export const resetBtn = document.getElementById("resetBtn");
export let gameIsPaused = false;
const gameOverMenu = document.getElementById("gameOverMenu")



export function updateTheScoreBoard({ survivor }) {
  scoreDomElement.innerText = `Survivor Score : ${survivor.score}`;
}

export function updateNumberOfBullets({ object, domElement }) {
  domElement.innerText = 0;
  domElement.innerText = `${object.displayName} : ${object.remainingBullets}/${object.totalBullets}`;
}
function pauseTheGame() {
  gameIsPaused = true;
  clearAnimationId();

  pauseMenuDialog.showModal();
}
function resetTheGame() {
  gameIsPaused = false;
  // survivor.life += 100
  console.log("ibf;jblbflbfkajhkhvbb oybn  mn mnpiu gggglj");
  window.location.reload();
}
function playTheGame() {
  pauseMenuDialog.close();
  gameIsPaused = false;
  startAnimation();
}
export function gameOver() {
  gameIsPaused = true;
  clearAnimationId();
  const resetB = document.createElement("button");
  resetB.id = "reset"
  resetB.classList.add("pauseMenuBtn")

  const image = document.createElement("img");
  image.classList.add("svgs")
  image.src = "assets/reset-svgrepo-com.svg"
  gameOverMenu.innerHTML = `<h1>Your Score :${survivor.score} </h1>`
  resetB.addEventListener("click", ()=>{
    resetTheGame()
  })
  resetB.appendChild(image);
  gameOverMenu.appendChild(resetB)
  gameOverMenu.showModal();
}




export function showPauseMenu() {
  resetBtn.addEventListener("click", () => {
    resetTheGame();
  });
  playBtn.addEventListener("click", () => {
    playTheGame();
  });
  pauseTheGame();
}
