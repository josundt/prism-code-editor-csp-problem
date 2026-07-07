# prism-code-editor-csp-problem #

This tiny app demonstrates how `prism-code-editor` is not compatible with 
`Content-Security-Policy` header directive/value `style-src-attr: 'none'` 
due to the usage of a few inline style attributes in the code editor's 
generated DOM tree.
