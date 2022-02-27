<template>
    <div class="pointer inline">
        <div v-if="!$store.user" @click="showLoginPanel = true;">
            <slot name="unlogin">
                <MIcon name="login" />
            </slot>
        </div>
        <template v-else>
            <MDropdown :menu="menu" @item-click="handleNavClick" right>
                <slot name="logined">
                    <MIcon name="logined" />
                </slot>
            </MDropdown>
        </template>
    </div>
    <MLogin v-if="showLoginPanel" v-model:show="showLoginPanel" />
    <transition name="opacity">
        <AdminLayoutView v-if="showAdminPanel" v-model="showAdminPanel" />
    </transition>
</template>

<script>
import tcb from '@/tcb'
import { getScrollWidth, hasScrollbar } from '@/util'
import AdminLayoutView from './layout.vue'

export default {
    name: 'AdminView',
    components: { AdminLayoutView },
    props: {
        env: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            config: {},
            showLoginPanel: false,// 登录面板
            showAdminPanel: false,// 管理面板
        }
    },
    computed: {
        menu () {
            if (this.$store.config.is_admin) {
                return [
                    { label: '评论管理', value: 'mange' },
                    { label: '退出', value: 'out' }
                ]
            } else {
                return [
                    { label: '退出', value: 'out' }
                ]
            }
        }
    },
    watch: {
        showAdminPanel: function (val) {
            if (val) {
                if (hasScrollbar()) {
                    document.body.style.width = `calc(100% - ${getScrollWidth()}px)`;
                    document.body.style.overflow = 'hidden';
                }
            } else {
                if (hasScrollbar()) {
                    document.body.style.width = '';
                    document.body.style.overflow = '';
                }
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            tcb.initApp({ env: this.env }).then(() => {
                const setUser = (user) => {
                    if (user && user.loginType === 'EMAIL') {
                        this.$store.user = user;
                    }
                }
                setUser(tcb.cloudbase.auth.currentUser)
                this.$store.mutations.refreshConfig()

                tcb.cloudbase.auth.onLoginStateChanged((loginState) => {
                    if (loginState) {
                        setUser(loginState.user)
                        this.$store.mutations.refreshConfig()
                    }
                });
            })
        },
        handleShowAdminPanel () {
            if (this.$store.config.is_admin) {
                this.showAdminPanel = true
            }
        },
        handleNavClick ({ value }) {
            switch (value) {
                case 'out':
                    tcb.signOut().then(() => {
                        this.$store.user = null
                    });
                    break;
                case 'mange':
                    this.handleShowAdminPanel()
                    break;
            }
        }
    }
}
</script>
