<template>
    <div class="comment-item">
        <m-avatar :src="getAvatar(comment)"></m-avatar>
        <div class="comment-user-container">
            <div class="comment-user-info">
                <a v-if="comment.link" class="comment-user-nick" rel="nofollow" :href="comment.link" target="_blank">{{ comment.nick }}</a>
                <span v-else class="comment-user-nick">{{ comment.nick }}</span>
                <span class="comment-user-top" v-if="comment.top">置顶</span>
                <span class="comment-user-tag" v-if="comment.tag">{{ comment.tag }}</span>
                <span class="comment-user-sys">{{ comment.ua.browser }}</span>
                <span class="comment-user-sys">{{ comment.ua.os }}</span>
            </div>
            <div class="comment-user-text">
                <div v-if="comment.at">
                    <a class="comment-replylink" rel="nofollow" :href="comment.link" target="_blank">@{{ comment.at.nick }}</a>
                </div>
                <div v-html="comment.content"></div>
            </div>
            <div class="comment-user-meta">
                <span class="comment-time">{{ timeAgo(new Date(comment.created)) }}</span>
                <div>
                    <span class="comment-reply" @click="handleReply(comment)">回复</span>
                    <span class="comment-zan" @click="handleReply(comment)">赞</span>
                </div>
            </div>
            <div class="comment-edit-container" v-if="$root.reply && $root.reply.id === comment.id">
                <m-editor isCancel @cancel="handleReply(null)"></m-editor>
            </div>
            <div class="comment-reply-container" v-if="comment.childer">
                <template v-if="comment.childer.length < 3">
                    <m-comment-item v-for="element in comment.childer" :key="element.id" :comment="element"></m-comment-item>
                </template>
                <template v-else>
                    <m-comment-item v-for="idx in len" :key="comment.childer[idx - 1].id" :comment="comment.childer[idx - 1]"></m-comment-item>
                    <span class="toggle-btn" @click="handleToggle(comment.childer.length)">{{ len === 2 ? '显示更多' : '折叠评论' }}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import mAvatar from '+/avatar'
import mEditor from '+/editor'
import { timeAgo } from "@/timeago.js";

export default {
    name: "mCommentItem",
    inject: ['app'],
    components: {
        mAvatar,
        mEditor
    },
    data () {
        return {
            len: 2
        }
    },
    props: {
        comment: Object
    },
    methods: {
        timeAgo,
        // 
        getAvatar (comment) {
            if (this.$root.config && this.$root.config.is_use_qq_avatar) {
                return comment.qqAvatar || comment.gavatar
            }
            return comment.gavatar
        },
        // 回复
        handleReply (comment) {
            this.app.setReplyID(comment)
        },
        // 显示更多
        handleToggle (len) {
            this.len = this.len === 2 ? len : 2
        }
    }
}
</script>

