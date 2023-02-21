// variables for grid dimensions
let gridSize = 24;
let gridWidth = 480;
let gridHeight = 480;

// set colors for grid, snake, and food
let gridColor1 = '#87CEEB';
let gridColor2 = '#ADD8E6';
let foodColor = '#FF0000';
let snakeColor = "#00FF00"

let snake;
let food;
var lose;
var pop;
let score = 0;

function setup() {
  createCanvas(gridWidth, gridHeight);
  if (score > 10) {
    frameRate(score / 2);
  } else {
    frameRate(5);
  }
  snake = new Snake();
  spawnFood();
  pop = loadSound('pop.mp3');
  lose = loadSound('lose.mp3');
}

function draw() {
  background(255, 255, 255);
  drawGrid();
  snake.update();
  stroke('#009B00')
  snake.draw();
  noStroke();
  // if snake or wall is hit
  if (snake.checkCollision()) {
    gameOver();
  }
  // if food is hit
  if (snake.checkFoodCollision(food)) {
    snake.grow();
    score++;
    pop.play();
    spawnFood();
  }
  drawFood();

  // display score on screen
  fill(0);
  textSize(20);
  textAlign(LEFT, BOTTOM);
  text(`Score: ${score}`, 5, height - 5);
}

// draws the grid behind on the background of the canvas at the beginning of every draw function
function drawGrid() {
  noStroke();
  for (let x = 0; x < gridWidth; x += gridSize) {
    for (let y = 0; y < gridHeight; y += gridSize) {
      fill((x + y) % (gridSize * 2) === 0 ? gridColor1 : gridColor2);
      rect(x, y, gridSize, gridSize);
    }
  }
}

// chooses a random location on the grid for the food (ONLY CALLED WHEN FOOD IS EATEN)
function spawnFood() {
  let foodX = floor(random(gridWidth / gridSize));
  let foodY = floor(random(gridHeight / gridSize));
  food = createVector(foodX, foodY);
}

// draws food on the canvas (CALLED DURING EVERY DRAW FUNCTION)
function drawFood() {
  fill(foodColor);
  rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// uses p5play keyboard inputs to change the direction of the snake if an arrow key is pressed
function keyPressed() {
  if (kb.presses('up')) {
    snake.changeDirection(0, -1);
  } else if (kb.presses('down')) {
    snake.changeDirection(0, 1);
  } else if (kb.presses('left')) {
    snake.changeDirection(-1, 0);
  } else if (kb.presses('right')) {
    snake.changeDirection(1, 0);
  }
}

// called if snake runs into itself or a wall
function gameOver() {
  // canvas to red
  lose.play();
  background(255, 0, 0);
  noLoop();

  // GAME OVER TEXT
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2);

  // PLAY AGAIN BUTTON

  // Reload the page when the button is clicked
  let buttonClicked = function() {
    window.location.reload();
  };

  // make button clickable
  let button = createButton('Play Again').position(width / 2 - 60, height / 2 + 25).size(140, 40).mousePressed(buttonClicked);
}

//SNAKE OBJECT
class Snake {
  constructor() {
    this.segments = [createVector(floor(gridWidth / gridSize / 2), floor(gridHeight / gridSize / 2))];
    this.direction = createVector(0, 0);
  }

  //direction vector (-1 -> 1, -1 -> 1)
  changeDirection(x, y) {
    this.direction.set(x, y);
  }

  update() {
    let head = this.segments[this.segments.length - 1].copy().add(this.direction);
    this.segments.shift();
    this.segments.push(head);
  }

  draw() {
    // draws each segment of the snake individually. happens on each call of the main draw function
    for (let segment of this.segments) {
      fill(snakeColor);
      rect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }
  }

  checkCollision() {
    let head = this.segments[this.segments.length - 1];
    // check if snake has collided with the wall
    if (head.x < 0 || head.y < 0 || head.x >= gridWidth / gridSize || head.y >= gridHeight / gridSize) {
      return true;
    }

    // check if snake collided with itself
    for (let i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return true;
      }
    }
    return false;
  }

  // check if snake has collided with food
  checkFoodCollision(food) {
    let head = this.segments[this.segments.length - 1];
    return head.equals(food);
  }

  // add new segment to the snake
  grow() {
    let tail = this.segments[0];
    let newTail = tail.copy().sub(this.direction);
    this.segments.unshift(newTail);
  }
}
