<template>
    <div class="comment-page">
        <div class="comment-page-left">
            <div class="comment-page-left-title">
                文章列表
            </div>
            <MSkeleton class="m-comment-list" :count="6" :loading="articles.length < 1">
                <template #default>
                    <ul>
                        <li v-for="item in articles" :key="item._id" class="article-item" :title="item.title || item.url" :class="{ current: item === curArticle }" @click="handleCurArticle(item)">
                            {{ item.title || item.url }}
                        </li>
                    </ul>
                </template>
                <template #template>
                    <div class="pl-20 pr-20">
                        <MSkeletonItem class="mt-10 mb-10" type="text" />
                    </div>
                </template>
            </MSkeleton>
        </div>
        <div class="comment-page-right">
            <h2 class="center pt-10 pb-20">
                {{ curArticle.title }}
            </h2>
            <template v-if="comments.length > 0">
                <MComment :list="comments" @audit="auditComment" @delete="deleteComment" @sumbit="addComment">
                    <Mpage class="mt-10" v-bind="page" @change="getComments" />
                </MComment>
                <m-audit v-model:show="audit.show" :comment="audit.comment" @pass="handlePassAudit" />
            </template>
            <template v-else>
                <MEmpty class="mt-20" />
            </template>
        </div>
    </div>
</template>
<script>
import commentMixin from '@/commentMixin';
import tcb from '@/tcb'

export default {
    mixins: [commentMixin],
    data () {
        return {
            articles: [],
            curArticle: {
                title: ''
            },
            audit: {
                show: false,
                comment: {}
            }
        }
    },
    mounted () {
        this.getArticles()
    },
    methods: {
        getArticles () {
            tcb.callFunction('getArticles').then(res => {
                this.articles = res
            })
        },
        handleCurArticle (item) {
            this.curArticle = item
            this.page = {
                total: 0,
                pageIndex: 1,
                pageSize: 10
            }
            this.getComments()
        },
        getComments (pageIndex = this.page.pageIndex) {
            tcb.callFunction('getComments', {
                hash: this.curArticle.hash,
                articleID: this.curArticle._id,
                ...this.page,
                pageIndex
            }).then(data => {
                let { list, page } = data
                this.page = page
                this.comments = list
            })
        }
    },
}
</script>
<style lang="less">
@import url("css/variables.less");
.comment-page {
    display: flex;
    height: 100%;

    .comment-page-left {
        width: 260px;
        background-color: @ui-bg;
        border-radius: @ui-border-radius;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;

        .comment-page-left-title {
            line-height: 50px;
            text-align: center;
        }
        .article-item {
            list-style: none;
            cursor: pointer;
            padding: 10px 20px;
            word-break: break-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            transition: all @ui-transition-duration;

            &.current {
                background-color: @ui-dropdown-menu-item;
                color: @ui-dropdown-menu-item-color;
            }

            &:hover {
                background-color: @ui-dropdown-menu-item;
                color: @ui-dropdown-menu-item-color;
            }
        }
    }

    .comment-page-right {
        flex: 1;
        margin-left: 10px;
        padding: 10px;
        background-color: @ui-bg;
        border-radius: @ui-border-radius;
        height: 100%;
        overflow-y: auto;
    }
}
</style>