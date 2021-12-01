<template>
    <div class="message">
        <transition-group name="list">
            <div class="message-item" v-for="item in list" :key="item.id">
                <span class="tag" :class="item.type"></span>
                <span class="title">{{ item.text }}</span>
            </div>
        </transition-group>
    </div>
</template>
<script>
import { appendStyle } from '@/util'

export default {
    data () {
        return {
            list: []
        }
    },
    methods: {
        add (element) {
            let item = {
                id: this.id,
                ...element
            }
            this.id++
            this.list.push(item)
            return item.id
        },
        remove (id) {
            this.list = this.list.filter(item => item.id !== id)
        }
    },
    created () {
        this.id = 0
        appendStyle(this.$options.styles[0])
    },
}
</script>
<style lang="less" scoped>
.message {
    z-index: 999;
    position: fixed;
    top: 30px;
    pointer-events: none;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .message-item {
        margin-top: 10px;
        width: max-content;
        padding: 8px 16px;
        border-radius: 4px;
        box-shadow: 0 1px 6px #00000033;
        background: #fff;
        line-height: 1.5;
        display: flex;
        align-items: center;
        font-size: 14px;
        transition: all 0.3s ease;
        // transform: translateY(0);
        // transition: transform 0.3s ease, opacity 0.3s ease;

        .title {
            color: #515a6e;
        }

        .tag {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .info {
            background-color: #19be6b;
        }

        .warning {
            background-color: #f90;
        }

        .error {
            background-color: #ed4014;
        }
    }
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
.list-leave-active {
    position: absolute;
}
</style>