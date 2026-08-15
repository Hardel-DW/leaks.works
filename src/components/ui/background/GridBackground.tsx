const DEFAULT_CELL = 36;
const INSET_PX = 1;
const LINE_COLOR = "#161618";
const ZINC500_RGB = "113, 113, 122";
const VIGNETTE_ALPHA = 0.55;
const PULSE_DURATION_S = 1.6;
const MIN_PERIOD_S = 4.5;
const MAX_PERIOD_S = 11;
const MIN_PEAK_ALPHA = 0.06;
const MAX_PEAK_ALPHA = 0.18;

/** Hex (#rrggbb) or "white" -> "r, g, b" for rgba() twinkle fills. */
function toRgb(accent: string): string {
    if (accent.toLowerCase() === "white" || accent === "#ffffff") return "255, 255, 255";
    const hex = accent.replace("#", "");
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

function pulseAlpha(i: number, j: number, time: number): number {
    const hash = ((i * 92821) ^ (j * 37579) ^ ((i + j) * 14107)) >>> 0;
    const periodNorm = ((hash >>> 8) & 0xffff) / 65535;
    const period = MIN_PERIOD_S + (MAX_PERIOD_S - MIN_PERIOD_S) * periodNorm;
    const phase = (hash & 0xff) / 255;
    const elapsed = ((time / period + phase) % 1) * period;
    if (elapsed > PULSE_DURATION_S) return 0;
    const curve = Math.sin((Math.PI * elapsed) / PULSE_DURATION_S);
    const peakNorm = ((hash >>> 24) & 0xff) / 255;
    const peak = MIN_PEAK_ALPHA + (MAX_PEAK_ALPHA - MIN_PEAK_ALPHA) * peakNorm;
    return curve * peak;
}

interface GridStyle {
    cell: number;
    accentRgb: string;
    lineColor: string;
    opacity: number;
}

function drawGridLines(ctx: CanvasRenderingContext2D, w: number, h: number, cell: number, lineColor: string) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += cell) {
        const sx = Math.floor(x) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
    }

    for (let y = 0; y <= h; y += cell) {
        const sy = Math.floor(y) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
    }

    ctx.stroke();
}

function drawTwinkles(ctx: CanvasRenderingContext2D, w: number, h: number, cell: number, accentRgb: string, time: number) {
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const inner = cell - 2 * INSET_PX;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const alpha = pulseAlpha(i, j, time);
            if (alpha <= 0) continue;
            ctx.fillStyle = `rgba(${accentRgb}, ${alpha})`;
            ctx.fillRect(i * cell + INSET_PX, j * cell + INSET_PX, inner, inner);
        }
    }
}

function drawVignette(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const radius = Math.max(w, h) * 0.7;
    const gradient = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, radius);
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0,0,0,${VIGNETTE_ALPHA})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
}

function paint(ctx: CanvasRenderingContext2D, w: number, h: number, style: GridStyle, time: number) {
    ctx.clearRect(0, 0, w, h);
    if (w <= 0 || h <= 0 || style.cell <= 0 || style.opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(style.opacity, 1);
    drawGridLines(ctx, w, h, style.cell, style.lineColor);
    drawTwinkles(ctx, w, h, style.cell, style.accentRgb, time);
    drawVignette(ctx, w, h);
    ctx.restore();
}

function syncCanvas(canvas: HTMLCanvasElement) {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
    }
    return { w, h };
}

function startCanvas(canvas: HTMLCanvasElement, animate: boolean, style: GridStyle) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    const render = (timestamp: number) => {
        const { w, h } = syncCanvas(canvas);
        paint(ctx, w, h, style, timestamp / 1000);
        frame = requestAnimationFrame(render);
    };
    if (animate) frame = requestAnimationFrame(render);
    if (!animate) {
        const { w, h } = syncCanvas(canvas);
        paint(ctx, w, h, style, 0);
    }
    return () => cancelAnimationFrame(frame);
}

interface GridBackgroundProps {
    animate: boolean;
    cellSize?: number;
    accent?: string;
    lineColor?: string;
    opacity?: number;
}

/** 1:1 port of Compose GridBackground.kt: painted on canvas every frame since CSS keyframes can't reproduce the per-cell timing model. */
export default function GridBackground({ animate, cellSize = DEFAULT_CELL, accent, lineColor = LINE_COLOR, opacity = 1 }: GridBackgroundProps) {
    const style: GridStyle = { cell: cellSize, accentRgb: accent ? toRgb(accent) : ZINC500_RGB, lineColor, opacity };

    const canvasRef = (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        return startCanvas(canvas, animate, style);
    };

    return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full" />;
}
