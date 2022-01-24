module.exports = function runtimeGenerator ({ symbol }) {
    return `export default {
        content: \`${symbol.render()}\`
    }`
};