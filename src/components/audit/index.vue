<template>
    <m-modle v-model="shows" title="评论审核" :width="500">
        <h4 class="p-10">@{{ comment.nick }}</h4>
        <textarea v-model="comment.content" rows="5" class="w100p"></textarea>
    </m-modle>
</template>
<script>
import mModle from "../model";
export default {
    components: { mModle },
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