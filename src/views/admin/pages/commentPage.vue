<template>
    <div class="xxx">
        <div class="xxx-left">
            <div class="xxx-left-title">文章列表</div>
            <ul>
                <li class="article-item" :key="item._id" :class="{ current: item === curArticle }" v-for="item in articles" @click="handleCurArticle(item)">
                    <p>{{ item.title || item.url }}</p>
                </li>
            </ul>
        </div>
        <div class="xxx-right">
            <m-comment :list="comments" isAdmin></m-comment>
            <m-page class="mt-10" v-bind="page" @change="getComments"></m-page>
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
    created () {
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
@import url('css/variables.less');
.xxx {
    display: flex;
    height: 100%;

    .xxx-left {
        width: 260px;
        background-color: @ui-bg;
        border-radius: @ui-border-radius;

        .xxx-left-title {
            line-height: 50px;
            text-align: center;
        }
        .article-item {
            list-style: none;
            cursor: pointer;
            padding: 0.5em 1em;
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

    .xxx-right {
        flex: 1;
        margin-left: 1em;
        padding: 1em;
        background-color: @ui-bg;
        border-radius: @ui-border-radius;
        height: 100%;
        overflow-y: auto;
    }
}
</style>