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
let enemyDirection = 1; // 敵の移動方向（1: 右, -1: 左）
let enemySpeed = 1; // 敵の移動速度

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

// 敵の移動
function moveEnemies() {
  let moveDown = false;

  // 右端・左端のチェック
  enemies.forEach(enemy => {
    if (enemy.isAlive) {
      if (enemyDirection === 1 && enemy.x + enemy.width >= canvas.width) {
        moveDown = true;
      } else if (enemyDirection === -1 && enemy.x <= 0) {
        moveDown = true;
      }
    }
  });

  // 敵を下に移動し、反転
  if (moveDown) {
    enemyDirection *= -1;
    enemies.forEach(enemy => {
      if (enemy.isAlive) {
        enemy.y += enemyHeight;
      }
    });
  } else {
    // 左右に移動
    enemies.forEach(enemy => {
      if (enemy.isAlive) {
        enemy.x += enemySpeed * enemyDirection;
      }
    });
  }
}

// 爆弾の生成
function dropBombs() {
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

  bottomEnemies.forEach(enemy => {
    if (Math.random() < 0.015) { // 爆弾発射確率を1.5%に変更
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

// 敵の描画
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
        enemy.isAlive = false;
        bullet.y = -10;
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
      }
    });
  });
}

// 衝突判定（爆弾とプレイヤー）
function checkGameOver() {
  bombs.forEach(bomb => {
    if (
      bomb.x < playerX + playerWidth &&
      bomb.x + bombWidth > playerX &&
      bomb.y < playerY + playerHeight &&
      bomb.y + bombHeight > playerY
    ) {
      isGameOver = true;
    }
  });
}

// ゲームの描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawBombs();
  checkCollision();
  checkGameOver();
  if (isGameOver) {
    cancelAnimationFrame(gameInterval);
    alert("ゲームオーバー！");
    startButton.style.display = 'block';
  }
}

// ゲームの更新
function update() {
  if (!isGameOver) {
    moveEnemies(); // 敵の移動を追加
    draw();
    dropBombs();
    gameInterval = requestAnimationFrame(update);
  }
}

// スタートボタンをクリックしたときに呼ばれる関数
function startGame() {
  score = 0;
  document.getElementById('score').textContent = `Score: ${score}`;
  createEnemies();
  bullets = [];
  bombs = [];
  isGameOver = false;
  playerX = canvas.width / 2 - playerWidth / 2;
  startButton.style.display = 'none';
  update();
}

// キー操作
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 10;
  } else if (e.key === 'ArrowRight' && playerX < canvas.width - playerWidth) {
    playerX += 10;
  } else if (e.key === ' ') {
    bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
  }
});


