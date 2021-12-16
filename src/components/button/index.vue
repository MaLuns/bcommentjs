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
                return ['default', 'primary', 'error', 'text'].includes(value)
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
@import url('../../styles/variables.less');
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

    &.long {
        width: 100%;
    }

    &:focus {
        box-shadow: 0 0 0 2px @ui-light-shadow;
    }

    &.default {
        color: @ui-text-weak;
        background-color: @ui-bg;
        border-color: @ui-border-line;

        &:hover,
        &:active {
            color: @ui-info-weak;
            border-color: @ui-info-weak;
        }
    }

    &.primary {
        color: @ui-text-inversion;
        background-color: @ui-info;
        border-color: @ui-info;

        &:hover,
        &:active {
            background-color: @ui-info-weak;
            border-color: @ui-info-weak;
        }
    }

    &.error {
        color: @ui-text-inversion;
        background-color: @ui-danger;
        border-color: @ui-danger;

        &:hover,
        &:active {
            background-color: @ui-danger-weak;
            border-color: @ui-danger-weak;
        }
    }

    &.text {
        color: @ui-text-weak;
        background-color: transparent;
        border-color: transparent;
        padding: 0 5px;

        &:hover,
        &:active {
            color: @ui-info-weak;
        }

        &:focus {
            box-shadow: none;
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