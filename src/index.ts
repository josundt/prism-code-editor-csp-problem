import "prism-code-editor/prism/languages/markup";
import { basicEditor } from "prism-code-editor/setups";

document.addEventListener("securitypolicyviolation", (e) => {
    if (e.violatedDirective === "style-src-attr") {
        console.warn(
            `CSP 'style-src-attr' violation detected, style attribute value: ${e.sample}:`,
            e,
        );
    }
});

const container = document.querySelector<HTMLDivElement>("#editor")!;
container.attachShadow({ mode: "open" });

basicEditor(
    container,
    {
        theme: "vs-code-light",
        language: "html",
        readOnly: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: false,
        lineNumbers: false,
        value: `
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>title</title>
        <script type="module" src="./index.ts" defer></script>
    </head>
    <body>
        <div id="#editor"></div>
    </body>
</html>
`.trim(),
    },
    () => console.log("Editor is ready"),
);
