import { h } from 'vue'
import { createVueApp } from '../app'
import App from './admin.vue'

export default {
    props: {
        env: {
            type: String,
            required: true
        }
    },
    render () {
        return [
            h('style', { ref: 'style' }),
            h('svg', {
                ref: 'svg',
                xmlns: 'http://www.w3.org/2000/svg',
                'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                style: 'position: absolute;height: 0;width: 0;overflow: hidden;'
            }),
            h('div', { ref: 'app' })
        ]
    },
    mounted () {
        const { hash, title, env } = this
        const { app, styles, icons } = createVueApp(App, { hash, title, env })
        this.$refs.style.innerHTML = styles
        this.$refs.svg.innerHTML = icons.join('')
        app.mount(this.$refs.app)
    }
}