declare module "*.css" {
    const stylesheet: CSSStyleSheet;
    export default stylesheet;
}

declare module "*.css?inline" {
    const stylesheetRaw: string;
    export default stylesheetRaw;
}
