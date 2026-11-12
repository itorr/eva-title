import { layouts } from './layouts.mjs';
import { make, createCanvas, removeCanvas } from './make.mjs';
import { makeBMPFormCanvas } from './makebmp.mjs';
import { loadTitleFont } from './title-font.mjs';
import { createMissingGlyphReporter } from './missing-glyph-log.mjs';

const defaults = {
    blur: true,
    height: 480,
    shadow: true,
    noise: true,
    outputRatio: 1.334,
};

const plans = [
    [undefined, '黑白'],
    ['wb', '白黑'],
    ['br', '黑红'],
    ['rw', '红白'],
    ['by', '黑黄'],
    ['1.11', '序'],
    ['2.22', '破'],
    ['3.33', 'Q'],
    ['3.0+1.11', '终'],
];

const ratios = [
    [1.334, '4:3'],
    [1.778, '16:9'],
    [2.333, '21:9'],
    [1, '3:3'],
    [1.25, '5:4'],
    [1.5, '3:2'],
];

const switches = [
    'blur',
    'noise',
    'convolute',
    'type95',
];

const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
};

function radioGroup(name, options, label) {
    const group = element('span', 'ui-tabs-box');
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', label);
    return {
        node: group,
        controls: options.map(([, caption]) => {
            const item = element('label');
            const input = element('input');
            input.type = 'radio';
            input.name = name;
            item.append(input, element('span', null, caption));
            group.append(item);
            return input;
        }),
    };
}

