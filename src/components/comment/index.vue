<template>
    <m-skeleton class="m-comment-list" :count="3" :loading="loading">
        <template #template>
            <div class="m-comment-item">
                <m-skeleton-item type="circle" style="width: 40px;height:40px;"></m-skeleton-item>
                <div class="m-comment-user-container">
                    <div class="m-comment-user-info">
                        <m-skeleton-item class="mr-10" type="text" style="width: 60px;"></m-skeleton-item>
                        <m-skeleton-item class="mr-10" type="text" style="width: 80px;"></m-skeleton-item>
                        <m-skeleton-item class="mr-10" type="text" style="width: 80px;"></m-skeleton-item>
                    </div>
                    <div class="m-comment-user-text">
                        <m-skeleton-item type="text"></m-skeleton-item>
                        <m-skeleton-item type="text" style="width: 30%;"></m-skeleton-item>
                    </div>
                    <div class="m-comment-user-meta">
                        <span class="m-comment-time">
                            <m-skeleton-item type="text" style="width: 30px;"></m-skeleton-item>
                        </span>
                        <span class="m-comment-reply">
                            <m-skeleton-item type="text" style="width: 30px;"></m-skeleton-item>
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <m-comment-item v-for="(item,index) in list" :key="item.id" :comment="item" :data-index="index"></m-comment-item>
            <slot></slot>
        </template>
    </m-skeleton>
</template>

<script>
import mCommentItem from './item.vue'

export default {
    name: 'm-comment',
    emits: ['audit', 'delete', 'sumbit'],
    components: { mCommentItem },
    props: {
        list: Array,
    },
    computed: {
        loading () {
            return this.list.length === 0
        }
    },
    provide () {
        return {
            app: this
        }
    },
    data () {
        return {
            replyComment: null
        }
    },
    methods: {
        // 回复
        reply (comment) {
            this.replyComment = comment
        },
        // 审核
        audit (comment) {
            this.$emit('audit', comment)
        },
        // 删除
        delete (comment) {
            this.$emit('delete', comment)
        },
        // 提交
        sumbit (comment, callback) {
            this.$emit(
                'sumbit',
                comment,
                () => {
                    this.replyComment = null
                    callback()
                },
                this.replyComment
            )
        }
    },
}
</script>,