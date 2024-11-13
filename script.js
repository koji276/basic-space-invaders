const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
let score = 0;
let playerX = canvas.width / 2 - 50 / 2;
let playerY = canvas.height - 30;
let bullets = [];
let enemies = [];
let bombs = [];
let gameInterval;
let isGameOver = false;

const playerWidth = 50;
const playerHeight = 20;
const enemyWidth = 40;
const enemyHeight = 20;
const bulletWidth = 5;
const bulletHeight = 10;
const bombWidth = 5;
const bombHeight = 10;

// 敵の生成
function createEnemies() {
  enemies = [];
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

// 爆弾の生成
function dropBombs() {
  // 各列で一番下の敵を探し、その位置から爆弾を発射
  const bottomEnemies = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 2; j >= 0; j--) {
      const enemy = enemies[i + j * 5];
      if (enemy && enemy.isAlive) {
        bottomEnemies.push(enemy);
        break;
      }
    }
  }
  
  // ランダムに爆弾を発射
  bottomEnemies.forEach(enemy => {
    if (Math.random() < 0.03) { // 3%の確率で爆弾を発射
      bombs.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
    }
  });
}

// プレイヤーの描画
function drawPlayer() {
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// 弾の描画と移動
function drawBullets() {
  ctx.fillStyle = '#ff0000';
  bullets = bullets.filter(bullet => bullet.y > 0);
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    bullet.y -= 5;
  });
}

// 敵の描画と移動
function drawEnemies() {
  ctx.fillStyle = '#ffff00';
  enemies.forEach(enemy => {
    if (enemy.isAlive) {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}

// 爆弾の描画と移動
function drawBombs() {
  ctx.fillStyle = '#00f';
  bombs = bombs.filter(bomb => bomb.y < canvas.height);
  bombs.forEach(bomb => {
    ctx.fillRect(bomb.x, bomb.y, bombWidth, bombHeight);
    bomb.y += 4;
  });
}

// 衝突判定（弾と敵）
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
        enemy.isAlive = f

