<template>
    <m-model v-model="shows" title="评论审核" :width="500">
        <h4 class="pb-10">@{{ comment.nick }}</h4>
        <textarea v-model="comment.content" rows="5" class="w100p"></textarea>
        <div class="right mt-10">
            <m-button type="primary">通过</m-button>
            <m-button class="ml-10" @click="shows = false;">关闭</m-button>
        </div>
    </m-model>
</template>
<script>
export default {
    name: 'm-audit',
    emits: ['login', 'update:show'],
    props: {
        show: Boolean,
        comment: Object
    },
    data () {
        return {

        }
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
}
</script>