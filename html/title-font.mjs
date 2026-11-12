import { StaticOutlineFont } from './static-outline-font.mjs';

export async function loadTitleFont(initialLayout) {
    const manifestURL = new URL('title-font.json', location.href);
    const response = await fetch(manifestURL, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Unable to load the title font manifest');

    const { font, outlines, codepoints } = await response.json();
    if (typeof outlines === 'string' && /^wedge-[a-f0-9]{12}\/$/.test(outlines)) {
        const outline = await new StaticOutlineFont(new URL(outlines, manifestURL)).preload(
            initialLayout === 'e1' ? 'entry' : 'templates',
        );
        return { outline, version: outline.info.version };
    }

    if (
        typeof font !== 'string' ||
        !font ||
        !Array.isArray(codepoints) ||
        !codepoints.length ||
        codepoints.some(
            (code) =>
                !Number.isInteger(code) ||
                code < 0 ||
                code > 0x10ffff ||
                (code >= 0xd800 && code <= 0xdfff),
        )
    ) {
        throw new Error('Invalid title font manifest');
    }
    const url = new URL(font, manifestURL);
    if (url.origin !== manifestURL.origin || !/\.woff2?$/i.test(url.pathname)) {
        throw new Error('Invalid title font URL');
    }
    const family = 'EvaTitleFont';
    const face = new FontFace(family, `url(${JSON.stringify(url.href)})`);
    document.fonts.add(await face.load());
    return { family, coverage: new Set(codepoints), version: url.searchParams.get('v') };
}
