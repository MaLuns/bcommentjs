<template>
    <div class="card">
        <div class="header">
            <div class="title">{{ title }}</div>
        </div>
        <div class="body">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import Login from "../login/index.vue";
export default {
    props: {
        title: {
            type: String,
            default: "xxxx"
        }
    },
    components: { Login }
}
</script>
<style lang="less" scoped>
@import url("../../styles/variables.less");
.card {
    overflow: hidden;
    border-radius: @ui-border-radius-card;
    box-shadow: 0 2px 1em 0 #0000001a;
    background: @ui-global-bg-normal;
    border-radius: @ui-border-radius;

    .header {
        border-bottom: 0.5px solid @ui-border-line;
        padding: 0 1em;
        display: flex;
        align-items: center;
        user-select: none;

        .title {
            font-size: @ui-font-size-card-title;
            line-height: 2.6em;
            flex: 1;
        }
    }

    .body {
        padding: 1.2em 1.6em;
    }
}
</style>