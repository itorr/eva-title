import { decodeInlineOutlines, decodeOutlines } from './outline-codec.mjs';

const control = /\p{Cc}/u;

export class StaticOutlineFont {
    constructor(directory, fetchResource = globalThis.fetch.bind(globalThis)) {
        this.directory = new URL(directory);
        this.fetchResource = fetchResource;
        this.points = new Map();
        this.metrics = new Map();
        this.outlines = new Map();
        this.hotShards = new Map();
        this.requests = new Map();
    }

    async fetch(file) {
        const response = await this.fetchResource(new URL(file, this.directory));
        if (!response.ok) throw new Error(`Outline asset ${file} returned ${response.status}`);
        return response;
    }

    load(file, get) {
        if (!this.requests.has(file)) {
            this.requests.set(
                file,
                this.fetch(file)
                    .then(get)
                    .catch((error) => {
                        this.requests.delete(file);
                        throw error;
                    }),
            );
        }
        return this.requests.get(file);
    }

    preload(name) {
        return this.load(`${name}.bin`, async (response) => {
            const { layout, glyphs } = decodeInlineOutlines(await response.arrayBuffer());
            if (this.info && this.info.version !== layout.version)
                throw new Error('Inconsistent outline release');
            this.info = layout;
            for (const [point, ...pair] of layout.points) this.points.set(point, pair);
            for (const [glyph, ...metrics] of layout.metrics) this.metrics.set(glyph, metrics);
            for (const [glyph, file] of layout.hotShards) this.hotShards.set(glyph, file);
            for (const [glyph, path] of glyphs) this.outlines.set(glyph, path);
            return this;
        });
    }

    async ensure(texts) {
        const characters = [...new Set(texts.flatMap((text) => Array.from(text)))];
        const points = characters.map((char) => char.codePointAt(0));
        if (points.some((point) => !this.points.has(point))) {
            this.index = await this.load(this.info.indexFile, async (response) => {
                const data = await response.json();
                for (const [point, ...pair] of data.points) this.points.set(point, pair);
                data.metrics.forEach((metrics, glyph) => this.metrics.set(glyph, metrics));
                return data;
            });
        }
        const shards = new Set();
        for (const point of points) {
            for (const glyph of this.points.get(point) ?? []) {
                if (this.outlines.has(glyph)) continue;
                const file =
                    this.hotShards.get(glyph) ?? this.index?.shards[this.index.glyphToShard[glyph]];
                if (file) shards.add(file);
            }
        }
        await Promise.all(
            [...shards].map((file) =>
                this.load(file, async (response) => {
                    for (const [glyph, path] of decodeOutlines(await response.arrayBuffer()))
                        this.outlines.set(glyph, path);
                }),
            ),
        );
    }

    has(character) {
        return (
            !control.test(character) &&
            this.outlines.has(this.points.get(character.codePointAt(0))?.[0])
        );
    }

    shape(text, vertical = false) {
        const { upem } = this.info;
        return Array.from(text, (character) => {
            const glyph =
                !control.test(character) &&
                this.points.get(character.codePointAt(0))?.[vertical ? 1 : 0];
            const path = this.outlines.get(glyph);
            if (!path) return [null, upem, 0, 0];
            const [horizontal, advance, x, y] = this.metrics.get(glyph);
            return vertical ? [path, -advance, x, y] : [path, horizontal, 0, 0];
        });
    }

    draw(ctx, glyphs, x, y, size, spacing = 0, vertical = false) {
        const scale = size / this.info.upem;
        for (const [path, advance, dx, dy] of glyphs) {
            if (path) {
                ctx.save();
                ctx.translate(x + dx * scale, y - dy * scale);
                ctx.scale(scale, -scale);
                ctx.fill(path);
                ctx.restore();
            }
            const step = advance * scale + spacing;
            if (vertical) y += step;
            else x += step;
        }
    }
}
