import { h } from 'vue'
import { createVueApp } from '../app'
import App from './comment.vue'

export default {
    props: {
        hash: String,
        title: String,
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
        const { app, styles } = createVueApp(App, { hash, title, env })// 注入样式
        this.$refs.style.innerHTML = styles
        app.mount(this.$refs.app)
    },
    exportMethods: {
        // 添加自定义表情
        addEmojis (emoji) {
            console.log(emojis);
        }
    }
}

