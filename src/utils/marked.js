import { marked } from 'marked';
import hljs from 'highlight.js/lib/common';

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
        if (hljs) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        } else {
            return code
        }
    },
    langPrefix: 'hljs language-',
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true
});

export default marked