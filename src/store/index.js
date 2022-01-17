import { reactive } from 'vue'
import { debounce } from '@/util'
import emojis from '../assets/emojis.json';
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
        // 表情
        emojis: reactive({
            data: emojis
        })
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
    get emojis () {
        return this.state.emojis.data
    },
    mutations: {
        refreshConfig: debounce(async () => {
            let config = await tcb.callFunction('getConfig')
            store.state.config.data = config || { form: { nick: true, email: true } }
        }),
        addEmojis (key, val) {

        }
    },
}
export default store