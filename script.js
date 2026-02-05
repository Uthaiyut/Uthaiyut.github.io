/**
 * Quadratic Graph Controller - High Definition Version
 */

const graphApp = {
    config: {
        canvas: document.getElementById("graph"),
        ctx: document.getElementById("graph").getContext("2d"),
        inputs: {
            a: document.getElementById("a"),
            b: document.getElementById("b"),
            c: document.getElementById("c")
        },
        displays: {
            a: document.getElementById("aVal"),
            b: document.getElementById("bVal"),
            c: document.getElementById("cVal")
        },
        scale: 30,
        minScale: 10,
        maxScale: 150
    },

    init() {
        // ความละเอียดสูง
        this.setupCanvasHD();
        
        const { a, b, c } = this.config.inputs;
        [a, b, c].forEach(input => {
            input.addEventListener('input', () => this.draw());
        });

        document.getElementById("zoomIn").onclick = () => this.zoom(1.15);
        document.getElementById("zoomOut").onclick = () => this.zoom(0.85);

        // วาดกราฟครั้งแรก
        this.draw();
    },

    // ฟังก์ชันสำคัญ: ปรับความละเอียด Canvas ให้คมชัด
    setupCanvasHD() {
        const { canvas, ctx } = this.config;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // ตั้งค่าขนาดจริงของ Canvas
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        // ตั้งค่าขนาดแสดงผลใน CSS
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // ปรับสเกลของ Context ให้เหมาะสมกับ DPR
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
        // คำนวณตำแหน่งกึ่งกลาง
        const rect = canvas.getBoundingClientRect();
        const midX = rect.width / 2;
        const midY = rect.height / 2;

        // อัปเดตค่าที่แสดง
        displays.a.textContent = inputs.a.value;
        displays.b.textContent = inputs.b.value;
        displays.c.textContent = inputs.c.value;

        // ล้างหน้าจอ
        ctx.clearRect(0, 0, rect.width, rect.height);

        // วาดกริด แกน และกราฟ
        this.drawGrid(ctx, rect, scale);
        this.drawAxes(ctx, rect, midX, midY, scale);
        this.drawCurve(ctx, rect, midX, midY, scale, inputs);
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

        // แกน X กับ Y
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(rect.width, midY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(midX, 0); ctx.lineTo(midX, rect.height); ctx.stroke();

        // ตำแหน่งตัวเลขบนแกน
        const maxUnits = Math.ceil(midX / scale);
        for (let i = -maxUnits; i <= maxUnits; i++) {
            if (i === 0) continue;
            let xPos = midX + i * scale;
            let yPos = midY - i * scale;
            ctx.fillText(i, xPos - 5, midY + 18);
            ctx.fillText(i, midX + 10, yPos + 4);
        }
    },

    drawCurve(ctx, rect, midX, midY, scale, inputs) {
        const a = parseFloat(inputs.a.value);
        const b = parseFloat(inputs.b.value);
        const c = parseFloat(inputs.c.value);

        ctx.strokeStyle = "#764ba2"; 
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        for (let px = 0; px <= rect.width; px++) {
            const x = (px - midX) / scale;
            const y = (a * x * x) + (b * x) + c;
            const py = midY - (y * scale);

            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();
    }
};

graphApp.init();