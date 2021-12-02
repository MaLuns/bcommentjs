<template>
    <button type="button" class="btn" :class="{ [type]: type, long }" :disabled="disabled" @click="handleClick">
        <slot></slot>
    </button>
</template>

<script>
export default {
    emits: ['click'],
    props: {
        disabled: Boolean,
        long: Boolean,
        type: {
            type: String,
            default: 'default',
            validator (value) {
                return ['default', 'primary', 'error', 'dashed', 'text'].includes(value)
            }
        },
    },
    methods: {
        handleClick () {
            if (!this.disabled)
                this.$emit('click')
        }
    },
}
</script>

<style lang="less" scoped>
@import url("../../styles/variables.less");
.btn {
    display: inline-block;
    margin-bottom: 0;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height: 2.2em;
    padding: 0 15px;
    border-radius: 4px;
    transition: color @ui-transition-duration,
        background-color @ui-transition-duration, border @ui-transition-duration,
        box-shadow @ui-transition-duration;
    color: #515a6e;
    background-color: #fff;
    border-color: @ui-border-line;

    &:hover,
    &:active {
        color: #57a3f3;
        background-color: #fff;
        border-color: #57a3f3;
    }

    &.long {
        width: 100%;
    }

    &:focus {
        box-shadow: 0 0 0 2px #2d8cf033;
    }

    &.primary {
        color: #fff;
        background-color: #2d8cf0;
        border-color: #2d8cf0;

        &:hover,
        &:active {
            background-color: #57a3f3;
            border-color: #57a3f3;
        }
    }

    &.error {
        color: #fff;
        background-color: #ed4014;
        border-color: #ed4014;

        &:hover,
        &:active {
            background-color: #f16643;
            border-color: #f16643;
        }
    }

    &.dashed {
        color: #515a6e;
        background-color: #fff;
        border-color: #dcdee2;
        border-style: dashed;

        &:hover,
        &:active {
            color: #57a3f3;
            background-color: #fff;
            border-color: #57a3f3;
        }
    }

    &.text {
        color: #515a6e;
        background-color: #0000;
        border-color: #0000;

        &:hover,
        &:active {
            color: #57a3f3;
            background-color: #fff;
            border-color: #0000;
        }
    }

    &[disabled] {
        cursor: not-allowed;
        color: #c5c8ce !important;
        background-color: #f7f7f7 !important;
        border-color: #dcdee2 !important;
    }
}
</style>