<template>
    <div v-if="total > 0" class="center">
        <m-button type="text" :disabled="pageIndex < 2" @click="handleLast">上一页</m-button>
        <span class="ml-10 mr-10">{{ pageIndex }} / {{ maxPageIndex }}</span>
        <m-button type="text" :disabled="maxPageIndex === pageIndex" @click="handleNext">下一页</m-button>
    </div>
</template>
<script>
export default {
    name: 'm-page',
    emits: ['change'],
    data () {
        return {
            page: this.pageIndex
        }
    },
    props: {
        pageIndex: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 10
        },
        total: {
            type: Number,
            default: 0
        }
    },
    computed: {
        maxPageIndex () {
            return Math.ceil(this.total / this.pageSize)
        }
    },
    methods: {
        handleLast () {
            this.$emit("change", this.pageIndex - 1)
        },
        handleNext () {
            this.$emit("change", this.pageIndex + 1)
        }
    },
}
</script>