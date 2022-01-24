
export default {
    name: 'MEmpty',
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
            <div class="m-empty p-20">
                <MIcon name="empty" width={this.width}></MIcon>
                <p class="m-empty-description">{this.description}</p>
            </div >
        )
    },
}