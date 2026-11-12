import { decodeInlineOutlines } from './outline-codec.mjs';

const control = /\p{Cc}/u;

export class StaticOutlineFont {
    constructor(directory, fetchResource = globalThis.fetch.bind(globalThis)) {
        this.directory = new URL(directory);
        this.fetchResource = fetchResource;
        this.points = new Map();
        this.metrics = new Map();
        this.outlines = new Map();
        this.requests = new Map();
    }

    load(file, get, optional = false) {
        if (!this.requests.has(file)) {
            this.requests.set(
                file,
                this.fetchResource(new URL(file, this.directory))
                    .then((response) => {
                        if (optional && response.status === 404) return;
                        if (!response.ok) throw new Error(`Outline asset ${file} returned ${response.status}`);
                        return get(response);
                    })
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
            const pack = decodeInlineOutlines(await response.arrayBuffer());
            const { format, version, upem, ascender, descender, hasRightRepeat } = pack.layout;
            if (format !== 2) throw new Error('Unsupported outline pack format');
            if (this.info && this.info.version !== version)
                throw new Error('Inconsistent outline release');
            this.info = { version, upem, ascender, descender, hasRightRepeat };
            this.addPack(pack);
            return this;
        });
    }

    addPack({ layout, glyphs }) {
        for (const [point, horizontal, vertical = horizontal] of layout.points) {
            this.points.set(point, [horizontal, vertical]);
        }
        for (const [glyph, ...metrics] of layout.metrics ?? []) this.metrics.set(glyph, metrics);
        for (const [glyph, path] of glyphs) this.outlines.set(glyph, path);
    }

    async ensure(texts) {
        const characters = [...new Set(texts.flatMap((text) => Array.from(text)))];
        const pages = new Set();
        for (const character of characters) {
            const point = character.codePointAt(0);
            if (!control.test(character) && !this.points.has(point)) pages.add(point >>> 6);
        }
        await Promise.all(
            [...pages].map((page) => this.load(
                `u${page.toString(16).padStart(4, '0')}.bin`,
                async (response) => {
                    const pack = decodeInlineOutlines(await response.arrayBuffer());
                    if (pack.layout.version !== this.info.version || pack.layout.page !== page)
                        throw new Error('Inconsistent outline page');
                    this.addPack(pack);
                },
                true,
            )),
        );
    }

    has(character) {
        return (
            !control.test(character) &&
            this.outlines.has(this.points.get(character.codePointAt(0))?.[0])
        );
    }

    shape(text, vertical = false) {
        const { upem, ascender } = this.info;
        return Array.from(text, (character) => {
            const glyph =
                !control.test(character) &&
                this.points.get(character.codePointAt(0))?.[vertical ? 1 : 0];
            const path = this.outlines.get(glyph);
            if (!path) return [null, upem, 0, 0];
            const [advance, verticalAdvance, x, y] = this.metrics.get(glyph) ?? [];
            const horizontal = advance ?? upem;
            return vertical
                ? [path, -(verticalAdvance ?? -upem), x ?? -Math.trunc(horizontal / 2), y ?? -ascender]
                : [path, horizontal, 0, 0];
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
