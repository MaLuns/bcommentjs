<template>
    <div class="comment">
        <div v-show="!reply" class="comment-edit-container">
            <MEditor @sumbit="addComment" />
        </div>
        <MComment :list="comments" @audit="auditComment" @delete="deleteComment" @sumbit="addComment">
            <MPage class="mt-10" v-bind="page" @change="getList" />
        </MComment>
        <MAudit v-model:show="audit.show" :comment="audit.comment" @pass="handlePassAudit" />
        <p class="center pt-10">
            <a class="link" :href="'https://www.npmjs.com/package/'+name" target="_blank" rel="noopener noreferrer">{{ name }}</a> - v{{ version }}
        </p>
    </div>
</template>

<script>
import tcb from '@/tcb';
import commentMixin from '@/commentMixin';
import { name, version } from '../../../package.json'

export default {
    name: 'CommentList',
    mixins: [commentMixin],
    props: {
        hash: {
            type: String,
            default: () => ''
        },
        title: {
            type: String,
            default: () => ''
        },
        env: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            name,
            version,
            reply: null,
            audit: {
                show: false,
                comment: {}
            }
        }
    },
    computed: {
        pageHash () {
            return this.hash ? this.hash : location.pathname
        },
        pageTitle () {
            return this.title ? this.title : document.title
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            tcb.initApp({ env: this.env }).then(() => {
                const setUser = (user) => {
                    this.$store.mutations.refreshConfig()
                    if (user && user.loginType === 'EMAIL') {
                        this.$store.user = user;
                    }
                }
                setUser(tcb.cloudbase.auth.currentUser)
                this.getList(1)

                tcb.cloudbase.auth.onLoginStateChanged((loginState) => {
                    if (loginState) setUser(loginState.user)
                });
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
    }
}
</script>

<style lang="less">
@import url('../../styles/variables.less');
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