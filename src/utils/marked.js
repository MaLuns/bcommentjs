import { marked } from 'marked';
const hanabi = require('hanabi');

marked.setOptions({
    highlight: hanabi,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true
});

export default marked