class TitleEditor {
    constructor(root) {
        this.root = root;
        this.get = (selector) => root.querySelector(selector);
        this.canvas = this.get('.output-box canvas');
        this.workCanvas = createCanvas();
        this.saveButton = this.get('[data-action="save"]');
        this.output = this.get('.ui-shadow');
        this.title = document.title;
        this.revision = 0;
        this.navigation = new Map();
        this.plan = radioGroup('plan', plans, '配色');
        this.ratio = radioGroup('ratio', ratios, '輸出比例');
        this.get('[data-plan]').append(this.plan.node);
        this.get('[data-ratio]').append(this.ratio.node);
        this.switches = switches.map((name) => this.get(`input[name="${name}"]`));

        root.addEventListener('input', (event) => {
            if (!event.isComposing) this.schedule();
        });
        root.addEventListener('compositionend', () => this.schedule());
        root.addEventListener('click', (event) => this.click(event));
        this.output.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.closeOutput();
        });
    }

    async start() {
        const id = new URLSearchParams(location.search).get('layout');
        const selected = layouts.find((layout) => layout.id === id) || layouts[0];
        try {
            this.font = await loadTitleFont(selected.id);
        } catch (error) {
            this.fontError(error);
            return;
        }
        this.report = createMissingGlyphReporter(this.font.version);
        const nav = this.get('.layout-list');
        for (const layout of layouts) {
            const link = element('a', 'item');
            link.href = `?layout=${encodeURIComponent(layout.id)}`;
            link.title = layout.title;
            link.dataset.layout = layout.id;
            link.append(element('span', null, layout.title));
            this.navigation.set(layout.id, link);
            nav.append(link);
        }
        this.selectLayout(selected);
        this.get('.content-box').hidden = false;
    }

    selectLayout(layout) {
        this.navigation.get(this.layout?.id)?.removeAttribute('data-checked');
        this.layout = layout;
        this.navigation.get(layout.id).dataset.checked = 'true';
        document.title = `${layout.title} - ${this.title}`;
        const config = { ...defaults, ...layout.config };
        this.plan.controls[plans.findIndex(([value]) => value === config.plan)].checked = true;
        this.ratio.controls[ratios.findIndex(([value]) => value === config.outputRatio)].checked =
            true;
        this.switches.forEach((input) => {
            input.checked = Boolean(config[input.name]);
        });

        const fields = this.get('[data-fields]');
        const examples = this.get('.exemple-list');
        fields.replaceChildren();
        examples.replaceChildren();
        this.fields = layout.inputs.map((option, index) => {
            const row = element('div', 'input-item');
            fields.append(row);
            if (option.type === 'tab') {
                const group = radioGroup(
                    `field-${index}`,
                    option.options.map(({ value, text }) => [value, text]),
                    option.name,
                );
                group.controls[0].checked = true;
                row.append(element('h4', null, option.name), group.node);
                return group.controls;
            }
            const input = element('input');
            input.type = 'text';
            input.placeholder = option.placeholder;
            input.setAttribute('aria-label', option.placeholder);
            if (option.minLength !== undefined) input.minLength = option.minLength;
            if (option.maxLength !== undefined) input.maxLength = option.maxLength;
            row.append(input);
            return input;
        });
        this.examples = [
            layout.inputs.map((option) => option.placeholder),
            ...(layout.exemples ?? []),
        ].map((texts, index) => {
            const button = element('button', 'exemple-item');
            button.type = 'button';
            button.dataset.example = index;
            button.append(
                ...texts
                    .filter((text) => text !== undefined)
                    .map((text) => element('span', null, text)),
            );
            examples.append(button);
            return button;
        });
        this.schedule();
    }

    inputValues() {
        return this.layout.inputs.map((option, index) => {
            const field = this.fields[index];
            return option.type === 'tab'
                ? option.options[field.findIndex((input) => input.checked)].value
                : field.value;
        });
    }

    click(event) {
        const link = event.target.closest('[data-layout]');
        if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            history.replaceState(null, '', link.href);
            this.selectLayout(layouts.find((layout) => layout.id === link.dataset.layout));
        }
        const example = event.target.closest('[data-example]');
        if (example) {
            const index = Number(example.dataset.example);
            const texts = this.layout.exemples?.[index - 1] ?? [];
            this.fields.forEach((field, i) => {
                if (index && i >= texts.length) return;
                if (Array.isArray(field)) {
                    field[
                        this.layout.inputs[i].options.findIndex(
                            (option) => option.value === (texts[i] ?? 0),
                        )
                    ].checked = true;
                } else {
                    field.value = texts[i] ?? '';
                }
            });
            this.schedule();
        }
        switch (event.target.closest('[data-action]')?.dataset.action) {
            case 'render':
                this.schedule();
                break;
            case 'save':
                this.save();
                break;
            case 'close':
                this.closeOutput();
                break;
        }
    }

    schedule() {
        if (!this.font) return;
        const revision = ++this.revision;
        const values = this.inputValues();
        const example =
            this.layout.exemples?.findIndex((item) => values.join(',') === item.join(',')) ?? -1;
        const empty = values.every((value) => typeof value !== 'string' || !value);
        const checked = empty ? 0 : example < 0 ? -1 : example + 1;
        this.examples.forEach((button, index) => {
            const selected = index === checked;
            if (selected && !button.hasAttribute('data-checked')) button.dataset.checked = 'true';
            if (!selected && button.hasAttribute('data-checked')) delete button.dataset.checked;
        });
        this.setLoading(true);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.render(values, revision), 200);
    }

    setLoading(loading) {
        const value = String(loading);
        if (this.root.dataset.loading !== value) this.root.dataset.loading = value;
        const ready = !loading && this.canvas.dataset.ready === 'true';
        if (this.saveButton.disabled !== !ready) {
            this.saveButton.disabled = !ready;
            if (ready) this.saveButton.dataset.current = 'true';
            else delete this.saveButton.dataset.current;
        }
    }

    fontError(error) {
        console.error(error);
        this.get('[role="alert"]').hidden = false;
        this.canvas.removeAttribute('data-ready');
        this.setLoading(false);
    }

    async render(values, revision) {
        const layout = this.layout;
        const texts = values.map((value, index) =>
            value === '' ? layout.inputs[index].placeholder : value,
        );

        const config = { ...defaults, ...layout.config };
        const planIndex = this.plan.controls.findIndex((input) => input.checked);
        const ratioIndex = this.ratio.controls.findIndex((input) => input.checked);
        config.plan = plans[planIndex][0];
        config.outputRatio = ratios[ratioIndex][0];

        for (const input of this.switches) {
            config[input.name] = input.checked;
        }

        try {
            const titleTexts = texts.filter((text) => typeof text === 'string');
            await this.font.outline?.ensure([...titleTexts, '、']);
            if (revision !== this.revision) {
                return;
            }

            const missing = make({
                outputCanvas: this.canvas,
                canvas: this.workCanvas,
                texts,
                config,
                layout,
                font: this.font,
            });
            this.report(missing);
            this.showMissingGlyphs(missing);

            const alert = this.get('[role="alert"]');
            if (!alert.hidden) {
                alert.hidden = true;
            }
            if (this.canvas.dataset.ready !== 'true') {
                this.canvas.dataset.ready = 'true';
            }
            this.setLoading(false);

            if (!this.thumbnailsStarted) {
                this.thumbnailsStarted = true;
                const renderThumbnails = () => this.thumbnails().catch(console.error);
                requestAnimationFrame(() => setTimeout(renderThumbnails));
            }
        } catch (error) {
            if (revision === this.revision) {
                this.fontError(error);
            }
        }
    }

    showMissingGlyphs(characters) {
        const warning = this.get('[role="status"]');
        const list = this.get('[data-missing]');
        const labels = characters.map((character) => {
            const codepoint = character.codePointAt(0);
            const hex = codepoint.toString(16).toUpperCase().padStart(4, '0');
            return `${character} U+${hex}`;
        });

        const text = labels.join('，');
        if (list.textContent !== text) {
            list.textContent = text;
        }

        const hidden = characters.length === 0;
        if (warning.hidden !== hidden) {
            warning.hidden = hidden;
        }
    }

    async thumbnails() {
        const presetTexts = layouts.map((layout) =>
            layout.inputs.map((input) => (input.type === 'tab' ? 0 : input.placeholder)),
        );
        await this.font.outline?.preload('templates');
        const canvas = createCanvas();
        try {
            layouts.forEach((layout, index) => {
                const config = {
                    ...defaults,
                    blur: 1,
                    ...layout.config,
                    height: 240,
                    noise: false,
                };
                make({
                    outputCanvas: canvas,
                    canvas: this.workCanvas,
                    texts: presetTexts[index],
                    config,
                    layout,
                    font: this.font,
                });
                const image = element('img');
                image.alt = layout.title;
                image.src = makeBMPFormCanvas(canvas);
                this.navigation.get(layout.id).firstElementChild.replaceWith(image);
            });
        } finally {
            removeCanvas(canvas);
        }
    }

    save() {
        if (this.saveButton.disabled) return;
        const src = this.canvas.toDataURL('image/jpeg', 0.95);
        const name = `[lab.magiconch.com][福音戰士標題生成器]-${Date.now()}.jpg`;
        const image = this.output.querySelector('img');
        const link = this.output.querySelector('[download]');
        image.src = link.href = src;
        image.alt = link.download = name;
        this.output.hidden = false;
        document.documentElement.dataset.output = 'true';
        this.output.querySelector('[data-action="close"]').focus();
    }

    closeOutput() {
        this.output.hidden = true;
        delete document.documentElement.dataset.output;
        this.saveButton.focus();
    }
}

new TitleEditor(document.querySelector('.app')).start();
