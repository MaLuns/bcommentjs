export default {
    name: 'm-icon',
    props: {
        name: String,
        width: {
            type: String,
            default: '32'
        },
        height: {
            type: String
        }
    },
    render () {
        return (
            <svg class="m-icon" aria-hidden="true" width={this.width} height={this.height || this.width}>
                <use xlink:href={'#' + this.name}></use>
            </svg >
        )
    }
}