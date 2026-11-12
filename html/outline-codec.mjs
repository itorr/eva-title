const OUTLINE_MAGIC = 'OLP2';
const COORDINATE_SCALE = 64;
const PATH_COMMANDS = [
    ['M', 2, 'moveTo'],
    ['L', 2, 'lineTo'],
    ['Q', 4, 'quadraticCurveTo'],
    ['C', 6, 'bezierCurveTo'],
    ['Z', 0, 'closePath'],
];

export function decodeOutlines(buffer, createPath = () => new Path2D()) {
    const view = new DataView(buffer);
    if (
        view.byteLength < 8 ||
        String.fromCharCode(...new Uint8Array(buffer, 0, 4)) !== OUTLINE_MAGIC
    ) {
        throw new Error('Invalid outline header');
    }
    const bytes = new Uint8Array(buffer);
    let offset = 8;
    const unsigned = () => {
        let value = 0;
        for (let shift = 0; shift <= 28 && offset < bytes.length; shift += 7) {
            const byte = bytes[offset++];
            value += (byte & 127) * 2 ** shift;
            if (!(byte & 128)) {
                if (value <= 0x7fffffff) return value;
                break;
            }
        }
        throw new Error('Invalid outline integer');
    };
    const glyphs = new Map();
    const count = view.getUint32(4, true);
    for (let index = 0; index < count; index += 1) {
        const glyphId = unsigned();
        const commands = unsigned();
        const shift = bytes[offset++];
        if (
            glyphs.has(glyphId) ||
            shift === undefined ||
            2 ** shift > COORDINATE_SCALE ||
            commands > bytes.length - offset
        )
            throw new Error('Invalid glyph record');
        const coordinateScale = 2 ** shift;
        const path = createPath(glyphId);
        const previous = [0, 0];
        for (let command = 0; command < commands; command += 1) {
            const operation = PATH_COMMANDS[bytes[offset++]];
            if (!operation) throw new Error('Invalid outline command');
            const [, length, method] = operation;
            const coordinates = [];
            for (let point = 0; point < length; point += 1) {
                const encoded = unsigned();
                const delta = encoded % 2 ? -(encoded + 1) / 2 : encoded / 2;
                const axis = point % 2;
                previous[axis] += delta;
                coordinates.push(previous[axis] / coordinateScale);
            }
            path[method](...coordinates);
        }
        glyphs.set(glyphId, path);
    }
    if (offset !== bytes.length) throw new Error('Trailing data in outline shard');
    return glyphs;
}

export function decodeInlineOutlines(buffer, createPath) {
    if (buffer.byteLength < 12) throw new Error('Invalid inline outline response');
    const length = new DataView(buffer).getUint32(0, true);
    if (length > buffer.byteLength - 12) throw new Error('Invalid inline layout length');
    const layout = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 4, length)));
    return { layout, glyphs: decodeOutlines(buffer.slice(4 + length), createPath) };
}
