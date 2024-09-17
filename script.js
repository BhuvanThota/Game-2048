import Grid from "./Grid.js";
import Tile from "./Tile.js";

const HIGH_SCORE_KEY = 'highScore'


let score = 0;
let highScore = localStorage.getItem(HIGH_SCORE_KEY) || 0

const highScoreElement = document.getElementById("high-score");
export let scoreElement = document.getElementById("score");

highScoreElement.innerHTML = `High Score: <br> ${highScore} `

export function updateScore(newPoints) {
    score += newPoints;
    scoreElement.innerHTML = `Score: <br> ${score} `

    if (score > highScore) {
        highScore = score;
        localStorage.setItem(HIGH_SCORE_KEY, highScore);  
        highScoreElement.innerHTML = `High Score: <br> ${highScore} `
    }
}

const resetButton = document.getElementById("reset-button");

resetButton.onclick = resetGame;

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
let startX, startY, endX, endY;

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

setupInput();


function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
  gameBoard.addEventListener("touchstart", handleTouchStart, {once:true, passive: false});
}

async function handleTouchStart(e){
  stopInput();
  e.preventDefault();
  let keyValue;
  const touch =  e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;

  gameBoard.addEventListener("touchend", handleTouchEnd , {once:true});
}
  
  async function handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    endX = touch.clientX;
    endY = touch.clientY;
  
    const dx = endX - startX;
    const dy = endY - startY;
  
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        if (!canMoveRight()) {
          setupInput();
          return;
        }
        await moveRight();
      } else {
        if (!canMoveLeft()) {
          setupInput();
          return;
        }
        await moveLeft();
      }
    } else {
      if (dy > 0) {
        if (!canMoveDown()) {
          setupInput();
          return;
        }
        await moveDown();
      } else {
        if (!canMoveUp()) {
          setupInput();
          return;
        }
        await moveUp();
      }
    }
  
  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight() ){
    newTile.waitForTransition(true).then(() => {
        alert("Game Over")
    })
    return 
  }

  setupInput();
}

async function handleInput(e) {
  stopInput()
  switch (e.key) {
    case "ArrowUp":
    case "w":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
    case "s":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
    case "a":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
    case "d":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight() ){
    newTile.waitForTransition(true).then(() => {
        alert("Game Over")
    })
    return 
  }

  setupInput();
}

function stopInput(){
  window.removeEventListener("keydown", handleInput);
  gameBoard.removeEventListener("touchstart", handleTouchStart);
}


function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((col) => [...col].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }
        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}

function canMove(cells){
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index -1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}

function canMoveUp(){
    return canMove(grid.cellsByColumn)
}

function canMoveDown(){
    return canMove(grid.cellsByColumn.map((col) => [...col].reverse()))
}

function canMoveLeft(){
    return canMove(grid.cellsByRow)
}

function canMoveRight(){
    return canMove(grid.cellsByRow.map((row) => [...row].reverse()))
}


function resetGame() {
  stopInput();
  // Reset score
  score = 0;
  scoreElement.innerText = `Score: ${score}`;

  // Clear the game board
  gameBoard.innerHTML = ''; // Remove all tiles
  
  // Reinitialize the grid and add two new tiles
  const grid = new Grid(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);

  // Set up input again
  setupInput();
}

