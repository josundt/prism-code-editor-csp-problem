import "prism-code-editor/prism/languages/markup";
import { CodeEditorElement } from "./code-editor-element";

// Register code editor custom element
CodeEditorElement.register();

// Listen for CSP violations and log style-src-attr directives to the console
document.addEventListener("securitypolicyviolation", (e) => {
    if (e.violatedDirective === "style-src-attr") {
        console.warn(
            `CSP 'style-src-attr' violation detected, style attribute value: '${e.sample}${e.sample.length >= 40 ? "..." : ""}'`,
            e,
        );
    }
});

// Get the code editor custom element instance from the document
const element = document.querySelector<CodeEditorElement>(
    CodeEditorElement.tagName,
)!;

// Set the value of the code editor to the current document content (index.html)
element.value = document.documentElement.outerHTML;
