<template>
    <div class="m-comment-item" :class="{ delete: comment.delete }">
        <m-avatar :src="getAvatar(comment)"></m-avatar>
        <div class="comment-user-container">
            <span class="comment-user-top" v-if="comment.top">
                <m-icon name="top" width="32"></m-icon>
            </span>
            <template v-if="$store.config.is_admin">
                <span class="comment-user-top" v-if="comment.delete">
                    <m-icon name="delete" width="48"></m-icon>
                </span>
                <span class="comment-user-top" v-else-if="!comment.isAudit">
                    <m-icon name="audit" width="48"></m-icon>
                </span>
            </template>
            <div class="comment-user-info">
                <template v-if="comment.nick">
                    <a v-if="comment.link" class="comment-user-nick link" rel="nofollow" :href="comment.link" target="_blank" v-text="comment.nick"></a>
                    <span v-else class="comment-user-nick" v-text="comment.nick"></span>
                </template>
                <span class="comment-user-tag" v-if="comment.tag">{{ comment.tag }}</span>
                <span class="comment-user-sys">{{ comment.ua.browser }} {{ comment.ua.version }}</span>
                <span class="comment-user-sys">{{ comment.ua.os }} {{ comment.ua.osVersion }}</span>
            </div>
            <div class="comment-user-text">
                <template v-if="comment.at">
                    <a v-if="comment.at.link" class="comment-replylink link" rel="nofollow" :href="comment.at.link" target="_blank">@{{ comment.at.nick || comment.at.tag }}</a>
                    <span v-else class="comment-replylink">@{{ comment.at.nick || comment.at.tag }}</span>
                </template>
                <div v-html="formatContent(comment.content)"></div>
            </div>
            <div class="comment-user-meta">
                <span class="comment-time">{{ timeAgo(new Date(comment.created)) }}</span>
                <div>
                    <span v-if="!comment.delete && comment.isAudit" class="comment-reply" @click="handleEmits('reply', comment)">回复</span>
                    <template v-if="$store.config.is_admin">
                        <span v-if="!comment.delete && !comment.isAudit" class="comment-reply" @click="handleEmits('audit', comment)">审核</span>
                        <span v-if="!comment.delete" class="comment-reply c-danger" @click="handleEmits('delete', comment)">删除</span>
                    </template>
                </div>
            </div>
            <div class="comment-edit-container" v-if="app.replyComment && app.replyComment.id === comment.id">
                <m-editor isCancel @sumbit="app.sumbit" @cancel="handleEmits('reply', null)"></m-editor>
            </div>
            <div class="comment-reply-container" v-if="comment.childer && comment.childer.length > 0">
                <template v-if="comment.childer.length < 3">
                    <m-comment-item v-for="element in comment.childer" :key="element.id" :comment="element"></m-comment-item>
                </template>
                <template v-else>
                    <m-comment-item v-for="idx in len" :key="comment.childer[idx - 1].id" :comment="comment.childer[idx - 1]"></m-comment-item>
                    <span class="toggle-btn link" @click="handleToggle(comment.childer.length)">{{ len === 2 ? '显示更多' : '折叠评论' }}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import mAvatar from '+/avatar'
import mEditor from '+/editor'
import { timeAgo } from "@/timeago.js";
import { parse } from "@/emojis";

export default {
    name: "m-comment-item",
    //emits: ['sumbit', 'reply', 'audit', 'delete'],
    components: {
        mAvatar,
        mEditor
    },
    props: {
        comment: Object,
        replyComment: Object
    },
    data () {
        return {
            len: 2
        }
    },
    inject: ['app'],
    methods: {
        timeAgo,
        // 格式化内容
        formatContent (html = '') {
            return parse(html)
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
            console.log(emit, data);
            //this.$emit(emit, ...data)
            this.app[emit](...data)
        },
        // 显示更多
        handleToggle (len) {
            this.len = this.len === 2 ? len : 2
        }
    }
}
</script>