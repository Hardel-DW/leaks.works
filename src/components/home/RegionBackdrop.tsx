import { CHUNK, type Region, SECTION_PX, type Shape, seeds, shape, step } from "@/lib/sim/backdrop";

const FRAME_MS = 1000 / 30;
const MAX_DT = 0.05;

type Colors = { grid: string; section: string; fill: string; crown: string };

const readColors = (element: HTMLElement): Colors => {
    const style = getComputedStyle(element);
    const token = (name: string) => style.getPropertyValue(name).trim();
    return { grid: token("--color-bark-900"), section: token("--color-line"), fill: token("--color-bark-900"), crown: token("--color-bark-700") };
};

function gridPattern(context: CanvasRenderingContext2D, colors: Colors): CanvasPattern | null {
    const tile = document.createElement("canvas");
    tile.width = SECTION_PX;
    tile.height = SECTION_PX;
    const paint = tile.getContext("2d");
    if (!paint) return null;
    paint.strokeStyle = colors.grid;
    paint.strokeRect(CHUNK + 0.5, -1, CHUNK, SECTION_PX + 2);
    paint.strokeRect(-1, CHUNK + 0.5, SECTION_PX + 2, CHUNK);
    paint.strokeStyle = colors.section;
    paint.strokeRect(0.5, 0.5, SECTION_PX, SECTION_PX);
    return context.createPattern(tile, "repeat");
}

class Backdrop {
    private regions: Region[] = [];
    private readonly context: CanvasRenderingContext2D;
    private readonly colors: Colors;
    private readonly resizer: ResizeObserver;
    private readonly watcher: IntersectionObserver;
    private grid: CanvasPattern | null = null;
    private frame = 0;
    private last = 0;
    private visible = true;
    private readonly still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    constructor(private readonly canvas: HTMLCanvasElement) {
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas 2D unavailable");
        this.context = context;
        this.colors = readColors(canvas);
        this.resizer = new ResizeObserver(() => this.fit());
        this.resizer.observe(canvas);
        this.watcher = new IntersectionObserver(([entry]) => this.setVisible(entry.isIntersecting));
        this.watcher.observe(canvas);
    }

    private get width() {
        return this.canvas.clientWidth / SECTION_PX;
    }

    private get height() {
        return this.canvas.clientHeight / SECTION_PX;
    }

    dispose() {
        cancelAnimationFrame(this.frame);
        this.resizer.disconnect();
        this.watcher.disconnect();
    }

    private setVisible(visible: boolean) {
        this.visible = visible;
        if (visible && !this.still) this.schedule();
    }

    private fit() {
        const scale = window.devicePixelRatio;
        this.canvas.width = this.canvas.clientWidth * scale;
        this.canvas.height = this.canvas.clientHeight * scale;
        this.context.setTransform(scale, 0, 0, scale, 0, 0);
        this.grid = gridPattern(this.context, this.colors);
        if (this.regions.length === 0) this.regions = seeds(this.width, this.height);
        this.draw();
        if (!this.still) this.schedule();
    }

    private schedule() {
        cancelAnimationFrame(this.frame);
        this.frame = requestAnimationFrame((now) => this.tick(now));
    }

    private tick(now: number) {
        if (!this.visible) return;
        if (now - this.last >= FRAME_MS) {
            const dt = Math.min(MAX_DT, (now - this.last) / 1000);
            this.last = now;
            this.advance(dt);
            this.draw();
        }
        this.schedule();
    }

    private advance(dt: number) {
        this.regions = this.regions.map((region) => step(region, dt, this.width, this.height));
    }

    private draw() {
        const { context, canvas } = this;
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        if (this.grid) context.fillStyle = this.grid;
        context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        for (const region of this.regions) this.drawRegion(shape(region));
    }

    private drawRegion({ active, crown }: Shape) {
        const { context, colors } = this;
        context.fillStyle = colors.fill;
        for (const { sx, sy } of active.values()) context.fillRect(sx * SECTION_PX + 1, sy * SECTION_PX + 1, SECTION_PX - 1, SECTION_PX - 1);
        context.strokeStyle = colors.crown;
        for (const { sx, sy } of crown.values()) context.strokeRect(sx * SECTION_PX + 0.5, sy * SECTION_PX + 0.5, SECTION_PX, SECTION_PX);
    }
}

function mount(canvas: HTMLCanvasElement | null) {
    if (!canvas) return;
    const backdrop = new Backdrop(canvas);
    return () => backdrop.dispose();
}

export default function RegionBackdrop() {
    return <canvas ref={mount} className="pointer-events-none absolute inset-0 size-full" aria-hidden />;
}
