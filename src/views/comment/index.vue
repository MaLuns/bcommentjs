<template>
    <div class="comment">
        <div class="comment-header">
            <slot name="comment-header"></slot>
        </div>
        <div class="comment-edit-container" v-if="!reply">
            <m-editor></m-editor>
        </div>
        <m-comment :list="list"></m-comment>
        <m-loading v-if="loading"></m-loading>
        <h2 v-if="!loaded" style="text-align: center;" @click="loadData">查看更多</h2>
    </div>
</template>

<script>
import detect from "@/detect";
import tcb from '@/tcb';
import { mComment, mEditor, mLoading } from '+/'

export default {
    components: { mComment, mEditor, mLoading },
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
                setReplyID: this.setReplyID
            }
        }
    },
    computed: {
        pageHash () {
            if (this.hash === '') {
                return location.pathname
            }
            return this.hash
        }
    },
    data () {
        return {
            loading: true,
            loaded: true,
            reply: null,
            list: [],
            page: {
                pageIndex: 0,
                pageSize: 10
            }
        }
    },
    methods: {
        // 设置回复
        setReplyID (reply) {
            this.reply = reply
        },
        // 添加评论
        addComments (commet, callback) {
            let par = {
                ...commet,
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
            })
        },
        // 加载更多评论
        loadData () {
            this.page.pageIndex++
            tcb.callFunction('getComments', {
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
        }
    },
    created () {
        this.detect = detect();
        tcb.initApp({ env: this.env }).then(_ => {
            this.loadData()
            //tcb.callFunction('currentLimit', console.log)
        })
    },
}
</script>

<style lang="less" scoped>
@import url("~/index.less");
.comment {
    padding: 0 1em 1em;
    background-color: @cj-background-color;
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