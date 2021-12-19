
import { createApp } from 'vue'
import { deepStylesOf } from '@/util'
import coms from '+/'
import message from '+/message'

export const createVueApp = (com, props) => {
    const app = createApp(com, { ...props })
    // 全局注册组件 
    let styles = deepStylesOf(com)
    coms.forEach(item => {
        styles.push(...deepStylesOf(item))
        app.component(item.name, item)
    })
    styles = [...new Set(styles)].join('')
    app.config.globalProperties.$message = message
    return {
        app,
        styles
    }
}
