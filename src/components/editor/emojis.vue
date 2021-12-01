<template>
    <div class="nav" ref="emojis">
        <div @click="handleShow" class="emojis-nav">
            <img :src="emoji.url" alt referrerpolicy="no-referrer" />
        </div>
        <template v-if="first">
            <div class="emojis-scroll" v-show="show" @click.stop>
                <div class="emojis-list" @click="handleCheckEmojis">
                    <i v-for="(item,index) in emoji.emote" :key="index" :data-text="item.text">
                        <img :src="item.gif_url || item.url" alt referrerpolicy="no-referrer" :data-text="item.text" />
                    </i>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    props: {
        emoji: Object
    },
    data () {
        return {
            first: false,
            show: false
        }
    },
    mounted () {
        this.fun = (e) => {
            if (e.target !== this.$root.$el.getRootNode().host) {
                this.show = false
            }
        }
        this.fun2 = (e) => {
            if (this.$refs.emojis && !this.$refs.emojis.contains(e.target)) {
                this.show = false
            }
        }
        document.addEventListener('click', this.fun)
        // document 事件的 target 是自定义元素本身,不会到自定义元素内部去,需要在自定义元素类在做一次监听
        this.$root.$el.addEventListener('click', this.fun2)
    },
    beforeDestroy () {
        document.removeEventListener('click', this.fun)
        this.$root.$el.removeEventListener('click', this.fun2)
    },
    methods: {
        handleShow () {
            this.show = true;
            this.first = true;
        },
        handleCheckEmojis (e) {
            this.$emit('checked', e.target.dataset.text);
        }
    },
}
</script>
<style lang="less" scoped>
.nav {
    position: relative;
    display: inline-block;
    user-select: none;
    margin-left: 10px;

    .emojis-nav {
        cursor: pointer;
        width: 32px;
        height: 32px;

        img {
            width: 100%;
        }
    }

    .emojis-scroll {
        background: #fff;
        position: absolute;
        z-index: 2;
        width: 290px;
        height: 160px;
        padding: 0.5em;
        overflow: hidden;
        margin-top: 0.5em;
        box-shadow: #6464640d 0px 0px 1px, #6464640d 0px 2px 3px,
            #6464640d 0px 3px 6px, #6464640d 0px 4px 10px,
            #6464640d 0px 5px 15px, #6464640d 0px 6px 21px;
    }

    .emojis-list {
        width: 320px;
        height: 160px;
        overflow: auto;
        cursor: pointer;

        i,
        img {
            text-align: center;
            width: 32px;
            height: 32px;
        }
    }
}
</style>