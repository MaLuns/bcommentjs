<template>
    <m-model v-model="shows" title="评论审核" :width="500" :scroll="false">
        <h4 class="pb-10">@{{ comment.nick }}</h4>
        <textarea v-model="content" rows="5" class="w100p"></textarea>
        <div class="right mt-10">
            <m-button type="primary" @click="handlePassAudit">通过</m-button>
            <m-button class="ml-10" @click="shows = false;">关闭</m-button>
        </div>
    </m-model>
</template>
<script>
export default {
    name: 'm-audit',
    emits: ['pass', 'update:show'],
    props: {
        show: Boolean,
        comment: Object
    },
    computed: {
        shows: {
            get () {
                return this.show
            },
            set (val) {
                this.$emit("update:show", val)
            }
        }
    },
    watch: {
        shows: {
            immediate: true,
            handler () {
                this.content = this.comment.content
            }
        }
    },
    data () {
        return {
            content: '',
        }
    },
    methods: {
        handlePassAudit () {
            this.$emit('pass', this.content)
        }
    },
}
</script>