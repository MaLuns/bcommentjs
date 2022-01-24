<template>
    <div ref="emojis" class="m-emoji-panel ">
        <span class="m-emoji-btn my-face" @click="handleShow">
            <m-icon name="emoji" width="26" />
        </span>
        <transition name="opacity">
            <template v-if="first">
                <div v-show="show" class="m-emoji-container" @click="handleCheckEmojis">
                    <ul v-for="item,key in $store.emojis" :key="key" class="m-emoji-items" :class="{ show: key === currentEmoji }">
                        <li v-for="element in item.container" :key="element.text" :data-text="['text', 'emoji'].includes(item.type) ? element.icon : `::${element.text}::`" class="m-emoji-item my-face" :class="[item.type]">
                            <template v-if="['text', 'emoji'].includes(item.type)">
                                {{ element.icon }}
                            </template>
                            <img v-else alt referrerpolicy="no-referrer" :src="element.icon">
                        </li>
                    </ul>
                    <div class="m-emoji-nav" @click.stop>
                        <span v-for="item,key in $store.emojis" :key="key" :class="{ current: key === currentEmoji }" @click="currentEmoji = key;">{{ key }}</span>
                    </div>
                </div>
            </template>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'MEmojis',
    emits: ['checked'],
    data () {
        return {
            first: false,
            show: false,
            currentEmoji: Object.keys(this.$store.emojis)[0],
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
    beforeUnmount () {
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