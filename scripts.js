var canvas = document.getElementById("battlefield");
var canvas2 = document.getElementById("base");
var ctx = canvas.getContext("2d");
var ctx2 = canvas2.getContext("2d");
ctx.font = "15px Arial";
var hpLabel = document.getElementById("hp");

let myDmg = 10;
let myHp = 100;
hpLabel.style.color = "red";
hpLabel.textContent = myHp;
let kills = 0;
var killsLabel = document.getElementById("kills");
killsLabel.textContent = kills;
var timer = document.getElementById("time");
let timeMin = 0;
let timeSec = 0;
const cannonX = 1000;
const cannonY = 250;

let enemiesArray = [];
let ammoArray = [1, 1, 1];
let ammoLoadTime = 1000;

function drawCannon() {
  ctx.beginPath();
  ctx.ellipse(cannonX, cannonY, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
  ctx.stroke();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const Enemy = function (hp, speed, dmg) {
  this.hp = hp;
  this.speed = speed;
  this.dmg = dmg;

  this.x = 0;
  this.y = getRandomInt(0, 500);

  this.width = 50;
  this.height = 25;

  this.shotDown = false;
  this.arrived = false;

  this.clear = () => {
    ctx.clearRect(this.x, this.y - 25, this.width, this.height + 25);
  };

  this.draw = () => {
    this.x += 1;
    ctx.fillStyle = "grey";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "red";
    ctx.fillText(this.hp, this.x, this.y - 10);
  };

  this.start = () => {
    this.interval = setInterval(() => {
      this.clear();
      this.draw();
      if (this.x > 1000) {
        this.arrived = true;
        getDamage(this.dmg);
        this.stop();
      }
    }, this.speed);
  };

  this.hit = (dmg) => {
    this.hp -= dmg;
    if (this.hp === 0) {
      this.shotDown = true;
      this.stop();
      kills += 1;
      killsLabel.textContent = kills;
    }
  };

  this.stop = () => {
    clearInterval(this.interval);
    this.clear();
    this.x = 0;
    this.y = 0;
    this.clear();
  };
};

const Bullet = function (destX, destY) {
  this.lastX = cannonX;
  this.lastY = cannonY;

  this.dmg = myDmg;

  this.size = 3;

  this.clear = () => {
    ctx.clearRect(
      this.lastX - 10,
      this.lastY - 10,
      this.size * 5,
      this.size * 5
    );
  };

  let yDir = cannonY > destY ? -1 : cannonY < destY ? 1 : 0;
  let lenX = cannonX - destX;
  let lenY = cannonY - destY;
  lenY = lenY > -0 ? lenY : lenY * -1;
  let diff = lenX > lenY ? lenY / lenX : lenX / lenY;

  this.nextX = this.lastX; // - 0.1 * 1000;
  this.nextY = this.lastY; //+ 0.1 * 1000 * diff * yDir;

  this.draw = () => {
    ctx.beginPath();
    ctx.ellipse(
      this.nextX,
      this.nextY,
      this.size,
      this.size,
      Math.PI / 4,
      0,
      2 * Math.PI
    );
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
      var right = e.x + e.width;
      var top = e.y;
      var bottom = e.y + e.height;

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
  var e1 = new Enemy(100, 10, 20);
  var e2 = new Enemy(50, 10, 15);
  var e3 = new Enemy(80, 60, 10);
  var e4 = new Enemy(80, 60, 10);
  var e5 = new Enemy(80, 60, 40);
  enemiesArray = [e1, e2, e3, e4, e5];
  enemiesArray.forEach((e) => {
    e.start();
  });
}

function getDamage(dmg) {
  myHp -= dmg;
  hpLabel.textContent = myHp;
}

function drawAmmo() {
  let y = 400;

  ammoArray
    .slice()
    .reverse()
    .forEach((element) => {
      ctx2.fillStyle = "grey";
      ctx2.fillRect(40, y, 50, 20);
      if (element === 1) {
        ctx2.fillStyle = "blue";
        ctx2.fillRect(40, y, 50, 20);
      }
      y += 25;
    });
}

function startTimer() {
  setInterval(() => {
    timeSec += 1;
    if (timeSec === 60) {
      timeMin += 1;
      timeSec = 0;
    }
    let minutes = timeMin > 10 ? timeMin : `0${timeMin}`;
    let seconds = timeSec > 10 ? timeSec : `0${timeSec}`;
    timer.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

canvas.addEventListener(
  "click",
  function (e) {
    let ammoIndex = ammoArray.lastIndexOf(1);
    console.log(ammoIndex);
    if (ammoIndex >= 0) {
      ammoArray[ammoIndex] = 0;

      var b = new Bullet(e.offsetX, e.offsetY);
      b.go();
    }
    drawAmmo();
  },
  false
);

canvas.addEventListener(
  "mousemove",
  function (e) {
    drawCannon();
  },
  false
);

setInterval(() => {
  ammoArray[ammoArray.indexOf(0)] = 1;
  drawAmmo();
}, ammoLoadTime);

startTimer();
drawCannon();
spawnEnemies();
drawAmmo();
