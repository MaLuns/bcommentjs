import { h } from 'vue'
import tcb from '@/tcb'

export default {
    render () {
        return h('span', {}, this.count)
    },
    data () {
        return {
            count: 0
        }
    },
    props: {
        noStatistical: Boolean,
        hash: String,
        env: {
            type: String,
            required: true
        }
    },
    computed: {
        pageHash () {
            return this.hash ? this.hash : location.pathname
        },
    },
    async created () {
        await tcb.initApp({ env: this.env })
        if (this.pageHash) {
            tcb.getBatchPV(this.pageHash, (data = 0) => this.count = data)
        } else {
            this.count = await tcb.callFunction('getUV')
        }

        if (!this.noStatistical) {
            let { pathname, origin } = window.location
            tcb.callFunction('addPVUV', {
                hash: this.pageHash,
                url: origin + pathname,
                title: document.title
            })
        }
    }
}