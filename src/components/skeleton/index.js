export default {
    name: 'm-skeleton',
    props: {
        animated: {
            type: Boolean,
            default: false
        },
        count: {
            type: Number,
            default: 1
        },
        loading: {
            type: Boolean,
            default: true
        },
        // 防抖时间
        throttle: {
            type: Number,
            default: 300
        }
    },
    data () {
        return {
            isLoad: this.loading
        }
    },
    watch: {
        loading (val) {
            if (val) {
                if (this._settime) {
                    clearTimeout(this._settime)
                    this._settime = null
                }
            } else {
                this._settime = setTimeout(() => {
                    this.isLoad = false
                }, this.throttle);
            }
        }
    },
    render () {
        let slot;
        if (this.isLoad) {
            let slots = []
            for (let index = 0; index < this.count; index++) {
                slots.push(this.$slots.template?.())
            }
            slot = slots
        } else {
            slot = this.$slots.default?.()
        }
        return <div class="m-skeleton">{slot}</div>
    }
}