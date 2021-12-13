<template>
    <div class="comment">
        <div class="comment-header">
            <slot name="comment-header"></slot>
        </div>
        <div class="comment-edit-container" v-show="!reply">
            <m-editor></m-editor>
        </div>
        <m-comment :list="list"></m-comment>
        <m-loading v-if="loading"></m-loading>
        <h2 v-if="!loaded && !loading" class="center link" @click="loadData">查看更多</h2>
    </div>
</template>

<script>
import { emojis } from "@/emojis";
import detect from "@/detect";
import tcb from '@/tcb';
import { mComment, mEditor, mLoading } from '+/'

export default {
    components: { mComment, mEditor, mLoading },
    computed: {
        pageHash () {
            if (this.hash === '') {
                return location.pathname
            }
            return this.hash
        }
    },
    props: {
        hash: String,
        env: {
            type: String,
            required: true
        }
    },
    provide () {
        return {
            app: {
                addComments: this.addComments,
                setReplyID: this.setReplyID,
            }
        }
    },
    data () {
        return {
            loading: true,
            loaded: true,
            reply: null,
            // 评论列表
            list: [],
            page: {
                pageIndex: 0,
                pageSize: 10
            },
            user: {
                email: '',
                nick: ''
            },
            // 全局配置
            config: {
                is_admin: false,
                form: {}
            }
        }
    },
    methods: {
        init () {
            tcb.initApp({ env: this.env }).then(_ => {
                const setUser = (user) => {
                    if (user && user.loginType === "EMAIL") {
                        let { email, nickName } = user
                        this.user.email = email
                        this.user.nick = nickName
                    }
                }
                setUser(tcb.cloudbase.auth.currentUser)
                tcb.cloudbase.auth.onLoginStateChanged((loginState) => {
                    setUser(loginState.user)
                    this.setConfig()
                });
                this.setConfig()
                this.loadData()
            })
        },
        // 获取配置
        async setConfig () {
            this.config = await tcb.callFunction('getConfig')
        },
        // 设置回复
        setReplyID (reply) {
            this.reply = reply
        },
        // 添加评论
        addComments (commet, callback) {
            let par = {
                ...commet,
                isPrivate: this.reply === null ? false : commet.isPrivate,
                type: this.reply === null ? 0 : 1,
                hash: this.pageHash,
                ua: this.detect
            }
            if (this.reply) {
                let { id, nick, link } = this.reply
                par.replyId = id
                par.at = {
                    nick,
                    link
                }
            }
            tcb.callFunction('addComments', par).then(res => {
                if (res) {
                    let com = { ...par, ...res }
                    if (par.type === 0) {
                        let index = this.list.findIndex(item => !item.top)
                        this.list.splice(index, 0, com)
                    } else {
                        let item = this.list.find(item => item === this.reply || (item.childer && item.childer.includes(this.reply)))
                        item.childer.push(com)
                        this.reply = null
                    }
                    callback()
                }
            })
        },
        // 加载更多评论
        loadData () {
            this.loading = true
            this.page.pageIndex++
            tcb.callFunction('getComments', {
                hash: this.pageHash,
                ...this.page
            }).then(data => {
                this.loading = false
                this.loaded = data.length !== this.page.pageSize
                this.list.push(...data)
            }).catch(_ => {
                this.loading = false
                --this.page.pageIndex
            })
        },
    },
    created () {
        this.detect = detect();
        this.init()
    },
    exportMethods: {
        // 添加自定义表情
        addEmojis (emoji) {
            console.log(emojis);
        }
    }
}
</script>

<style lang="less">
@import url('../../styles/index.less');
.comment {
    padding: 1em 1.5em;
    background-color: @ui-global-bg-normal;
}

@media screen and (max-width: 520px) {
    .comment-user-sys {
        display: none;
    }

    .comment-editor {
        .row {
            display: block;

            input {
                margin: 10px;
            }
        }
    }
}
</style>