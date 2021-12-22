export default {
    name: "m-skeleton-item",
    props: {
        type: {
            type: String,
            default: 'text'
        }
    },
    render () {
        return (<div class="m-skeleton-item" class={this.type}></div>)
    },
}
