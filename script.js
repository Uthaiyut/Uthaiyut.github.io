const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

const a = document.getElementById("a");
const b = document.getElementById("b");
const c = document.getElementById("c");

const aVal = document.getElementById("aVal");
const bVal = document.getElementById("bVal");
const cVal = document.getElementById("cVal");

// ค่า scale เริ่มต้น
let scale = 25;
const mid = canvas.width / 2;

// ปุ่ม zoom
document.getElementById("zoomIn").onclick = () => { scale *= 1.15; drawGraph(); };
document.getElementById("zoomOut").onclick = () => { scale /= 1.15; drawGraph(); };

// keyboard zoom
document.addEventListener("keydown", e => {
  if (e.key === "+") { scale *= 1.15; drawGraph(); }
  if (e.key === "-") { scale /= 1.15; drawGraph(); }
});

function drawScale() {
  ctx.fillStyle = "#000";
  ctx.font = "11px Arial";

  const maxUnits = Math.ceil(mid / scale);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000";

  for (let i = -maxUnits; i <= maxUnits; i++) {
    let xPixel = mid + i * scale;
    let yPixel = mid - i * scale;

    // X ticks
    ctx.beginPath();
    ctx.moveTo(xPixel, mid - 5);
    ctx.lineTo(xPixel, mid + 5);
    ctx.stroke();

    // Y ticks
    ctx.beginPath();
    ctx.moveTo(mid - 5, yPixel);
    ctx.lineTo(mid + 5, yPixel);
    ctx.stroke();

    // numbers
    if (i !== 0) {
      ctx.fillText(i, xPixel - 3, mid + 15); // X numbers
      ctx.fillText(i, mid + 8, yPixel + 4);  // Y numbers
    }
  }
}

function drawGraph() {
  // update ค่าแสดงบนหน้า
  aVal.textContent = a.value;
  bVal.textContent = b.value;
  cVal.textContent = c.value;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // GRID
  ctx.strokeStyle = "#e8e8e8";
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += scale) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += scale) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // AXES
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(canvas.width, mid);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(mid, 0);
  ctx.lineTo(mid, canvas.height);
  ctx.stroke();

  // SCALE NUMBERS
  drawScale();

  // QUADRATIC CURVE
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 3;
  ctx.beginPath();

  for (let px = 0; px <= canvas.width; px++) {
    let x = (px - mid) / scale;
    let y = Number(a.value) * x * x + Number(b.value) * x + Number(c.value);
    let py = mid - y * scale;

    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.stroke();
}

a.oninput = b.oninput = c.oninput = drawGraph;

drawGraph();
