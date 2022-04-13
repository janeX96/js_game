var canvas = document.getElementById("battlefield");
var ctx = canvas.getContext("2d");
ctx.font = "15px Arial";
ctx.fillStyle = "red";

let myDmg = 10;

const cannonX = 1000;
const cannonY = 250;

function drawCannon() {
  ctx.beginPath();
  ctx.ellipse(cannonX, cannonY, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
  ctx.stroke();
}

const Bullet = function (destX, destY) {
  this.lastX = cannonX;
  this.lastY = cannonY;

  // this.nextX = this.lastX - (this.lastX - destX / 10);

  this.clear = () => {
    ctx.clearRect(this.lastX - 10, this.lastY - 10, 20, 20);
  };

  let path = 10;
  let yDir = cannonY > destY ? -1 : cannonY < destY ? 1 : 0;

  let lenX = cannonX - destX;
  let lenY = cannonY - destY;
  lenY = lenY > -0 ? lenY : lenY * -1;
  let diff = lenX > lenY ? lenY / lenX : lenX / lenY;

  this.nextX = this.lastX - 0.8 * 100;
  this.nextY = this.lastY + 0.8 * 100 * diff * yDir;

  this.draw = () => {
    console.log("lastX:", this.lastX);
    console.log("nextX:", this.nextX);
    console.log("lastY:", this.lastY);
    console.log("nextY:", this.nextY);

    ctx.beginPath();
    ctx.ellipse(this.nextX, this.nextY, 5, 5, Math.PI / 4, 0, 2 * Math.PI);
    ctx.stroke();
    this.lastX = this.nextX;
    this.lastY = this.nextY;
  };
  this.go = () => {
    this.interval = setInterval(() => {
      this.clear();
      this.draw();
      this.nextX = this.lastX - 0.8 * 10;
      this.nextY = this.lastY + 0.8 * 10 * diff * yDir;
      if (this.lastX <= 0 || this.lastY <= 0 || this.lastY >= 500) {
        clearInterval(this.interval);
      }
    }, 10);
  };
};

function shot(destX, destY) {
  ctx.beginPath();
  ctx.moveTo(cannonX, cannonY);
  ctx.lineTo(200, 200);
  ctx.stroke();
}

const Enemy = function (hp, speed, dmg) {
  this.hp = hp;
  this.speed = speed;
  this.dmg = dmg;
  this.x = 0;
  this.y = hp;

  this.width = 100;
  this.height = 50;

  this.clear = () => {
    ctx.clearRect(this.x, this.y - 25, this.width, this.height + 25);
  };
  this.draw = () => {
    this.x += 1;
    ctx.fillRect(this.x, this.y, 100, 50);
    ctx.fillText(this.hp, this.x, this.y - 10);
  };

  this.start = () => {
    this.interval = setInterval(() => {
      this.clear();
      this.draw();
    }, this.speed);
  };

  this.hit = () => {
    this.hp -= myDmg;
    if (this.hp === 0) {
      clearInterval(this.interval);
      this.clear();
    }
  };
};

var e1 = new Enemy(200, 10, 10);
var e2 = new Enemy(250, 10, 10);
var e3 = new Enemy(300, 60, 10);
e1.start();

drawCannon();
// var b1 = new Bullet(300, 200);
// b1.go();
// e2.start();
// e3.start();

canvas.addEventListener(
  "click",
  function (e) {
    // var left = e1.x;
    // var right = e1.x + 100;
    // var top = e1.y;
    // var bottom = e1.y + 50;

    // let hit =
    //   e.offsetX >= left &&
    //   e.offsetX <= right &&
    //   e.offsetY >= top &&
    //   e.offsetY <= bottom;

    // if (hit) {
    //   e1.hit();
    // }

    var b1 = new Bullet(e.offsetX, e.offsetY);
    b1.go();
  },
  false
);
