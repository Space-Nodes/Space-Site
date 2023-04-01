const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const stars = [];

function Star() {
  this.x = Math.random() * width;
  this.y = Math.random() * height;
  this.z = Math.random() * width;

  this.move = function() {
    this.z -= 1;
    if (this.z <= 0) {
      this.z = width;
    }
  }

  this.show = function() {
    let x, y, s;
    x = (this.x - width / 2) * (width / this.z);
    x = x + width / 2;

    y = (this.y - height / 2) * (width / this.z);
    y = y + height / 2;

    s = width / this.z;

    ctx.beginPath();
    ctx.fillStyle = '#3a2649';
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 1000; i++) {
  stars[i] = new Star();
}

function draw() {
  ctx.fillStyle = '#181825';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < stars.length; i++) {
    stars[i].move();
    stars[i].show();
  }

  requestAnimationFrame(draw);
}

draw();

const texts = ['Welcome to Space Nodes', 'We are currently under construction', 'check us out later!'];
let textIndex = 0;
let charIndex = 0;
let cursorVisible = true;
let delay = false;
let backspace = false;
let paused = false;
let speed = 100;

function writeText() {
  if (delay || paused) return;
  if (backspace) {
    if (charIndex === 0) {
      backspace = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = true;
      setTimeout(() => { delay = false }, 1000);
    } else {
      charIndex--;
    }
  } else {
    if (charIndex === texts[textIndex].length) {
      backspace = true;
      delay = true;
      setTimeout(() => { delay = false }, 2000);
    } else {
      charIndex++;
    }
  }
  document.querySelector('.text-animation').innerText = texts[textIndex].slice(0, charIndex) + (cursorVisible ? '|' : '');
}

setInterval(writeText, speed);
setInterval(() => { cursorVisible = !cursorVisible }, 500);

document.addEventListener('click', () => { paused = !paused });
document.addEventListener('wheel', event => {
  if (event.deltaY < 0) {
    speed -= 10;
    if (speed < 10) speed =10;} else {
        speed += 10;
        if (speed > 1000) speed = 2000;
      }
    });

    //Last updated: 2023-03-27 - Mathias Clari Drenik