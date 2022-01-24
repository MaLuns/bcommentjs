<template>
    <div class="m-comment-item" :class="{ delete: comment.delete }">
        <MAvatar :src="getAvatar(comment)" />
        <div class="m-comment-user-container">
            <span v-if="comment.top" class="m-comment-user-top">
                <MIcon name="top" width="32" />
            </span>
            <template v-if="$store.config.is_admin">
                <span v-if="comment.delete" class="m-comment-user-top">
                    <MIcon name="delete" width="48" />
                </span>
                <span v-else-if="!comment.isAudit" class="m-comment-user-top">
                    <MIcon name="audit" width="48" />
                </span>
            </template>
            <div class="m-comment-user-info">
                <template v-if="comment.nick">
                    <a v-if="comment.link" class="m-comment-user-nick link" rel="nofollow" :href="comment.link" target="_blank" v-text="comment.nick" />
                    <span v-else class="m-comment-user-nick" v-text="comment.nick" />
                </template>
                <span v-if="comment.tag" class="m-comment-user-tag">{{ comment.tag }}</span>
                <template v-if="$store.config.is_show_browser">
                    <span class="m-comment-user-sys">{{ comment.ua.browser }} {{ comment.ua.version }}</span>
                    <span class="m-comment-user-sys">{{ comment.ua.os }} {{ comment.ua.osVersion }}</span>
                </template>
            </div>
            <div class="m-comment-user-text">
                <template v-if="comment.at">
                    <a v-if="comment.at.link" class="m-comment-replylink link" rel="nofollow" :href="comment.at.link" target="_blank">@{{ comment.at.nick || comment.at.tag }}</a>
                    <span v-else class="m-comment-replylink">@{{ comment.at.nick || comment.at.tag }}</span>
                </template>
                <div v-html="formatContent(comment.content)" />
            </div>
            <div class="m-comment-user-meta">
                <span class="m-comment-time">{{ timeAgo(new Date(comment.created)) }}</span>
                <div>
                    <span v-if="!comment.delete && comment.isAudit" class="m-comment-reply" @click="handleEmits('reply', comment)">回复</span>
                    <template v-if="$store.config.is_admin">
                        <span v-if="!comment.delete && !comment.isAudit" class="m-comment-reply" @click="handleEmits('audit', comment)">审核</span>
                        <span v-if="!comment.delete" class="m-comment-reply c-danger" @click="handleEmits('delete', comment)">删除</span>
                    </template>
                </div>
            </div>
            <div v-if="app.replyComment && app.replyComment.id === comment.id" class="m-comment-edit-container">
                <MEditor type="rp" is-cancel @sumbit="app.sumbit" @cancel="handleEmits('reply', null)" />
            </div>
            <div v-if="comment.childer && comment.childer.length > 0" class="m-comment-reply-container">
                <template v-if="comment.childer.length < 3">
                    <MCommentItem v-for="element in comment.childer" :key="element.id" :comment="element" />
                </template>
                <template v-else>
                    <MCommentItem v-for="idx in len" :key="comment.childer[idx - 1].id" :comment="comment.childer[idx - 1]" />
                    <span class="toggle-btn link" @click="handleToggle(comment.childer.length)">{{ len === 2 ? '显示更多' : '折叠评论' }}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import MAvatar from '+/avatar'
import MEditor from '+/editor'
import { emojiParse, timeAgo } from '@/util';

export default {
    name: 'MCommentItem',
    components: {
        MAvatar,
        MEditor
    },
    inject: ['app'],
    props: {
        comment: {
            type: Object,
            default: () => ({})
        },
        replyComment: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            len: 2
        }
    },
    methods: {
        timeAgo,
        // 格式化内容
        formatContent (html = '') {
            return emojiParse(this.$store.emojis, html)
        },
        // 头像显示
        getAvatar (comment) {
            if (this.$store.config && this.$store.config.is_use_qq_avatar) {
                return comment.qqAvatar || comment.gavatar
            }
            return comment.gavatar
        },
        // 事件
        handleEmits (emit, ...data) {
            // this.$emit(emit, ...data)
            this.app[emit](...data)
        },
        // 显示更多
        handleToggle (len) {
            this.len = this.len === 2 ? len : 2
        }
    }
}
</script>