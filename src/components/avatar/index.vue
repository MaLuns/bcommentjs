<template>
    <img class="avatar" :class="shape" :src="src" draggable="false" alt="avatar">
</template>

<script>
export default {
    props: {
        src: String,
        shape: {
            type: String,
            default: 'circle',
            validator (value) {
                return ['circle', 'square'].includes(value)
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import url('../../styles/variables.less');
.avatar {
    width: 40px;
    height: 40px;

    &.circle {
        border-radius: 50%;
    }

    &.square {
        border-radius: @ui-border-radius;
    }
}
</style>