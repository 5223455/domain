const canvas = document.getElementById("memoriesCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let width = canvas.width;
let height = canvas.height;

window.addEventListener("resize", () => {
  canvas.width = width = window.innerWidth;
  canvas.height = height = window.innerHeight;
});

const colors = ["#ffe0e0", "#fff8b3", "#e6f7ff", "#fbd1ff"];
const orbs = [];

class Orb {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.r = 20 + Math.random() * 30;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = 0.2 + Math.random() * 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < -this.r || this.x > width + this.r || this.y < -this.r || this.y > height + this.r) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 40; i++) orbs.push(new Orb());

function animate() {
  ctx.clearRect(0, 0, width, height);
  orbs.forEach(orb => {
    orb.update();
    orb.draw();
  });
  requestAnimationFrame(animate);
}

animate();
