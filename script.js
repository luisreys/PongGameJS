var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 6;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;
var showWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE2_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return{
    x:mouseX,
    y:mouseY
  };
}

window.onload = function(){
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function(){
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  function handleMouseClick(evt){
    if (showWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showWinScreen = false;
    }
  }
  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function(evt){
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
  });

}

function ballReset(){
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement(){
  var paddle2YCenter = paddle2Y + (PADDLE2_HEIGHT/2);
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 7;
  }else if (paddle2YCenter > ballY + 35){
    paddle2Y -= 7;
  }
}

function moveEverything(){
  if (showWinScreen) {
    return;
  }
  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;
  if (ballX > canvas.width) {
    //ballSpeedX = -ballSpeedX;
    if (ballY>paddle2Y && ballY<(paddle2Y+PADDLE2_HEIGHT)) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y+PADDLE2_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    }else {
      player1Score += 1;
      ballReset();
    }
  }
  if (ballX < 0) {
    if (ballY>paddle1Y && ballY<(paddle1Y+PADDLE_HEIGHT)) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    }else {
      player2Score += 1;
      ballReset();
    }
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
}
function drawNet(){
  for (var i = 0; i < canvas.height; i+=40) {
    colorRect(canvas.width/2-1,i,2, 20, 'white');
  }
}
function drawEverything(){
  colorRect(0,0,canvas.width, canvas.height, 'black');
  if (showWinScreen) {
    if (player1Score > player2Score) {
      canvasContext.fillStyle = 'white';
      canvasContext.fillText("Player One is the winner", canvas.width/2, canvas.height/2);
    }else {
      canvasContext.fillStyle = 'white';
      canvasContext.fillText("Player Two is the winner", canvas.width/2, canvas.height/2);
    }
    return;
  }
  drawNet();
  //User paddle
  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');
  //Computer padddle
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE2_HEIGHT, 'white');

  colorCircle(ballX, ballY, 10, 'white');

  canvasContext.fillText("Player One: " + player1Score, 100, 100);
  canvasContext.fillText("Player Two: " +player2Score, canvas.width - 150, 100);
}

function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
