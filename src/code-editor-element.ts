import { createEditor, type PrismEditor } from "prism-code-editor";
import layoutStylesRaw from "prism-code-editor/layout.css?inline";
import "prism-code-editor/prism/languages/markup";
import { type SetupOptions } from "prism-code-editor/setups";
import defaultThemeStylesRaw from "prism-code-editor/themes/vs-code-light.css?inline";

type CamelToKebab<S extends string> = S extends `${infer Head}${infer Tail}`
    ? Tail extends Uncapitalize<Tail>
        ? `${Uncapitalize<Head>}${CamelToKebab<Tail>}`
        : `${Uncapitalize<Head>}-${CamelToKebab<Tail>}`
    : S;

export class CodeEditorElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        CodeEditorElement.#addCssStyleSheetsFromRaw(
            this.shadowRoot,
            layoutStylesRaw,
            defaultThemeStylesRaw,
        );
    }

    static readonly tagName = "code-editor";
    static #customAttributes: Partial<
        Record<
            CamelToKebab<keyof SetupOptions>,
            "string" | "boolean" | "number"
        >
    > = {
        value: "string",
        theme: "string",
        language: "string",
        "tab-size": "number",
        "read-only": "boolean",
        "line-numbers": "boolean",
        "word-wrap": "boolean",
    };
    static observedAttributes: ReadonlyArray<CamelToKebab<keyof SetupOptions>> =
        Object.keys(CodeEditorElement.#customAttributes) as ReadonlyArray<
            CamelToKebab<keyof SetupOptions>
        >;

    static register(): void {
        if (!customElements.get(this.tagName)) {
            customElements.define(this.tagName, CodeEditorElement);
        }
    }

    static #addCssStyleSheetsFromRaw(
        shadowRoot: ShadowRoot | null,
        layoutStyleSheet: string,
        themeStyleSheet: string,
    ): void {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`${layoutStyleSheet}\n${themeStyleSheet}`);
        shadowRoot?.adoptedStyleSheets.push(sheet);
    }

    #editor?: PrismEditor<{}>;

    connectedCallback() {
        const options: SetupOptions = {
            theme: this.theme ?? "vs-code-light",
            ...(this.language ? { language: this.language } : {}),
            readOnly: this.readOnly,
            lineNumbers: this.lineNumbers,
            wordWrap: this.wordWrap,
            tabSize: this.tabSize,
            insertSpaces: true,
            ...(this.value ? { value: this.value } : {}),
        };

        this.#editor = createEditor(this, options, () =>
            console.log("Editor is ready"),
        );
        this.shadowRoot?.append(this.#editor.container);
        this.#editor.setOptions(options);
        this.#editor.on("update", (value) => {
            // Update attribute value each time the editor content changes
            this.value = value;
        });
    }

    disconnectedCallback() {
        this.value = null;
        this.#editor?.remove();
    }

    attributeChangedCallback(
        name: CamelToKebab<keyof SetupOptions>,
        oldValue: string | null,
        newValue: string | null,
    ) {
        var parsed = this.#parseAttributeValue(name, newValue);

        this.#editor?.setOptions({
            [this.#kebabToCamel(name)]: parsed,
        });
    }

    get value(): string | null {
        return this.getAttribute("value");
    }
    set value(val: string | null) {
        this.#updateAttributeValue("value", val);
    }

    get language(): string | null {
        return this.getAttribute("language");
    }
    set language(val: string | null) {
        this.#updateAttributeValue("language", val);
    }

    get theme(): string | null {
        return this.getAttribute("theme");
    }
    set theme(val: string | null) {
        this.#updateAttributeValue("theme", val);
    }

    get readOnly(): boolean {
        const val = this.#parseAttributeValue<"readOnly">(
            "read-only",
            this.getAttribute("read-only"),
        );
        return val === null || val === undefined ? false : val;
    }
    set readOnly(val: boolean) {
        this.#updateAttributeValue("read-only", val);
    }

    get wordWrap(): boolean {
        const val = this.#parseAttributeValue<"wordWrap">(
            "word-wrap",
            this.getAttribute("word-wrap"),
        );
        return val === null || val === undefined ? false : val;
    }
    set wordWrap(val: boolean) {
        this.#updateAttributeValue("word-wrap", val);
    }

    get lineNumbers(): boolean {
        const val = this.#parseAttributeValue<"lineNumbers">(
            "line-numbers",
            this.getAttribute("line-numbers"),
        );
        return val === null || val === undefined ? false : val;
    }
    set lineNumbers(val: boolean) {
        this.#updateAttributeValue("line-numbers", val);
    }

    get tabSize(): number {
        const val = this.#parseAttributeValue<"tabSize">(
            "tab-size",
            this.getAttribute("tab-size"),
        );
        return val === null || val === undefined ? 2 : val;
    }
    set tabSize(val: number) {
        this.#updateAttributeValue("tab-size", val);
    }

    #updateAttributeValue<TKey extends keyof SetupOptions>(
        name: CamelToKebab<TKey>,
        value: SetupOptions[TKey] | null,
    ): void {
        if (value === null || value === undefined) {
            this.removeAttribute(name);
        } else if (
            typeof value === "string" ||
            typeof value === "boolean" ||
            typeof value === "number"
        ) {
            const val = this.#stringifyAttributeValue(name, value);
            if (val === null) {
                this.removeAttribute(name);
            } else {
                this.setAttribute(name, val);
            }
        }
    }

    #parseAttributeValue<TKey extends keyof SetupOptions>(
        name: CamelToKebab<TKey>,
        value: string | null,
    ): SetupOptions[TKey] | null {
        const type = CodeEditorElement.#customAttributes[name];
        switch (type) {
            case "string": {
                return value as SetupOptions[TKey];
            }
            case "boolean": {
                return (value !== null &&
                    value !== undefined &&
                    (value.trim() === "" ||
                        value.toLowerCase() === "true" ||
                        value.toLowerCase() ===
                            name.toLowerCase())) as SetupOptions[TKey];
            }
            case "number": {
                const r = Number(value);
                return isNaN(r) ? null : (r as SetupOptions[TKey]);
            }
            default:
                return null;
        }
    }

    #stringifyAttributeValue(
        name: CamelToKebab<keyof SetupOptions>,
        value: string | boolean | number | null,
    ): string | null {
        return value === null || value === undefined ? null : String(value);
    }

    #kebabToCamel(str: string): string {
        return str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
    }
}
