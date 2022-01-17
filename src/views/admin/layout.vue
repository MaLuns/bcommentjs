<template>
    <transition name="opacity">
        <div v-if="modelValue" class="admin-container">
            <header class="header">
                <ul class="nav-left tabs">
                    <template v-for="item in tabs">
                        <li v-if="!item.hide" :key="item.value" @click="componentName = item.value;" class="tabs-item" :class="{ current: item.value === componentName }">{{ item.label }}</li>
                    </template>
                </ul>
                <div class="nav-right" @click="handleClose">
                    <m-icon name="close" width="22"></m-icon>
                </div>
            </header>
            <main class="main">
                <transition name="staggered-fade" mode="out-in">
                    <keep-alive>
                        <component :is="componentName" :key="componentName"></component>
                    </keep-alive>
                </transition>
            </main>
        </div>
    </transition>
</template>
<script>
import HomePage from './pages/homePage.vue'
import ConfigPage from './pages/configPage.vue';
import CommentPage from './pages/commentPage.vue'

export default {
    components: { HomePage, ConfigPage, CommentPage },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            tabs: [
                { label: '首页', value: 'HomePage', hide: window.echarts ? false : true },
                { label: '评论管理', value: 'CommentPage' },
                { label: '配置管理', value: 'ConfigPage' }
            ],
            componentName: 'HomePage',
        };
    },
    methods: {
        handleClose () {
            this.$emit('update:modelValue', false)
        }
    },
};
</script>
<style lang="less" scoped>
@import url("../../styles/variables.less");
.admin-container {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    background-color: #f0f2f5;
    z-index: 99;

    header {
        height: 48px;
        position: relative;
        z-index: 1;
        background-color: @ui-bg;
        box-shadow: 2px 0 4px 0 @ui-shadow;
        padding: 0 1em;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .nav-right {
            line-height: 1;
            cursor: pointer;
            &:hover {
                fill: @ui-link;
            }
        }
    }

    .main {
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1em 1.5em;
        height: calc(100vh - 48px);
    }
}

.tabs {
    .tabs-item {
        display: inline-block;
        list-style: none;
        cursor: pointer;
        margin: 0 10px;
        line-height: 48px;

        &.current {
            color: @ui-link;
            border-bottom: 2px solid @ui-link;
        }

        &:hover {
            color: @ui-link;
        }
    }
}
</style>
