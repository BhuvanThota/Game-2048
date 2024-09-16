import Grid from "./Grid.js";
import Tile from "./Tile.js";


let score = 0;
export let scoreElement = document.getElementById("score");

export function updateScore(newPoints) {
    score += newPoints;
    scoreElement.innerText = `Score: ${score}`;
}

const resetButton = document.getElementById("reset-button");

resetButton.onclick = resetGame;

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

setupInput();

function resetGame() {
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


function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
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