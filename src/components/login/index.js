import { regexp } from "@/util";
import tcb from '@/tcb'

export default {
    name: 'm-login',
    emits: ['login', 'update:show'],
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
                        this.$message.info(this.info.msg)
                        this.shows = false
                        if (this.type === 'login') {
                            this.$emit("login", res)
                        }
                    }
                })
            }
        },
    },
    render () {
        return (
            <m-model v-model={this.shows} title={this.info.title} width={400}>
                <m-form ref="form" model={this.form} rules={this.rules} labelWidth="4.5em" key={this.type}>
                    <m-form-item prop="email" label="邮箱">
                        <input v-model={this.form.email} type="text" placeholder="请输入邮箱" autocomplete="off" />
                    </m-form-item>
                    {
                        ['login', 'reg'].includes(this.type) ?
                            <m-form-item prop="password" label="密码" >
                                <input v-model={this.form.password} type="password" placeholder="请输入密码" autocomplete="off" />
                            </m-form-item>
                            : null
                    }
                    {
                        this.type === 'reg' ?
                            <m-form-item prop="password2" label="确认密码">
                                <input v-model={this.form.password2} type="password" placeholder="请输入确认密码" autocomplete="off" />
                            </m-form-item>
                            : null
                    }
                    <m-form-item class="right">
                        {['reg', 'reset'].includes(this.type) ? <div class="link" onClick={() => this.type = 'login'} >去登录</div> : null}
                        {['login', 'reset'].includes(this.type) ? <div class="link" onClick={() => this.type = 'reg'} >注册账号</div> : null}
                        {['login', 'reg'].includes(this.type) ? <div class="link" onClick={() => this.type = 'reset'} >重置密码</div> : null}
                    </m-form-item>
                    <m-button long onClick={this.submit} type={this.info.btntype}>{this.info.btn}</m-button>
                </m-form>
            </m-model>
        )
    }
}