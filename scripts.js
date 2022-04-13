var canvas = document.getElementById("battlefield");
var ctx = canvas.getContext("2d");
ctx.font = "15px Arial";
ctx.fillStyle = "red";

let myDmg = 10;

const cannonX = 1000;
const cannonY = 250;

let enemiesArray = [];

function drawCannon() {
  ctx.beginPath();
  ctx.ellipse(cannonX, cannonY, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
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

  this.hit = (dmg) => {
    this.hp -= dmg;
    if (this.hp === 0) {
      clearInterval(this.interval);
      this.clear();
      this.x = 0;
      this.y = 0;
      // enemiesArray.pop(this);
    }
  };
};

drawCannon();

const Bullet = function (destX, destY) {
  this.lastX = cannonX;
  this.lastY = cannonY;

  this.dmg = myDmg;

  this.clear = () => {
    ctx.clearRect(this.lastX - 10, this.lastY - 10, 20, 20);
  };

  let yDir = cannonY > destY ? -1 : cannonY < destY ? 1 : 0;
  let lenX = cannonX - destX;
  let lenY = cannonY - destY;
  lenY = lenY > -0 ? lenY : lenY * -1;
  let diff = lenX > lenY ? lenY / lenX : lenX / lenY;

  this.nextX = this.lastX - 0.8 * 100;
  this.nextY = this.lastY + 0.8 * 100 * diff * yDir;

  this.draw = () => {
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
      this.checkHit();
      this.nextX = this.lastX - 0.8 * 10;
      this.nextY = this.lastY + 0.8 * 10 * diff * yDir;
      if (this.lastX < 0 || this.lastY < 0 || this.lastY > 500) {
        this.stop();
      }
    }, 10);
  };

  this.checkHit = () => {
    enemiesArray.forEach((e) => {
      var left = e.x;
      var right = e.x + 100;
      var top = e.y;
      var bottom = e.y + 50;

      let hit =
        this.lastX >= left &&
        this.lastX <= right &&
        this.lastY >= top &&
        this.lastY <= bottom;

      if (hit) {
        e.hit(this.dmg);
        // this.dmg = 0; //jesli bede chcial zadawac przedzial dmg
        this.stop();
      }
    });
  };

  this.stop = () => {
    clearInterval(this.interval);
    this.clear();
  };
};

function spawnEnemies() {
  var e1 = new Enemy(200, 10, 10);
  var e2 = new Enemy(250, 10, 10);
  // var e3 = new Enemy(300, 60, 10);

  enemiesArray = [e1, e2];
  enemiesArray.forEach((e) => {
    e.start();
  });
}

spawnEnemies();

canvas.addEventListener(
  "click",
  function (e) {
    var b = new Bullet(e.offsetX, e.offsetY);
    b.go();
  },
  false
);

// setInterval(() => {
//   console.log(enemiesArray.length);
// }, 20);
