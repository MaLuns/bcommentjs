<template>
    <div class="skeleton" :class="type"></div>
</template>
<script>
export default {
    name: "m-skeleton",
    props: {
        type: {
            type: String,
            default: 'text'
        }
    }
}
</script>
<style lang="less">
.skeleton {
    display: inline-block;
    height: 16px;
    width: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;

    &.circle {
        border-radius: 50%;
    }
}
@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>