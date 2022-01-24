<template>
    <MSkeleton class="m-comment-list" :count="3" :loading="loading">
        <template #template>
            <div class="m-comment-item">
                <MSkeletonItem type="circle" style="width: 40px;height:40px;" />
                <div class="m-comment-user-container">
                    <div class="m-comment-user-info">
                        <MSkeletonItem class="mr-10" type="text" style="width: 60px;" />
                        <MSkeletonItem class="mr-10" type="text" style="width: 80px;" />
                        <MSkeletonItem class="mr-10" type="text" style="width: 80px;" />
                    </div>
                    <div class="m-comment-user-text">
                        <MSkeletonItem type="text" />
                        <MSkeletonItem type="text" style="width: 30%;" />
                    </div>
                    <div class="m-comment-user-meta">
                        <span class="m-comment-time">
                            <MSkeletonItem type="text" style="width: 30px;" />
                        </span>
                        <span class="m-comment-reply">
                            <MSkeletonItem type="text" style="width: 30px;" />
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template #default>
            <MCommentItem v-for="(item,index) in list" :key="item.id" :comment="item" :data-index="index" />
            <slot />
        </template>
    </MSkeleton>
</template>

<script>
import MCommentItem from './item.vue'

export default {
    name: 'MComment',
    components: { MCommentItem },
    provide () {
        return {
            app: this
        }
    },
    props: {
        list: {
            type: Array,
            default: () => []
        },
    },
    emits: ['audit', 'delete', 'sumbit'],
    data () {
        return {
            replyComment: null
        }
    },
    computed: {
        loading () {
            return this.list.length === 0
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