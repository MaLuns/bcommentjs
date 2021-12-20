import { reactive } from 'vue'
import { debounce } from '@/util'
import tcb from '@/tcb';

// 全局状态管理
const store = {
    state: {
        // 用户
        user: reactive({
            data: null
        }),
        // 配置
        config: reactive({
            data: {
                is_admin: false,
                form: {}
            }
        }),
        // 回复
        reply: reactive({
            data: null
        }),
    },
    get user () {
        return this.state.user.data
    },
    set user (newVal) {
        this.state.user.data = newVal
    },
    get config () {
        return this.state.config.data
    },
    refreshConfig: debounce(async () => {
        let config = await tcb.callFunction('getConfig')
        store.state.config.data = config || { form: { nick: true, email: true } }
    }),
    get reply () {
        return this.state.reply.data
    },
    set reply (newVal) {
        this.state.reply.data = newVal
    }
}
export default store