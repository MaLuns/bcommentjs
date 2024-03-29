export default {
    name: 'MDropdown',
    emits: ['item-click'],
    props: {
        right: Boolean,
        menu: Array
    },
    methods: {
        handleMenuItem (item) {
            this.$emit('item-click', item)
        }
    },
    render () {
        this.$nextTick(() => {
            if (window.innerWidth - this.$el.lastElementChild.offsetWidth - 20 < this.$el.offsetLeft) {
                this.right = true
            }
        })
        return (
            <div class="m-dropdown">
                {this.$slots.default?.()}
                <ul class={'m-dropdown-menu ' + (this.right ? 'tip-right' : '')}>{
                    this.$slots.items ?
                        this.$slots.items() :
                        this.menu.map((item, key) => {
                            return <li class="m-dropdown-menu-item" key={key} onClick={() => this.handleMenuItem(item)}>{item.label}</li>
                        })
                }</ul >
            </div >
        )
    },
}