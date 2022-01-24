
export default {
    name: 'MButton',
    emits: ['click'],
    props: {
        disabled: Boolean,
        long: Boolean,
        type: {
            type: String,
            default: 'default',
            validator (value) {
                return ['default', 'primary', 'error', 'text'].includes(value)
            }
        },
    },
    methods: {
        handleClick () {
            if (!this.disabled)
                this.$emit('click')
        }
    },
    render () {
        let className = {
            [this.type]: this.type, long: this.long
        }
        return (
            <button type="button" class="m-button" class={className} disabled={this.disabled} onClick={this.handleClick} >
                {this.$slots.default?.()}
            </button >
        )
    },
}
