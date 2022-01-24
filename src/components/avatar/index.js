let avatar = (props) => props.src ?
    <img class="m-avatar" class={props.shape} src={props.src} draggable="false" alt="avatar" /> :
    null

avatar.prototype.name = 'MAvatar'
avatar.props = {
    src: String,
    shape: {
        type: String,
        default: 'circle',
        validator (value) {
            return ['circle', 'square'].includes(value)
        }
    }
}
export default avatar