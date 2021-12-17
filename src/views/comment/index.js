
import { createApp, h } from 'vue'
import { deepStylesOf } from '@/util'
import App from './comment.vue'
import coms from '+/'

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
        const app = createApp(App, { hash, title, env })
        // 全局注册组件 
        let styles = deepStylesOf(App)
        coms.forEach(item => {
            styles.push(...deepStylesOf(item))
            app.component(item.name, item)
        })
        styles = [...new Set(styles)]
        this.$refs.style.innerHTML = styles.join('')// 注入样式
        app.mount(this.$refs.app)
    },
    exportMethods: {
        // 添加自定义表情
        addEmojis (emoji) {
            console.log(emojis);
        }
    }
}