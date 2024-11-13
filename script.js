const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 50;
const playerHeight = 20;
const enemyWidth = 40;
const enemyHeight = 20;
const bulletWidth = 5;
const bulletHeight = 10;
let score = 0;

let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;

let bullets = [];
let enemies = [];

function createEnemies() {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      enemies.push({
        x: i * (enemyWidth + 20) + 50,
        y: j * (enemyHeight + 20) + 30,
        width: enemyWidth,
        height: enemyHeight,
        isAlive: true
      });
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawBullets() {
  ctx.fillStyle = '#ff0000';
  bullets = bullets.filter(bullet => bullet.y > 0);
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    bullet.y -= 5;
  });
}

function drawEnemies() {
  ctx.fillStyle = '#ffff00';
  enemies.forEach(enemy => {
    if (enemy.isAlive) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}

function checkCollision() {
  bullets.forEach(bullet => {
    enemies.forEach(enemy => {
      if (
        enemy.isAlive &&
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bulletWidth > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bulletHeight > enemy.y
      ) {
        enemy.isAlive = false;
        bullet.y = -10;
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  checkCollision();
}

function update() {
  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 10;
  } else if (e.key === 'ArrowRight' && playerX < canvas.width - playerWidth) {
    playerX += 10;
  } else if (e.key === ' ') {
    bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
  }
});

createEnemies();
update();
