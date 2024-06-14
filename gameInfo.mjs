import { zombies } from "./playerAndZombies.mjs";
import { clearAnimationId, startAnimation } from "./script.js";
export const scoreDomElement = document.getElementById("scoreBoard");
export const canonBullets = document.getElementById("canonBullets");
export const normalGunBullets = document.getElementById("normalGunBullets");
export const pauseBtn = document.getElementById("pauseMenu");
export const pauseMenuDialog = document.getElementById("pauseMenuDiaglog");
export const playBtn = document.getElementById("playBtn");
export const resetBtn = document.getElementById("resetBtn");
export let gameIsPaused = false;
export function updateTheScoreBoard({ survivor }) {
  scoreDomElement.innerText = `Survivor Score : ${survivor.score}`;
}

export function updateNumberOfBullets({ object, domElement }) {
  domElement.innerText = `${object.displayName} : ${object.remainingBullets}/${object.totalBullets}`;
}
function pauseTheGame() {
  gameIsPaused = true;
  clearAnimationId();

  pauseMenuDialog.showModal();
}

function resetTheGame() {
    gameIsPaused = false
    window.location.reload()
}

function playTheGame() {
  pauseMenuDialog.close();
  gameIsPaused = false;
  startAnimation();
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

