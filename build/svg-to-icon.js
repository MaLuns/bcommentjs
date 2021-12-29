module.exports = function runtimeGenerator ({ symbol, config, context, loaderContext }) {
    return `export default {
        content: \`${symbol.render()}\`
    }`
};