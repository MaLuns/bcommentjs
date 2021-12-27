export default {
    name: 'm-dropdown',
    emits: ['item-click'],
    props: {
        menu: Array
    },
    methods: {
        handleMenuItem (item) {
            this.$emit('item-click', item)
        }
    },
    render () {
        return (
            <div class="m-dropdown">
                {this.$slots.default?.()}
                <ul class="m-dropdown-menu">{
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