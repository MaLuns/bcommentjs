<template>
    <div class="comment-item">
        <m-avatar :src="getAvatar(comment)"></m-avatar>
        <div class="comment-user-container">
            <span class="comment-user-top" v-if="comment.top">
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                    <path d="M1023.914667 481.860267L542.1568 1.0752H0.477867l1023.4368 1022.344533z" fill="#ff5252" />
                    <path d="M590.609067 217.719467l-51.541334-51.4048-148.906666 148.957866-38.570667-38.5024 148.906667-148.957866-51.421867-51.285334 31.4368-31.4368 141.533867 141.175467-31.4368 31.453867z m-45.568 76.6464c28.245333-28.2624 59.511467-43.008 93.764266-44.288 34.2528-1.262933 64.938667 11.639467 92.074667 38.690133 25.8048 25.736533 37.9904 55.04 36.573867 87.893333-1.399467 32.8704-15.581867 62.7712-42.513067 89.7024-28.091733 28.1088-59.0848 42.752-92.945067 43.946667-33.860267 1.194667-64.0512-11.434667-90.555733-37.888-25.890133-25.8048-38.434133-55.261867-37.632-88.354133 0.785067-33.092267 14.5408-62.976 41.233067-89.7024z m42.564266 38.263466c-17.544533 17.544533-27.648 36.113067-30.327466 55.7056-2.6624 19.592533 3.396267 36.7616 18.158933 51.490134 15.086933 15.035733 32.1536 21.4016 51.217067 19.114666 19.063467-2.321067 37.614933-12.458667 55.620266-30.481066 18.773333-18.773333 29.5424-37.717333 32.290134-56.763734 2.730667-19.0464-3.310933-35.976533-18.158934-50.773333-15.069867-15.0528-32.546133-21.2992-52.394666-18.773333-19.831467 2.542933-38.638933 12.6976-56.405334 30.481066z m189.661867 243.1488l-62.8736 62.8736-38.485333-38.365866 180.360533-180.394667 62.122667 61.986133c44.936533 44.8 48.384 86.237867 10.359466 124.279467-18.4832 18.4832-40.072533 26.5216-64.768 24.132267-24.695467-2.389333-47.0016-13.9776-66.901333-34.747734l-19.8144-19.7632z m87.671467-87.7056l-58.2144 58.231467 16.674133 16.64c22.613333 22.545067 43.741867 24.0128 63.3856 4.369067 19.165867-19.165867 17.5616-39.936-4.829867-62.2592l-17.015466-16.981334z" fill="#FFFFFF" />
                </svg>
            </span>
            <template v-if="isAdmin">
                <span class="comment-user-top" v-if="!comment.isAudit">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                        <path d="M909.312 743.936l55.296-246.784c4.096-20.48-8.192-41.472-30.208-47.616L159.744 274.944c-20.992-3.584-42.496 9.216-47.616 30.208l-54.784 244.224c-3.584 20.992 9.216 42.496 30.208 47.616l775.68 173.568c19.968 7.68 40.96-5.632 46.08-26.624z m-41.472 3.072L92.16 572.928c-7.168-0.512-10.24-8.704-9.216-15.36l54.784-244.224c0.512-7.168 8.704-11.776 14.336-10.24L927.232 476.16c7.168 0.512 10.24 8.704 9.216 15.36l-53.76 245.248c-0.512 7.168-9.216 11.776-14.848 10.24z m-300.032-527.36l18.944-21.504 6.144 27.648 27.648 10.24-24.064 14.848-2.048 29.184-22.528-19.456-26.624 7.68 10.752-26.624-15.36-23.552c-2.56 0 27.136 1.536 27.136 1.536z m144.384 69.632l27.648-10.24-7.68 26.624 18.944 21.504-28.16 1.536L706.56 353.28l-10.24-27.648-27.648-6.144 23.552-16.896-2.048-29.184c-2.048-0.512 22.016 15.872 22.016 15.872zM452.608 831.488l-18.944 21.504-6.144-27.648-26.624-10.752 24.064-14.848 2.048-29.184 21.504 18.944L476.16 783.36l-10.752 26.624 15.36 23.552-28.16-2.048z m-144.384-70.656l-28.16 9.216 7.68-26.624-18.944-21.504h29.696l15.36-23.552 10.24 27.648 26.624 7.68-22.528 16.896 1.536 28.16c2.048-2.048-21.504-17.92-21.504-17.92z m101.888-529.408l4.608-28.672 19.456 20.992 29.184-4.096-14.336 25.088 12.8 26.624-28.672-4.608-20.48 20.48-3.072-27.648-25.088-14.336c-1.024-1.024 25.6-13.824 25.6-13.824z" fill="#ff5252" />
                        <path d="M590.336 170.496c128 28.16 225.792 123.904 263.68 240.128l30.72 6.656c-10.24-34.816-25.088-70.144-45.056-101.888-26.624-42.496-61.44-78.848-101.888-108.032-41.472-30.208-89.088-51.2-140.8-62.464-51.712-11.264-102.4-13.312-153.088-3.072-50.176 10.24-96.256 27.648-138.752 54.784-32.256 21.504-60.416 44.544-83.456 72.704l30.72 6.656c80.896-91.648 209.408-135.168 337.92-105.472zM433.152 873.984c-128.512-27.648-224.768-122.88-263.168-239.104l-30.72-6.656c10.24 34.816 25.088 70.144 45.056 101.888 26.624 42.496 61.44 78.848 101.888 108.032 41.472 30.208 89.6 50.688 140.8 62.464 50.688 11.776 102.4 13.312 153.088 3.072 50.176-9.728 95.744-28.16 137.728-54.784 32.256-21.504 59.392-43.52 83.456-72.704l-29.184-5.12c-83.456 88.576-211.456 132.096-338.944 102.912z" fill="#ff5252" />
                        <path d="M558.08 316.416c34.304 7.68 67.072 25.088 92.672 47.616l47.616 10.24c-33.792-43.008-79.872-72.192-134.656-84.48-52.736-12.288-107.52-4.608-157.184 17.92l47.616 10.24c32.768-8.192 68.096-10.24 103.936-1.536z m-92.16 412.672c-34.304-7.68-67.072-25.088-92.672-47.616l-47.616-10.24c33.792 43.008 79.872 72.192 134.656 84.48 53.248 12.8 108.032 5.12 157.696-18.432l-47.616-10.24c-32.256 8.192-70.144 9.728-104.448 2.048z" fill="#ff5252" />
                        <path d="M296.448 429.568c-7.168 9.728-15.872 18.432-25.088 27.136l-22.528 100.864-13.824-3.072 18.944-84.48c-8.192 5.12-17.408 10.752-28.672 15.872l-1.024-14.848c25.6-12.8 46.08-29.696 61.44-50.176l10.752 8.704z m3.584-47.616c-15.36 19.968-36.864 36.352-64.512 48.128l-1.024-14.848c23.04-10.752 41.472-25.088 54.272-41.984l11.264 8.704z m-10.24 94.72l77.312 17.408 3.072-14.336 14.848 3.072-3.072 14.336 23.04 5.12-3.072 13.312-23.04-5.12-11.776 53.248c-2.56 12.288-10.24 16.896-23.04 13.824l-28.672-6.656v-14.336c10.24 3.072 18.944 5.12 26.624 7.168 6.144 1.536 10.24-1.024 11.264-7.168l10.24-49.664-76.8-16.896 3.072-13.312z m16.384 26.112c9.728 14.848 16.896 27.136 20.992 36.352l-12.8 5.12c-4.608-10.752-11.776-23.04-20.992-36.864l12.8-4.608z m55.808-112.128l14.336 3.072-5.12 21.504 44.544 9.728-3.072 12.8-44.032-9.216-5.632 24.576 52.736 11.776-3.072 13.312-118.272-26.624 3.072-13.312 51.2 11.264 5.632-24.576-44.032-9.728 3.072-12.8 44.032 9.728 4.608-21.504zM498.688 571.904l-44.032-9.728-2.56 11.776-13.824-3.072L459.776 474.112l58.368 13.312 4.608-19.968 14.336 3.072-4.608 19.968 58.88 13.312-21.504 96.256-13.824-3.072 2.56-11.264-45.056-10.24-9.216 40.448-14.336-3.072 8.704-40.96z m117.76-107.52l-7.68 34.816-13.824-3.072 5.12-22.016-138.24-31.232-5.12 23.04-13.824-3.072 8.192-35.84 75.776 16.896c-1.024-6.144-2.048-11.264-3.072-15.872l15.872 1.024c0.512 4.096 1.536 10.24 2.048 18.432l74.752 16.896z m-153.6 61.44l-5.12 23.04 44.032 9.728 5.12-23.04-44.032-9.728z m52.224-25.6L471.04 490.496l-5.12 23.04 44.032 9.728 5.12-23.04z m1.024 61.952l45.056 10.24 5.12-23.04-45.056-10.24-5.12 23.04z m52.736-25.6l5.12-23.04-45.056-10.24-5.12 23.04 45.056 10.24zM648.192 647.168l-13.824-3.072 22.528-99.84c-10.752 18.432-23.04 35.328-37.376 49.152l-2.56-15.872c18.432-16.896 33.792-38.4 46.08-63.488l-27.136-6.144 3.072-13.824 27.648 6.144 8.704-38.912 13.824 3.072-8.704 38.912 23.552 5.12-3.072 13.824-23.552-5.12-3.072 12.8c6.656 12.288 13.824 27.136 20.48 44.032l-10.752 10.24c-5.632-16.896-9.728-29.696-13.312-38.4l-22.528 101.376z m25.6 4.608l-5.12-14.336c50.176-5.12 92.16-26.624 124.928-65.024l10.752 9.216c-13.312 15.872-28.16 28.672-44.544 38.912 11.776 16.896 21.504 32.256 28.16 46.08l-12.8 8.192c-6.144-14.336-14.848-30.208-26.624-47.616-22.528 13.312-47.616 21.504-74.752 24.576z m38.912-158.72l49.664 11.264c-1.024-7.68-3.072-14.848-5.12-22.016l15.36 1.024c1.536 7.68 3.072 15.872 3.584 24.064l44.032 9.728-3.072 12.8L762.88 518.144c-15.36 16.896-28.16 28.672-38.4 34.816 16.896 2.56 29.696 4.608 38.4 5.632 7.168-6.144 13.312-12.8 18.944-19.456l10.24 8.704c-29.184 35.328-64.512 55.808-105.984 61.44l-5.12-13.824c26.112-3.072 49.152-11.776 69.632-26.624-17.408-3.072-32.768-5.632-45.056-7.68l-0.512-12.288c1.024 0 2.048-0.512 3.072-0.512 9.216-3.072 22.528-14.336 39.936-33.28l-38.4-8.704 3.072-13.312z" fill="#ff5252" />
                    </svg>
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
                    <span v-if="comment.isAudit" class="comment-reply" @click="handleReply(comment)">回复</span>
                    <template v-if="isAdmin">
                        <span v-if="!comment.isAudit" class="comment-reply" @click="handleAudit(comment)">审核</span>
                        <span class="comment-reply" @click="handleDelete(comment)">删除</span>
                    </template>
                    <!-- <span class="comment-zan" @click="handleReply(comment)">赞</span> -->
                </div>
            </div>
            <div class="comment-edit-container" v-if="$root.reply && $root.reply.id === comment.id">
                <m-editor :is-admin="isAdmin" isCancel @cancel="handleReply(null)"></m-editor>
            </div>
            <div class="comment-reply-container" v-if="comment.childer && comment.childer.length > 0">
                <template v-if="comment.childer.length < 3">
                    <m-comment-item v-for="element in comment.childer" :key="element.id" :comment="element" :is-admin="isAdmin"></m-comment-item>
                </template>
                <template v-else>
                    <m-comment-item v-for="idx in len" :key="comment.childer[idx - 1].id" :comment="comment.childer[idx - 1]" :is-admin="isAdmin"></m-comment-item>
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
        comment: Object,
        isAdmin: Boolean
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
            this.app.replyComment(comment)
        },
        // 审核
        handleAudit (comment) {
            this.app.auditComment(comment)
        },
        // 显示更多
        handleToggle (len) {
            this.len = this.len === 2 ? len : 2
        }
    }
}
</script>

<style lang="less" scoped>
@import url('../../styles/variables.less');
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
        // 昵称
        .comment-user-nick {
            position: relative;
            margin-right: 0.875em;
            display: inline-block;
        }
        // 系统信息
        .comment-user-sys {
            display: inline-block;
            font-size: 0.75em;
            margin-right: 0.875em;
            color: @ui-aide-text;
        }
        // 标识
        .comment-user-tag {
            color: @ui-text-inversion;
            background-color: @ui-info;
            display: inline-block;
            padding: 0.2em 0.5em;
            font-size: 0.75em;
            border-radius: 0.2em;
            margin-right: 0.875em;
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
    background-color: @ui-bg-weak;
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
    font-size: 0.8em;
    cursor: pointer;
    display: inline-block;
    margin: 0 0 10px 56px;
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
        color: @ui-aide-text-stress;
        transition: color @ui-transition-duration,
            background-color @ui-transition-duration;
    }

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
            background: @ui-danger-weak;
            width: 12px;
            height: 12px;
            top: 0;
            left: 12px;
            margin-top: 12px;
            box-shadow: 20px 0 @ui-warning-weak, 40px 0 @ui-success-weak;
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