<template>
    <div class="comment-item">
        <m-avatar :src="getAvatar(comment)"></m-avatar>
        <div class="comment-user-container">
            <span class="comment-user-top" v-if="comment.top">
                <svg t="1638713400200" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2745" width="32" height="32">
                    <path d="M1023.914667 481.860267L542.1568 1.0752H0.477867l1023.4368 1022.344533z" fill="#FF5252" p-id="2746" />
                    <path
                        d="M590.609067 217.719467l-51.541334-51.4048-148.906666 148.957866-38.570667-38.5024 148.906667-148.957866-51.421867-51.285334 31.4368-31.4368 141.533867 141.175467-31.4368 31.453867z m-45.568 76.6464c28.245333-28.2624 59.511467-43.008 93.764266-44.288 34.2528-1.262933 64.938667 11.639467 92.074667 38.690133 25.8048 25.736533 37.9904 55.04 36.573867 87.893333-1.399467 32.8704-15.581867 62.7712-42.513067 89.7024-28.091733 28.1088-59.0848 42.752-92.945067 43.946667-33.860267 1.194667-64.0512-11.434667-90.555733-37.888-25.890133-25.8048-38.434133-55.261867-37.632-88.354133 0.785067-33.092267 14.5408-62.976 41.233067-89.7024z m42.564266 38.263466c-17.544533 17.544533-27.648 36.113067-30.327466 55.7056-2.6624 19.592533 3.396267 36.7616 18.158933 51.490134 15.086933 15.035733 32.1536 21.4016 51.217067 19.114666 19.063467-2.321067 37.614933-12.458667 55.620266-30.481066 18.773333-18.773333 29.5424-37.717333 32.290134-56.763734 2.730667-19.0464-3.310933-35.976533-18.158934-50.773333-15.069867-15.0528-32.546133-21.2992-52.394666-18.773333-19.831467 2.542933-38.638933 12.6976-56.405334 30.481066z m189.661867 243.1488l-62.8736 62.8736-38.485333-38.365866 180.360533-180.394667 62.122667 61.986133c44.936533 44.8 48.384 86.237867 10.359466 124.279467-18.4832 18.4832-40.072533 26.5216-64.768 24.132267-24.695467-2.389333-47.0016-13.9776-66.901333-34.747734l-19.8144-19.7632z m87.671467-87.7056l-58.2144 58.231467 16.674133 16.64c22.613333 22.545067 43.741867 24.0128 63.3856 4.369067 19.165867-19.165867 17.5616-39.936-4.829867-62.2592l-17.015466-16.981334z"
                        fill="#FFFFFF"
                        p-id="2747"
                    />
                </svg>
            </span>
            <div class="comment-user-info">
                <a v-if="comment.link" class="comment-user-nick" rel="nofollow" :href="comment.link" target="_blank">{{ comment.nick }}</a>
                <span v-else class="comment-user-nick">{{ comment.nick }}</span>
                <span class="comment-user-tag" v-if="comment.tag">{{ comment.tag }}</span>
                <span class="comment-user-sys">{{ comment.ua.browser }} {{ comment.ua.version }}</span>
                <span class="comment-user-sys">{{ comment.ua.os }} {{ comment.ua.osVersion }}</span>
            </div>
            <div class="comment-user-text">
                <a v-if="comment.at" class="comment-replylink" rel="nofollow" :href="comment.link" target="_blank">@{{ comment.at.nick }}</a>
                <div v-html="formatContent(comment.content)"></div>
            </div>
            <div class="comment-user-meta">
                <span class="comment-time">{{ timeAgo(new Date(comment.created)) }}</span>
                <div>
                    <span class="comment-reply" @click="handleReply(comment)">回复</span>
                    <!-- <span class="comment-zan" @click="handleReply(comment)">赞</span> -->
                </div>
            </div>
            <div class="comment-edit-container" v-if="$root.reply && $root.reply.id === comment.id">
                <m-editor isCancel @cancel="handleReply(null)"></m-editor>
            </div>
            <div class="comment-reply-container" v-if="comment.childer && comment.childer.length > 0">
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
import { parse } from "@/emojis";

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
        // 格式化内容
        formatContent (html = '') {
            return parse(html)
        },
        // 头像显示
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
@import url("../../styles/variables.less");
.comment-item {
    display: flex;
    padding: 1em 0;

    .comment-user-container {
        flex: 1;
        margin-left: 1em;
        position: relative;

        .comment-user-top {
            position: absolute;
            right: 0;
            top: 0;
        }
        // 用户信息
        .comment-user-info {
            margin-top: 0;

            .comment-user-nick {
                position: relative;
                margin-right: 0.875em;
                text-decoration: none;
                display: inline-block;
            }

            .comment-user-sys {
                display: inline-block;
                font-size: 0.75em;
                margin-right: 0.875em;
                color: @ui-aide-text;
            }

            .comment-user-tag {
                color: #fff;
                background-color: #723b9d;
                display: inline-block;
                padding: 0.2em 0.5em;
                font-size: 0.75em;
                border-radius: 0.2em;
                margin-right: 0.875em;
            }
        }

        // 用户次要信息
        .comment-user-meta {
            margin-top: 0.8em;
            display: flex;
            justify-content: space-between;

            .comment-time {
                color: @ui-aide-text;
                font-size: 0.9em;
            }

            .comment-reply,
            .comment-zan {
                cursor: pointer;
                font-size: 0.9em;
                margin-left: 0.875em;
                user-select: none;
                color: @ui-aide-text-stress;
            }
        }
    }

    .comment-reply {
        opacity: 0;
        margin-right: 1.2em;
    }

    &:hover {
        > .comment-user-container > .comment-user-meta .comment-reply {
            opacity: 1;
        }
    }

    + .comment-item {
        border-top: 1px dashed @ui-dividing-line;
    }

    .comment-item {
        padding: 1.2em 0;
        + .comment-item {
            border-top: 1px dashed @ui-dividing-line;
        }
    }
}

