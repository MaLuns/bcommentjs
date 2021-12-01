<template>
    <img class="avatar" :class="shape" :src="src">
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
.avatar {
    width: 40px;
    height: 40px;

    &.circle {
        border-radius: 50%;
    }

    &.square {
        border-radius: 4px;
    }
}
</style>