
export default {
    name: 'm-empty',
    props: {
        description: {
            type: String,
            default: '这里什么也没有'
        },
        width: {
            type: String,
            default: '200'
        }
    },
    render () {
        return (
            <div class="m-empty">
                <m-icon name="empty" width={this.width}></m-icon>
                <p class="m-empty-description">{this.description}</p>
            </div >
        )
    },
}