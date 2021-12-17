<template>
    <div class="comment">
        <div class="comment-header">
            <slot name="comment-header"></slot>
        </div>
        <div class="comment-edit-container" v-show="!reply">
            <m-editor :isAdmin="config.is_admin"></m-editor>
        </div>
        <m-comment :list="list" :isAdmin="config.is_admin"></m-comment>
        <m-loading v-if="loading"></m-loading>
        <h2 v-if="!loaded && !loading" class="center" @click="loadData">查看更多</h2>
        <m-audit v-model:show="audit.show" :comment="audit.comment"></m-audit>
    </div>
</template>

<script>
import tcb from '@/tcb';

export default {
    computed: {
        pageHash () {
            return this.hash ? this.hash : location.pathname
        },
        pageTitle () {
            return this.title ? this.title : document.title
        }
    },
    props: {
        hash: String,
        title: String,
        env: {
            type: String,
            required: true
        }
    },
    provide () {
        return {
            app: {
                addComment: this.addComment,
                replyComment: this.replyComment,
                auditComment: this.auditComment
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
            },
            audit: {
                show: false,
                comment: {}
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
                    if (loginState) {
                        setUser(loginState.user)
                        this.setConfig()
                    }
                });
                this.setConfig()
                this.loadData()
            })
        },
        // 获取配置
        async setConfig () {
            let config = await tcb.callFunction('getConfig')
            console.log(config);
            this.config = config || { form: { nick: true, email: true } }
        },
        // 设置回复
        replyComment (reply) {
            this.reply = reply
        },
        // 审核评论
        auditComment (comment) {
            this.audit.comment = comment
            this.audit.show = true
        },
        // 添加评论
        addComment (comment, callback) {
            let reply = this.reply
            let par = {
                ...comment,
                isPrivate: reply === null ? comment.isPrivate : false,
                type: reply === null ? 0 : 1,
                hash: this.pageHash,
                ua: window.navigator.userAgent
            }
            if (reply) {
                par.replyId = reply.id
            }
            tcb.callFunction('addComment', par).then(res => {
                if (res) {
                    let com = { ...par, ...res }
                    if (par.type === 0) {
                        let index = this.list.findIndex(item => !item.top)
                        this.list.splice(index, 0, com)
                    } else {
                        let item = this.list.find(item => item === reply || (item.childer && item.childer.includes(reply)))
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
                title: this.pageTitle,
                hash: this.pageHash,
                ...this.page
            }).then(data => {
                console.log(data);
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
        this.init()
    }
}
</script>

<style lang="less">
@import url("../../styles/index.less");
.comment {
    padding: 1em 1.5em;
    min-width: 560px;
    color: @ui-text;
    background-color: @ui-bg;
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