// 回复内容块
.comment-reply-container {
    margin-top: 1em;
    padding: 0 1.2em;
    border-radius: @ui-border-radius;
    background-color: @ui-global-bg;
    .comment-reply {
        margin-right: 0;
    }
}

@media screen and (max-width: 600px) {
    .comment-user-sys {
        display: none;
    }
}

// 编辑器容器
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
    transition: color @ui-transition-duration;

    &:hover {
        color: #000;
    }
}

// 评论内容 样式处理
.comment-user-text {
    margin: 0.6em 0 0;

    :deep(.emoji-icon) {
        img {
            width: 24px;
            pointer-events: none;
        }
    }

    .comment-replylink {
        font-size: 0.9rem;
        outline: 0;
        margin-bottom: 4px;
        display: inline-block;
        text-decoration: underline;
        color: @ui-link;
        text-decoration-color: @ui-link-decoration;
        transition: color @ui-transition-duration,
            background-color @ui-transition-duration;
    }

    //代码块
    pre {
        font-family: Menlo, "Bitstream Vera Sans Mono", "DejaVu Sans Mono",
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
            font-family: Menlo, "Bitstream Vera Sans Mono", "DejaVu Sans Mono",
                Monaco, Consolas, monospace;
        }

        &::after {
            content: " ";
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
        border-left: 5px solid @ui-info;
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
        border-right: 1px solid @ui-border-line;
        border-bottom: 1px solid @ui-border-line;

        tr {
            border: 0;

            th {
                border-top: 1px solid @ui-border-line;
                border-left: 1px solid @ui-border-line;
                min-width: 85px;
                font-weight: bold;
                padding: 5px 10px;
            }

            td {
                padding: 5px 10px;
                border-top: 1px solid @ui-border-line;
                border-left: 1px solid @ui-border-line;
                min-width: 85px;
            }
        }
    }
}
</style>