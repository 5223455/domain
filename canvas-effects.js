const canvas = document.getElementById("birthdayCanvas");
const ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// 🎯 Change animation mode after 2 minutes
let mode = 'birthday';
setTimeout(() => {
  mode = 'alternate';
}, 120);

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FFADAD"];
const balloons = [], fireworks = [], stars = [], confetti = [], flames = [], pops = [];

class Balloon {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.r = 20 + Math.random() * 10;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.dy = -0.8 - Math.random() * 0.5;
    this.angle = 0;
    this.swing = Math.random() * 2 + 1;
    this.popped = false;
  }
  update() {
    if (!this.popped) {
      this.y += this.dy;
      this.angle += 0.02;
      this.x += Math.sin(this.angle) * 0.5;
      if (this.y + this.r < 0) this.reset();
    }
  }
  draw() {
    if (this.popped) return;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.r * 0.8, this.r, 0, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.r);
    for (let i = 0; i < 10; i++) {
      ctx.lineTo(this.x + Math.sin(this.angle + i) * 2, this.y + this.r + i * 5);
    }
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
  }
}

class PopEffect {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.alpha = 1;
    this.color = color;
  }
  update() {
    this.radius += 1.5;
    this.alpha -= 0.05;
  }
  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();
  }
  isDone() {
    return this.alpha <= 0;
  }
}

class Firework {
  constructor(x = Math.random() * width, y = Math.random() * height / 2) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = Math.random() * 40 + 20;
    this.alpha = 1;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    if (this.radius < this.maxRadius) {
      this.radius += 1.2;
      this.alpha -= 0.02;
    } else {
      this.alpha = 0;
    }
  }
  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();
  }
  isDone() {
    return this.alpha <= 0;
  }
}

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random();
    this.fade = Math.random() * 0.02;
  }
  update() {
    this.alpha += this.fade;
    if (this.alpha <= 0 || this.alpha >= 1) this.fade *= -1;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();
  }
}

class Confetti {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.size = Math.random() * 5 + 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.dy = Math.random() * 2 + 1;
    this.angle = 0;
    this.spin = (Math.random() - 0.5) * 0.1;
  }
  update() {
    this.y += this.dy;
    this.angle += this.spin;
    if (this.y > height) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

class Flame {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 1;
  }
  update() {
    this.alpha = 0.7 + Math.random() * 0.3;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, 5, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#FFA500";
    ctx.fill();
    ctx.restore();
  }
}

function drawGradientBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#ffeabf");
  gradient.addColorStop(1, "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

// Populate arrays
for (let i = 0; i < 12; i++) balloons.push(new Balloon());
for (let i = 0; i < 80; i++) stars.push(new Star());
for (let i = 0; i < 50; i++) confetti.push(new Confetti());
flames.push(new Flame(width / 2 - 30, height - 100));
flames.push(new Flame(width / 2 + 30, height - 100));

setInterval(() => {
  if (mode === 'birthday') {
    for (let i = 0; i < 3; i++) fireworks.push(new Firework());
  }
}, 10000);

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  balloons.forEach(balloon => {
    const dx = mouseX - balloon.x;
    const dy = mouseY - balloon.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < balloon.r && !balloon.popped) {
      balloon.popped = true;
      pops.push(new PopEffect(balloon.x, balloon.y, balloon.color));
      setTimeout(() => balloon.reset(), 1000);
    }
  });
});

function animate() {
  drawGradientBackground();

  if (mode === 'birthday') {
    stars.forEach(s => { s.update(); s.draw(); });
    confetti.forEach(c => { c.update(); c.draw(); });
    balloons.forEach(b => { b.update(); b.draw(); });
    fireworks.forEach((f, i) => {
      f.update(); f.draw();
      if (f.isDone()) fireworks.splice(i, 1);
    });
    pops.forEach((p, i) => {
      p.update(); p.draw();
      if (p.isDone()) pops.splice(i, 1);
    });
    flames.forEach(f => { f.update(); f.draw(); });
  } else {
    stars.forEach(s => { s.update(); s.draw(); });
    confetti.forEach(c => {
      c.dy = 0.5;
      c.spin *= 1.05;
      c.update();
      c.draw();
    });
    balloons.slice(0, 4).forEach(b => {
      b.update();
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 20;
      b.draw();
      ctx.shadowBlur = 0;
    });
  }


  requestAnimationFrame(animate);
}

animate();
