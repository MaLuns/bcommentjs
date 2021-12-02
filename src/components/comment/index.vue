<template>
    <div class="comment-list">
        <transition-group name="list" @enter="enter">
            <m-item v-for="(item,index) in list" :key="item.id" :comment="item" :data-index="index"></m-item>
        </transition-group>
    </div>
</template>

<script>
import mItem from './item.vue'

export default {
    components: {
        mItem
    },
    props: {
        list: Array
    },
    computed: {
        len () {
            return this.list.length
        }
    },
    watch: {
        len () {
            this.i = 0
        }
    },
    created () {
        this.i = 0
    },
    methods: {
        enter (el, done) {
            let delay = this.i * 100
            this.i++
            setTimeout(() => {
                el.style.opacity = 1
                el.style.animation = 'one-in 0.4s infinite'
                el.style['animation-iteration-count'] = 1
                done()
            }, delay)
        },
    },
}
</script>
<style lang="less" scoped>
@import url("../../styles/variables.less");
.comment-list {
    > h3 {
        text-align: center;
    }
}
.list-enter-active {
    opacity: 0;
    transition: opacity @ui-transition-duration;
}
</style>
<style>
@keyframes one-in {
    from {
        transform: translateY(100px);
    }
    to {
        transform: translateY(0);
    }
}
</style>