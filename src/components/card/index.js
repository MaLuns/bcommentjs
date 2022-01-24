export default {
    name: 'MCard',
    props: {
        title: String
    },
    render () {
        return (
            <div class="m-card">
                <div class="m-card-header">{this.title}</div>
                <div class="m-card-body">
                    {this.$slots.default?.()}
                </div>
            </div>
        )
    },
}