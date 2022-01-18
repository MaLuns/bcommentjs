<template>
    <div class="pointer">
        <template v-if="!$store.user">
            <m-icon @click="showLoginPanel = true;" name="login"></m-icon>
        </template>
        <template v-else>
            <m-dropdown :menu="menu" @item-click="handleNavClick">
                <m-icon name="logined"></m-icon>
            </m-dropdown>
        </template>
    </div>
    <m-login v-if="showLoginPanel" v-model:show="showLoginPanel"></m-login>
    <transition name="opacity">
        <m-manger v-if="showAdminPanel" v-model="showAdminPanel"></m-manger>
    </transition>
</template>

<script>
import tcb from '@/tcb'
import { getScrollWidth, hasScrollbar } from '@/util'
import mManger from './layout.vue'

export default {
    components: { mManger },
    props: {
        env: {
            type: String,
            required: true
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
    data () {
        return {
            config: {},
            showLoginPanel: false,// 登录面板
            showAdminPanel: true,// 管理面板
        }
    },
    watch: {
        showAdminPanel: function (val) {
            if (val) {
                if (hasScrollbar()) {
                    document.body.style.width = `calc(100% - ${getScrollWidth()}px)`;
                    document.body.style.overflow = "hidden";
                }
            } else {
                if (hasScrollbar()) {
                    document.body.style.width = "";
                    document.body.style.overflow = "";
                }
            }
        }
    },
    methods: {
        init () {
            tcb.initApp({ env: this.env }).then(_ => {
                const setUser = (user) => {
                    if (user && user.loginType === "EMAIL") {
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
                    tcb.signOut().then(_ => {
                        this.$store.user = null
                    });
                    break;
                case 'mange':
                    this.handleShowAdminPanel()
                    break;
            }
        }
    },
    created () {
        this.init()
    }
}
</script>
<style lang="less">
@import url("../../styles/index.less");
.admin-container {
    color: @ui-text;
    background-color: @ui-bg;
}
</style>

