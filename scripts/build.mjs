import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { build } from 'esbuild';
import less from 'less';
import { minify } from 'html-minifier-terser';

const { values, positionals } = parseArgs({
    options: { outlines: { type: 'string' } },
    allowPositionals: true,
});
if (positionals.length > 1)
    throw new Error('Usage: npm run build -- [output] [--outlines directory]');

const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'html');
const output = resolve(
    positionals[0] ?? join(root, 'dest', values.outlines ? 'outline-preview' : 'production'),
);
const manifestFile = values.outlines ? 'title-font.pages.json' : 'title-font.json';
const hash = (contents) => createHash('sha256').update(contents).digest('hex').slice(0, 12);
const copy = (from, to, name) => copyFile(join(from, name), join(to, name));
const outlineHeader = (pack) => JSON.parse(pack.subarray(4, 4 + pack.readUInt32LE()).toString());

async function installFont() {
    if (!values.outlines) {
        await Promise.all(
            ['base-split.woff', 'title-font.json'].map((name) => copy(source, output, name)),
        );
        return;
    }

    const directory = resolve(values.outlines);
    const presets = ['entry.bin', 'templates.bin'];
    const pages = (await readdir(directory))
        .filter((name) => /^u(?:[0-3][a-f0-9]|4[0-3])[a-f0-9]{2}\.bin$/.test(name))
        .sort();
    if (!pages.length) throw new Error('No Unicode outline pages found');
    const files = [...presets, ...pages];
    const packs = await Promise.all(files.map((name) => readFile(join(directory, name))));
    const [entry, templates, ...pageHeaders] = packs.map(outlineHeader);
    if (
        entry.format !== 2 ||
        templates.format !== 2 ||
        entry.version !== templates.version
    ) {
        throw new Error('Outline preset packs do not match');
    }
    for (const [i, header] of pageHeaders.entries()) {
        if (header.version !== entry.version || header.page !== Number.parseInt(pages[i].slice(1, 5), 16))
            throw new Error(`Invalid outline page: ${pages[i]}`);
    }

    const digest = createHash('sha256');
    files.forEach((name, i) => digest.update(name).update(packs[i]));
    const folder = `wedge-${digest.digest('hex').slice(0, 12)}`;
    const destination = join(output, folder);
    await mkdir(destination, { recursive: true });
    await Promise.all(
        files.flatMap((name) =>
            [name, name + '.br'].map((file) => copy(directory, destination, file)),
        ),
    );
    await writeFile(join(output, manifestFile), JSON.stringify({ outlines: folder + '/' }));
}

const [template, styles] = await Promise.all(
    ['index.html', 'document.less'].map((name) => readFile(join(source, name), 'utf8')),
);
const entryTag = '<script type="module" src="document.mjs"></script>';
const cssTag = '<link rel="stylesheet" href="document.css">';
if (!template.includes(entryTag) || !template.includes(cssTag))
    throw new Error('Missing asset declarations in index.html');

const [{ outputFiles }, { css }] = await Promise.all([
    build({
        entryPoints: [join(source, 'document.mjs')],
        bundle: true,
        format: 'esm',
        define: { TITLE_FONT_MANIFEST: JSON.stringify(manifestFile) },
        minify: true,
        write: false,
    }),
    less.render(styles, { filename: join(source, 'document.less'), compress: true }),
]);
await mkdir(output, { recursive: true });

async function writeAsset(stem, extension, contents) {
    const name = `${stem}.${hash(contents)}.${extension}`;
    await writeFile(join(output, name), contents);
    return name;
}

const [js, stylesheet] = await Promise.all([
    writeAsset('c', 'js', outputFiles[0].contents),
    writeAsset('i', 'css', css),
    copy(source, output, 'logo@2x.png'),
    installFont(),
]);
const html = await minify(
    template
        .replace(entryTag, `<script type="module" src="${js}"></script>`)
        .replace(cssTag, `<link rel="stylesheet" href="${stylesheet}">`),
    {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
    },
);
await writeFile(join(output, 'index.html'), html);
console.log(`${output}\n${js}\n${stylesheet}`);
