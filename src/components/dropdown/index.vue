<template>
    <div class="dropdown">
        <slot></slot>
        <ul class="dropdown-menu">
            <slot name="items">
                <li class="dropdown-menu-item" v-for="item,key in menu" :key="key" @click="handleMenuItem(item)">{{ item.label }}</li>
            </slot>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'm-dropdown',
    emits: ['item-click'],
    props: {
        menu: Array
    },
    methods: {
        handleMenuItem (item) {
            this.$emit('item-click', item)
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../styles/variables.less");
.dropdown {
    display: inline-block;
    position: relative;
    z-index: 1;

    :deep(.dropdown-menu) {
        padding: 10px 0;
        position: absolute;
        list-style: none;
        width: max-content;
        cursor: pointer;
        box-shadow: 0 1px 6px @ui-shadow;
        background-color: @ui-bg;
        border-radius: @ui-border-radius-card;
        transition: opacity @ui-transition-duration;
        opacity: 0;
        top: -99999px;
        z-index: -1;

        .dropdown-menu-item {
            display: block;
            padding: 8px 16px;
            transition: all @ui-transition-duration;

            &:hover {
                background-color: @ui-dropdown-menu-item;
                color: @ui-dropdown-menu-item-color;
            }
        }
    }

    &:hover {
        .dropdown-menu {
            opacity: 1;
            top: auto;
        }
    }
}
</style>