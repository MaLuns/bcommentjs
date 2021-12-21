<template>
    <div class="comment-list">
        <template v-if="loading">
            <div class="comment-item" v-for="item in 5" :key="item">
                <m-skeleton type="circle" style="width: 40px;height:40px;"></m-skeleton>
                <div class="comment-user-container">
                    <div class="comment-user-info">
                        <m-skeleton class="mr-10" type="text" style="width: 60px;"></m-skeleton>
                        <m-skeleton class="mr-10" type="text" style="width: 80px;"></m-skeleton>
                        <m-skeleton class="mr-10" type="text" style="width: 80px;"></m-skeleton>
                    </div>
                    <div class="comment-user-text">
                        <m-skeleton type="text"></m-skeleton>
                        <m-skeleton type="text" style="width: 30%;"></m-skeleton>
                    </div>
                    <div class="comment-user-meta">
                        <span class="comment-time">
                            <m-skeleton type="text" style="width: 30px;"></m-skeleton>
                        </span>
                        <span class="comment-reply">
                            <m-skeleton type="text" style="width: 30px;"></m-skeleton>
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <m-item v-for="(item,index) in list" :key="item.id" :comment="item" :data-index="index"></m-item>
        </template>
    </div>
</template>

<script>
import mItem from './item.vue'

export default {
    name: 'm-comment',
    components: {
        mItem
    },
    props: {
        // 列表
        list: Array,
    },
    data () {
        return {
            loading: true
        }
    },
    computed: {
        len () {
            return this.list.length
        }
    },
    watch: {
        len (val) {
            if (val > 0) {
                setTimeout(() => {
                    this.loading = false
                }, 300);
            }

        }
    },
    methods: {

    },
}
</script>
<style lang="less" scoped>
@import url("../../styles/variables.less");
.comment-list {
    > h3 {
        text-align: center;
    }

    :deep(.comment-item) {
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
                .comment-reply {
                    cursor: pointer;
                    font-size: 0.9em;
                    user-select: none;
                    color: @ui-aide-text-stress;
                }
            }
        }

        .comment-reply {
            /* opacity: 0; */
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

        // 回复内容块
        .comment-reply-container {
            margin-top: 1em;
            padding: 0 1.2em;
            border-radius: @ui-border-radius;
            background-color: @ui-bg-weak;

            .comment-reply:last-child {
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
                font-family: Menlo, "Bitstream Vera Sans Mono",
                    "DejaVu Sans Mono", Monaco, Consolas, monospace;
                position: relative;
                background: #272822 !important;
                margin: 2em 0;
                padding: 40px 20px 10px;
                overflow: auto;
                color: #ccc !important;
                border-radius: 4px;
                line-height: 20px;

                code {
                    font-family: Menlo, "Bitstream Vera Sans Mono",
                        "DejaVu Sans Mono", Monaco, Consolas, monospace;
                }

                &::after {
                    content: " ";
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
    }
}
</style>