<style lang="less" scoped>
.comment-item {
    display: flex;
    padding: 1.5em 0;

    .comment-user-container {
        flex: 1;
        margin-left: 1em;

        // 用户信息
        .comment-user-info {
            line-height: 1.5;
            margin-top: 0;

            .comment-user-nick {
                position: relative;
                margin-right: 0.875em;
                text-decoration: none;
                display: inline-block;
            }

            .comment-user-sys {
                display: inline-block;
                padding: 0.2em 0.5em;
                font-size: 0.75em;
                border-radius: 0.2em;
                margin-right: 0.875em;
            }

            .comment-user-top,
            .comment-user-tag {
                color: #fff;
                background-color: #723b9d;
                display: inline-block;
                padding: 0.2em 0.5em;
                font-size: 0.75em;
                border-radius: 0.2em;
                margin-right: 0.875em;
            }

            .comment-user-top {
                color: #fff;
                background-color: #5b8bf3;
            }
        }

        // 用户次要信息
        .comment-user-meta {
            line-height: 1;
            margin-top: 0.8em;
            display: flex;
            justify-content: space-between;

            .comment-reply,
            .comment-zan,
            .comment-time {
                color: #bebebe;
                font-size: 0.8125em;
            }
            .comment-reply,
            .comment-zan {
                margin-left: 0.875em;
                cursor: pointer;
                user-select: none;
            }
        }

        // 用户评论内容
        .comment-user-text {
            margin: 0.6em 0 0;
        }
    }

    &:hover {
        > .comment-user-container > .comment-user-meta > .comment-reply {
            opacity: 1;
        }
    }

    + .comment-item {
        border-top: 1px dashed var(--color-dashed, #e9e9e9);
    }

    .comment-item {
        padding: 1.2em 0;
        + .comment-item {
            border-top: 1px solid var(--color-dashed, #e9e9e9);
        }
    }
}

// 回复内容块
.comment-reply-container {
    margin-top: 1em;
    padding: 0 1.2em;
    background-color: #fafafa;
    border-radius: 3px;
}

// 评论内容 样式处理
.comment-user-text {
    font-size: 0.9em;

    //代码块
    pre {
        font-family: Menlo, 'Bitstream Vera Sans Mono', 'DejaVu Sans Mono',
            Monaco, Consolas, monospace;
        position: relative;
        background: #272822 !important;
        margin: 2em 0;
        padding: 40px 20px 10px;
        overflow: auto;
        color: #ccc !important;
        border-radius: 4px;
        line-height: 20px;

        code {
            font-family: Menlo, 'Bitstream Vera Sans Mono', 'DejaVu Sans Mono',
                Monaco, Consolas, monospace;
        }

        &::after {
            content: ' ';
            position: absolute;
            border-radius: 50%;
            background: #ff5f56;
            width: 12px;
            height: 12px;
            top: 0;
            left: 12px;
            margin-top: 12px;
            -webkit-box-shadow: 20px 0 #ffbd2e, 40px 0 #27c93f;
            box-shadow: 20px 0 #ffbd2e, 40px 0 #27c93f;
        }
    }

    //分割线
    hr {
        height: 1px;
        padding: 0;
        border: none;
        text-align: center;
        margin: 2em 0;
        background-image: linear-gradient(
            to right,
            rgba(93, 186, 133, 0),
            rgba(93, 186, 133, 0.75),
            rgba(93, 186, 133, 0)
        );
    }

    //引用
    blockquote {
        margin: 0;
        padding: 0.6em 1em;
        border-radius: 4px;
        border-left: 5px solid var(--color-link);
        background-color: rgba(var(--color-head-bg-rgb), 0.4);
    }

    a {
        text-decoration: none;
        outline: 0;
    }

    p {
        margin: 0;
    }

    table {
        border-spacing: 0;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;

        tr {
            border: 0;

            th {
                border-top: 1px solid #ccc;
                border-left: 1px solid #ccc;
                min-width: 85px;
                font-weight: bold;
                padding: 5px 10px;
            }

            td {
                padding: 5px 10px;
                border-top: 1px solid #ccc;
                border-left: 1px solid #ccc;
                min-width: 85px;
            }
        }
    }

    .comment-replylink {
        text-decoration: none;
        outline: 0;
        font-size: 0.9rem;
        padding: 0 5px;
        text-decoration: underline;
        color: var(--color-link, #6062ce);
        text-decoration-color: var(--color-link, #6062ce);
        transition: color var(--transitionTime, 0.3s ease),
            background-color var(--transitionTime, 0.3s ease);
    }
}

@media screen and (max-width: 600px) {
    .comment-user-sys {
        display: none;
    }
}

//
.comment-edit-container {
    padding: 5px 10px 10px;
    margin-top: 10px;
}

// 显示更多
.toggle-btn {
    color: #525252;
    font-size: 0.8em;
    cursor: pointer;
    display: inline-block;
    margin: 0 0 10px 56px;
    transition: color 0.3s ease;

    &:hover {
        color: #000;
        border-bottom: 1px solid #000;
    }
}
</style>