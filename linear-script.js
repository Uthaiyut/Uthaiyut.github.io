/**
 * Linear Graph Controller
 */
const linearApp = {
    config: {
        canvas: document.getElementById("linearGraph"),
        ctx: document.getElementById("linearGraph").getContext("2d"),
        inputs: {
            m: document.getElementById("mInput"),
            c: document.getElementById("kInput")
        },
        displays: {
            m: document.getElementById("mVal"),
            c: document.getElementById("kVal")
        },
        scale: 40,
        minScale: 10,
        maxScale: 150
    },

    init() {
        this.setupCanvasHD();
        const { m, c } = this.config.inputs;
        [m, c].forEach(input => {
            input.addEventListener('input', () => this.draw());
        });

        document.getElementById("zoomIn").onclick = () => this.zoom(1.15);
        document.getElementById("zoomOut").onclick = () => this.zoom(0.85);
        this.draw();
    },

    setupCanvasHD() {
        const { canvas, ctx } = this.config;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
    },

    zoom(factor) {
        const newScale = this.config.scale * factor;
        if (newScale > this.config.minScale && newScale < this.config.maxScale) {
            this.config.scale = newScale;
            this.draw();
        }
    },

    draw() {
        const { canvas, ctx, scale, inputs, displays } = this.config;
        const rect = canvas.getBoundingClientRect();
        const midX = rect.width / 2;
        const midY = rect.height / 2;

        displays.m.textContent = inputs.m.value;
        displays.c.textContent = inputs.c.value;

        ctx.clearRect(0, 0, rect.width, rect.height);

        this.drawGrid(ctx, rect, scale);
        this.drawAxes(ctx, rect, midX, midY, scale);
        this.drawLine(ctx, rect, midX, midY, scale, inputs);
    },

    drawGrid(ctx, rect, scale) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
        ctx.lineWidth = 1;
        for (let x = 0; x <= rect.width; x += scale) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, rect.height); ctx.stroke();
        }
        for (let y = 0; y <= rect.height; y += scale) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(rect.width, y); ctx.stroke();
        }
    },

    drawAxes(ctx, rect, midX, midY, scale) {
        ctx.strokeStyle = "#2d3436";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#636e72";
        ctx.font = "11px Kanit, Arial";

        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(rect.width, midY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(midX, 0); ctx.lineTo(midX, rect.height); ctx.stroke();

        const maxUnits = Math.ceil(midX / scale);
        for (let i = -maxUnits; i <= maxUnits; i++) {
            if (i === 0) continue;
            let xPos = midX + i * scale;
            let yPos = midY - i * scale;
            ctx.fillText(i, xPos - 5, midY + 18);
            ctx.fillText(i, midX + 10, yPos + 4);
        }
    },

    drawLine(ctx, rect, midX, midY, scale, inputs) {
    const m = parseFloat(inputs.m.value);
    const c = parseFloat(inputs.c.value);

    ctx.strokeStyle = "#764ba2  "; 
    ctx.lineWidth = 4;
    ctx.beginPath();

    // แก้ไข: คำขอบขวาของนวณจากขอบซ้ายไป Canvas เพื่อความแม่นยำ
    const xLeft = -midX / scale;
    const xRight = (rect.width - midX) / scale;

    const yLeft = m * xLeft + c;
    const yRight = m * xRight + c;

    ctx.moveTo(0, midY - (yLeft * scale));
    ctx.lineTo(rect.width, midY - (yRight * scale));
    ctx.stroke();
    }
};

linearApp.init();