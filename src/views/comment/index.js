
import { createApp, h } from 'vue'
import { deepStylesOf, a } from '@/util'
import App from './index.vue'
import avatar from '+/avatar'
import button from '+/button'
import comment from '+/comment'
import editor from '+/editor'
import form from '+/form/form'
import formItem from '+/form/formItem'
import loading from '+/loading'
import login from '+/login'
import model from '+/model'
import audit from "+/audit";

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
            h('div', { ref: 'comment' })
        ]
    },
    mounted () {
        const { hash, title, env } = this
        const app = createApp(App, { hash, title, env })
        // 全局注册组件 
        const com = [avatar, button, editor, form, formItem, loading, login, model, audit, comment]
        let styles = deepStylesOf(App)
        com.forEach(item => {
            styles.push(...deepStylesOf(item))
            app.component(item.name, item)
        })
        styles = [...new Set(styles)]
        this.$refs.style.innerHTML = styles.join('')// 注入样式
        app.mount(this.$refs.comment)
    },
    exportMethods: {
        // 添加自定义表情
        addEmojis (emoji) {
            console.log(emojis);
        }
    }
}