<template>
    <m-modle v-model="shows" :title="info.title" :width="400">
        <m-form ref="form" :model="form" :rules="rules" labelWidth="4.5em" :key="type">
            <m-form-item prop="email" label="邮箱">
                <input v-model.trim="form.email" type="text" placeholder="请输入邮箱" autocomplete="off" />
            </m-form-item>
            <m-form-item prop="password" label="密码" v-if="['login', 'reg'].includes(type)">
                <input v-model.trim="form.password" type="password" placeholder="请输入密码" autocomplete="off" />
            </m-form-item>
            <m-form-item prop="password2" label="确认密码" v-if="type === 'reg'">
                <input v-model.trim="form.password2" type="password" placeholder="请输入确认密码" autocomplete="off" />
            </m-form-item>
            <m-form-item class="right">
                <div class="link" @click="type = 'login';" v-if="['reg', 'reset'].includes(type)">去登录</div>
                <div class="link" @click="type = 'reg';" v-if="['login', 'reset'].includes(type)">注册账号</div>
                <div class="link" @click="type = 'reset';" v-if="['login', 'reg'].includes(type)">重置密码</div>
            </m-form-item>
            <m-button long @click="submit" :type="info.btntype">{{ info.btn }}</m-button>
        </m-form>
    </m-modle>
</template>

<script>
import { regexp } from "@/util";
import tcb from '@/tcb'
import message from '+/message'
import mForm from "+/form/form.vue";
import mFormItem from "+/form/formItem.vue";
import mModle from "+/model/index.vue";
import mButton from "+/button/index.vue"

export default {
    emits: ['login', 'update:show'],
    components: {
        mModle,
        mForm,
        mFormItem,
        mButton
    },
    computed: {
        info () {
            let _info = new Map([
                ['login', {
                    fun: 'login',
                    title: '邮箱登录',
                    btn: '登录',
                    msg: '登录成功',
                    btntype: 'primary',
                }],
                ['reg', {
                    fun: 'regster',
                    title: '账户注册',
                    btn: '注册',
                    msg: '注册邮件已发送，请前往邮箱激活',
                    btntype: 'primary',
                }],
                ['reset', {
                    fun: 'reset',
                    title: '重置密码',
                    btn: '重置',
                    msg: '重置邮件已发送，请前往邮箱重置',
                    btntype: 'error',
                }],
            ]);
            return _info.get(this.type)
        },
        shows: {
            get () {
                return this.show
            },
            set (val) {
                this.$emit("update:show", val)
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            type: 'login',
            form: {
                email: '',
                password: '',
                password2: ''
            },
            rules: {
                email: (val) => {
                    if (!regexp.email.test(val)) {
                        throw new Error('请填写正确邮箱')
                    }
                },
                password: (val) => {
                    if (!regexp.pass.test(val)) {
                        throw new Error('至少包含数字和字母组成，长度8-32位')
                    }
                },
                password2: (val) => {
                    if (val !== this.form.password) {
                        throw new Error('两次输入密码不一致')
                    }
                }
            }
        }
    },
    methods: {
        submit () {
            if (this.$refs.form.validate()) {
                let { email, password } = this.form
                tcb[this.info.fun](email, password).then(res => {
                    if (res) {
                        message.info(this.info.msg)
                        this.shows = false
                        if (this.type === 'login') {
                            this.$emit("login", res)
                        }
                    }
                })
            }
        },
    },
}
</script>
<style lang="less" scoped>
.pointer {
    cursor: pointer;
}

.right {
    text-align: right;
}
</style>

