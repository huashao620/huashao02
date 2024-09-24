const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let speedLabel = document.createElement('label');
speedLabel.textContent = '速度调节';
speedLabel.style.position = 'absolute';
speedLabel.style.left = '10px';
speedLabel.style.bottom = '40px'; // 调整位置以便与滑块分开
speedLabel.style.color = 'yellow';


let speedControl = document.createElement('input');
speedControl.type = 'range';
speedControl.min = 1;
speedControl.max = 10;
speedControl.value = 5;
speedControl.style.position = 'absolute';
speedControl.style.left = '10px';
speedControl.style.bottom = '10px';

document.body.appendChild(speedLabel);
document.body.appendChild(speedControl);


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

function randomShape() {
  const shapes = ['circle', 'square', 'triangle'];
  return shapes[random(0, shapes.length)];
}

function Ball(x, y, velX, velY, color, size, shape) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.shape = shape;
  this.hovered = false;
  this.dragging = false;
}

Ball.prototype.draw = function () {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  if (this.shape === 'circle') {
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  } else if (this.shape === 'square') {
    ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
  } else if (this.shape === 'triangle') {
    ctx.moveTo(this.x, this.y - this.size);
    ctx.lineTo(this.x - this.size, this.y + this.size);
    ctx.lineTo(this.x + this.size, this.y + this.size);
    ctx.closePath();
  }
  ctx.fill();
};

Ball.prototype.update = function () {
  if (!this.hovered && !this.dragging) {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    this.x += this.velX * (speedControl.value / 5);
    this.y += this.velY * (speedControl.value / 5);
  }
};

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

let balls = [];
while (balls.length < 25) {
  let size = random(10, 20);
  let shape = randomShape();
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size,
    shape,
  );
  balls.push(ball);
}

function loop() {
  ctx.clearRect(0,0,width,height);
  //ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  //ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }
  requestAnimationFrame(loop);
}


canvas.addEventListener('click', function(e) {
  let size = random(10, 20);
  let shape = randomShape();
  let ball = new Ball(
    e.clientX,
    e.clientY,
    random(-7, 7),
    random(-7, 7),
    randomColor(),
    size,
    shape
  );
  balls.push(ball);
});

// 其余事件监听代码保持不变
loop();
