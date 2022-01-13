<template>
    <div class="comment">
        <div class="comment-header">
            <slot name="comment-header"></slot>
        </div>
        <div class="comment-edit-container" v-show="!reply">
            <m-editor @sumbit="addComment"></m-editor>
        </div>
        <m-comment :list="comments" @audit="auditComment" @delete="deleteComment" @sumbit="addComment">
            <m-page class="mt-10" v-bind="page" @change="getList"></m-page>
        </m-comment>
        <m-audit v-model:show="audit.show" :comment="audit.comment" @pass="handlePassAudit"></m-audit>
    </div>
</template>

<script>
import tcb from '@/tcb';
import commentMixin from '@/commentMixin';

export default {
    mixins: [commentMixin],
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
            reply: null,
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
                this.getList(1)
            })
        },
        // 设置回复
        replyComment (reply) {
            this.reply = reply
        },
        // 获取列表
        getList (pageIndex) {
            tcb.callFunction('getComments', {
                hash: this.pageHash,
                title: this.pageTitle,
                url: location.pathname,
                ...this.page,
                pageIndex,
            }).then(data => {
                let { list = [], page } = data
                this.page = page;
                this.comments = list;
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