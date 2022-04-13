var canvas = document.getElementById("battlefield");
var ctx = canvas.getContext("2d");
ctx.font = "15px Arial";
ctx.fillStyle = "red";

let myDmg = 10;

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
    }
  };
};

var e1 = new Enemy(200, 10, 10);
var e2 = new Enemy(250, 10, 10);
var e3 = new Enemy(300, 60, 10);
e1.start();
// e2.start();
// e3.start();

canvas.addEventListener(
  "click",
  function (e) {
    var left = e1.x;
    var right = e1.x + 100;
    var top = e1.y;
    var bottom = e1.y + 50;

    let hit =
      e.offsetX >= left &&
      e.offsetX <= right &&
      e.offsetY >= top &&
      e.offsetY <= bottom;

    if (hit) {
      e1.hit();
    }
  },
  false
);
