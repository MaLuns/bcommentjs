<template>
    <div class="layout">
        <div class="layout-left">
            <div class="layout-left-title">文章列表</div>
            <m-skeleton class="m-comment-list" :count="6" :loading="articles.length < 1">
                <template #default>
                    <ul>
                        <li class="article-item" :key="item._id" :class="{ current: item === curArticle }" v-for="item in articles" @click="handleCurArticle(item)">
                            <p>{{ item.title || item.url }}</p>
                        </li>
                    </ul>
                </template>
                <template #template>
                    <div class="pl-20 pr-20">
                        <m-skeleton-item class="mt-10 mb-10" type="text"></m-skeleton-item>
                    </div>
                </template>
            </m-skeleton>
        </div>
        <div class="layout-right">
            <m-comment :list="comments" v-if="comments.length > 0">
                <m-page class="mt-10" v-bind="page" @change="getComments"></m-page>
            </m-comment>
            <div v-else>
                <m-empty></m-empty>
            </div>
        </div>
    </div>
</template>
<script>
import tcb from '@/tcb'
export default {
    data () {
        return {
            articles: [],
            comments: [],
            curArticle: {},
            page: {
                total: 0,
                pageIndex: 1,
                pageSize: 10
            },
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
<style lang="less" scoped>
@import url("css/variables.less");
.layout {
    display: flex;
    height: 100%;

    .layout-left {
        width: 260px;
        background-color: @ui-bg;
        border-radius: @ui-border-radius;

        .layout-left-title {
            line-height: 50px;
            text-align: center;
        }
        .article-item {
            list-style: none;
            cursor: pointer;
            padding: 10px 20px;
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

    .layout-right {
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