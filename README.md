# prism-code-editor-csp-problem #

This tiny app demonstrates how `prism-code-editor` is not compatible with 
`Content-Security-Policy` header directive/value `style-src-attr: 'none'` 
due to the usage of a few inline style attributes in the code editor's 
generated DOM tree.

## How to run the app ##
1. `npm ci`
2. `npm start`
3. open http://localhost:8082 in a browser
4. notice the `Content-Security-Policy` response header value used (see `content-security-policy.ts`)
5. pay attention to the errors in the console caused by the header
