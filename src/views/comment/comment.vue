<template>
    <div class="comment">
        <div class="comment-header">
            <slot name="comment-header"></slot>
        </div>
        <div class="comment-edit-container" v-show="!reply">
            <m-editor @sumbit="addComment"></m-editor>
        </div>
        <m-comment :list="list" @audit="auditComment" @delete="deleteComment" @sumbit="addComment"></m-comment>
        <m-page class="mt-10" v-bind="page" @change="loadData"></m-page>
        <m-audit v-model:show="audit.show" :comment="audit.comment" @pass="handlePassAudit"></m-audit>
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
    data () {
        return {
            loading: true,
            loaded: true,
            reply: null,
            // 评论列表
            list: [],
            page: {
                total: 0,
                pageIndex: 1,
                pageSize: 10
            },
            user: {
                email: '',
                nick: ''
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
                        this.$store.refreshConfig()
                    }
                });
                this.$store.refreshConfig()
                this.loadData()
            })
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
        // 审核通过
        handlePassAudit (content) {
            tcb.callFunction('updateComment', {
                id: this.audit.comment.id,
                isAudit: true,
                content
            }).then(res => {
                if (res) {
                    this.audit.comment.isAudit = true
                    this.audit.comment.content = content
                    this.audit = {
                        show: false,
                        comment: {}
                    }
                    this.$message.info('审核成功')
                }
            })
        },
        // 删除评论
        deleteComment (comment) {
            tcb.callFunction('updateComment', {
                id: comment.id,
                delete: true,
            }).then(res => {
                if (res) {
                    comment.delete = true
                    this.$message.info('删除成功')
                }
            })
        },
        // 添加评论
        addComment (comment, callback, reply = null) {
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
                    }
                    this.$message.info('评论成功')
                    callback()
                }
            })
        },
        // 加载更多评论
        loadData (pageIndex = this.page.pageIndex) {
            tcb.callFunction('getComments', {
                title: this.pageTitle,
                hash: this.pageHash,
                url: location.pathname,
                ...this.page,
                pageIndex
            }).then(data => {
                let { list, page } = data
                this.page = page;
                this.list = list;
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