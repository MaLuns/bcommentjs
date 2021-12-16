<template>
    <transition name="opacity">
        <div v-if="modelValue" class="admin-container">
            <header>
                <ul class="nav-left tabs">
                    <li v-for="item in tabs" :key="item.value" @click="componentName = item.value;" class="tabs-item" :class="{ current: item.value === componentName }">{{ item.label }}</li>
                </ul>
                <div class="nav-right" @click="handleClose">
                    <svg t="1638889864878" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18958" width="20" height="20">
                        <path d="M585.142857 914.285714H219.428571c-58.514286 0-109.714286-51.2-109.714285-109.714285V219.428571c0-58.514286 51.2-109.714286 109.714285-109.714285h365.714286c58.514286 0 109.714286 51.2 109.714286 109.714285v73.142858c0 21.942857-14.628571 36.571429-36.571429 36.571428s-36.571429-14.628571-36.571428-36.571428V219.428571c0-21.942857-14.628571-36.571429-36.571429-36.571428H219.428571c-21.942857 0-36.571429 14.628571-36.571428 36.571428v585.142858c0 21.942857 14.628571 36.571429 36.571428 36.571428h365.714286c21.942857 0 36.571429-14.628571 36.571429-36.571428v-73.142858c0-21.942857 14.628571-36.571429 36.571428-36.571428s36.571429 14.628571 36.571429 36.571428v73.142858c0 58.514286-51.2 109.714286-109.714286 109.714285z" p-id="18959" />
                        <path d="M804.571429 650.971429c-7.314286 0-21.942857 0-29.257143-7.314286-14.628571-14.628571-14.628571-36.571429 0-51.2L855.771429 512l-80.457143-80.457143c-14.628571-14.628571-14.628571-36.571429 0-51.2s36.571429-14.628571 51.2 0l102.4 102.4c14.628571 14.628571 14.628571 36.571429 0 51.2l-102.4 102.4c0 14.628571-14.628571 14.628571-21.942857 14.628572z" p-id="18960" />
                        <path d="M877.714286 548.571429H512c-21.942857 0-36.571429-14.628571-36.571429-36.571429s14.628571-36.571429 36.571429-36.571429h365.714286c21.942857 0 36.571429 14.628571 36.571428 36.571429s-14.628571 36.571429-36.571428 36.571429z" p-id="18961" />
                    </svg>
                </div>
            </header>
            <main>
                <transition name="tt" mode="out-in">
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
export default {
    components: { HomePage, ConfigPage },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            tabs: [
                { label: '首页', value: 'HomePage' },
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
@import url('../../styles/variables.less');
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

    main {
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
