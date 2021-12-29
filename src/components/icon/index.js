export default {
    name: 'm-icon',
    props: {
        name: String
    },
    render () {
        return (
            <svg class="m-icon">
                <use xlink:href={'#' + this.name}></use>
            </svg >
        )
    }
}