<template>
    <div class="emoji" ref="emojis">
        <span class="emoji-btn my-face" @click="handleShow">
            <m-icon name="emoji" width="26"></m-icon>
        </span>
        <transition name="opacity">
            <template v-if="first">
                <div v-show="show" class="emoji-container" @click="handleCheckEmojis">
                    <ul v-for="item,key in emojis" :key="key" class="emoji-items" :class="{ show: key === currentEmoji }">
                        <li :data-text="['text', 'emoji'].includes(item.type) ? element.icon : `::${element.text}::`" class="emoji-item my-face" :key="element.text" :class="[item.type]" v-for="element in item.container">
                            <template v-if="['text', 'emoji'].includes(item.type)">{{ element.icon }}</template>
                            <img v-else alt referrerpolicy="no-referrer" :src="element.icon" />
                        </li>
                    </ul>
                    <div class="emoji-nav" @click.stop>
                        <span :class="{ current: key === currentEmoji }" @click="currentEmoji = key;" v-for="item,key  in emojis" :key="key">{{ key }}</span>
                    </div>
                </div>
            </template>
        </transition>
    </div>
</template>
<script>
import { emojis } from "@/emojis";
export default {
    data () {
        return {
            first: false,
            show: false,
            emojis,
            currentEmoji: Object.keys(emojis)[0],
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
            this.show = !this.show;
            this.first = true;
        },
        handleCheckEmojis (e) {
            if (e.target.tagName.toLocaleLowerCase() === 'li') {
                this.$emit('checked', e.target.dataset.text);
                this.show = false;
            }
        }
    },
}
</script>
<style lang="less" scoped>
@import url("../../styles/variables.less");
.emoji {
    position: relative;
    user-select: none;
    .emoji-btn {
        cursor: pointer;
        display: inline-block;
        width: 24px;
        height: 24px;
    }

    .emoji-container {
        background-color: @ui-bg;
        position: absolute;
        z-index: 2;
        width: 330px;
        height: 240px;
        margin-top: 0.5em;
        box-shadow: #6464640d 0px 0px 1px, #6464640d 0px 2px 3px,
            #6464640d 0px 3px 6px, #6464640d 0px 4px 10px,
            #6464640d 0px 5px 15px, #6464640d 0px 6px 21px;
        display: flex;
        flex-direction: column;

        .emoji-nav {
            height: 32px;
            line-height: 32px;
            background-color: @ui-bg;

            span {
                padding: 0 5px;
                display: inline-block;
                cursor: pointer;

                &.current {
                    background-color: @ui-bg-weak;
                }
            }
        }

        .emoji-items {
            flex: 1;
            margin: 0;
            padding: 10px 0 0 10px;
            list-style: none;
            display: none;
            overflow: scroll;

            &.show {
                display: block;
            }

            .emoji-item {
                list-style-type: none;
                background: @ui-aide-bg;
                padding: 5px 10px;
                border-radius: 5px;
                display: inline-block;
                font-size: 12px;
                line-height: 14px;
                margin: 0 10px 12px 0;
                cursor: pointer;
                -webkit-transition: 0.3s;
                transition: 0.3s;

                &.emoji {
                    line-height: 20px;
                    font-size: 20px;
                }

                &.image {
                    :deep(img) {
                        width: 20px;
                        pointer-events: none;
                    }
                }

                &:hover {
                    box-shadow: 0 2px 2px 0 @ui-shadow,
                        0 3px 1px -2px @ui-shadow, 0 1px 5px 0 @ui-light-shadow;
                }
            }
        }
    }
}
</style>