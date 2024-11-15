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
let playerLives = 3; // キャノンの残り数
let stage = 1; // 現在のステージ

const playerWidth = 50;
const playerHeight = 20;
const enemyWidth = 40;
const enemyHeight = 20;
const bulletWidth = 5;
const bulletHeight = 10;
const bombWidth = 5;
const bombHeight = 10;
let enemyDirection = 1;
let enemySpeed = 1;

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

function moveEnemies() {
  let moveDown = false;

  enemies.forEach(enemy => {
    if (enemy.isAlive) {
      if (enemyDirection === 1 && enemy.x + enemy.width >= canvas.width) {
        moveDown = true;
      } else if (enemyDirection === -1 && enemy.x <= 0) {
        moveDown = true;
      }
    }
  });

  if (moveDown) {
    enemyDirection *= -1;
    enemies.forEach(enemy => {
      if (enemy.isAlive) {
        enemy.y += enemyHeight;
      }
    });
  } else {
    enemies.forEach(enemy => {
      if (enemy.isAlive) {
        enemy.x += enemySpeed * enemyDirection;
      }
    });
  }
}

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
    if (Math.random() < 0.015) {
      bombs.push({ x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height });
    }
  });
}

// プレイヤー（キャノン）の描画
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

function drawBombs() {
  ctx.fillStyle = '#00f';
  bombs = bombs.filter(bomb => bomb.y < canvas.height);
  bombs.forEach(bomb => {
    ctx.fillRect(bomb.x, bomb.y, bombWidth, bombHeight);
    bomb.y += 4;
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

// 爆弾がキャノンに当たったかチェックし、ライフを減らす
function checkGameOver() {
  bombs.forEach(bomb => {
    if (
      bomb.x < playerX + playerWidth &&
      bomb.x + bombWidth > playerX &&
      bomb.y < playerY + playerHeight &&
      bomb.y + bombHeight > playerY
    ) {
      bombs = [];
      playerLives--;
      document.getElementById('lives').textContent = `Lives: ${playerLives}`;

      if (playerLives <= 0) {
        isGameOver = true;
      }
    }
  });
}


// 全ての敵が破壊されたか確認
function checkStageClear() {
  if (!isGameOver && enemies.every(enemy => !enemy.isAlive)) {
    cancelAnimationFrame(gameInterval);
    setTimeout(() => {
      stage++;
      document.getElementById('stage').textContent = `Stage: ${stage}`;
      startNextStage();
    }, 1000); // 1秒の遅延後に次のステージを開始
  }
}

// 次のステージを開始
function startNextStage() {
  bullets = [];
  bombs = [];
  playerX = canvas.width / 2 - playerWidth / 2; // プレイヤーの位置を中央にリセット
  
  // 敵の速度を増加させるが、最大速度は10に制限
  enemySpeed = Math.min(enemySpeed + 0.5, 10);

  // 新しい敵を生成
  createEnemies();
  
  // ゲームオーバーフラグをリセット
  isGameOver = false;

  // ゲームループを再開
  update();
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawBombs();
  checkCollision();
  checkGameOver();
  checkStageClear(); // ステージクリアの確認
  if (isGameOver) {
    cancelAnimationFrame(gameInterval);
    alert("ゲームオーバー！");
    startButton.style.display = 'block';
  }
}

function update() {
  if (!isGameOver) {
    moveEnemies();
    draw();
    dropBombs();
    gameInterval = requestAnimationFrame(update);
  }
}

// スタートボタンをクリックしたときに呼ばれる関数
function startGame() {
  score = 0;
  playerLives = 3;
  stage = 1;
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('lives').textContent = `Lives: ${playerLives}`;
  document.getElementById('stage').textContent = `Stage: ${stage}`;
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

