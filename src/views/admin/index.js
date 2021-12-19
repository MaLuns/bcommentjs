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
            h('div', { ref: 'app' })
        ]
    },
    mounted () {
        const { hash, title, env } = this
        const { app, styles } = createVueApp(App, { hash, title, env })
        this.$refs.style.innerHTML = styles
        app.mount(this.$refs.app)
    }
}