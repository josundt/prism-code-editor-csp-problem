import "prism-code-editor/prism/languages/markup";
import { basicEditor, type SetupOptions } from "prism-code-editor/setups";

type CamelToKebab<S extends string> = S extends `${infer Head}${infer Tail}`
    ? Tail extends Uncapitalize<Tail>
        ? `${Uncapitalize<Head>}${CamelToKebab<Tail>}`
        : `${Uncapitalize<Head>}-${CamelToKebab<Tail>}`
    : S;

export class CodeEditorElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
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

    #editor?: ReturnType<typeof basicEditor>;

    connectedCallback() {
        this.#editor = basicEditor(
            this,
            {
                theme: "vs-code-light",
                language: "html",
                readOnly: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: false,
                lineNumbers: false,
                //                value: indexContent,
            },
            () => console.log("Editor is ready"),
        );
    }

    disconnectedCallback() {
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
                return (!value ||
                    value.toLowerCase() === "true") as SetupOptions[TKey];
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
