<template>
    <div class="form-item">
        <span class="form-item-label" :class="{ required: isValidationEnabled }" :style="{ width: form.labelWidth }">
            <slot name="title">{{ label }}</slot>
        </span>
        <div class="form-item-content" :class="{ error }">
            <slot></slot>
            <div class="error-msg" v-if="error && msg">{{ msg }}</div>
        </div>
    </div>
</template>
<script>
import { debugWarn, IsNullOrEmpty } from "@/util";
import { watch } from "vue"

export default {
    data () {
        return {
            error: false,
            msg: '', // 错误消息
            isValidationEnabled: false // 是否必填
        }
    },
    props: {
        prop: String,
        label: String,
    },
    inject: ['form'],
    created () {
        this.stop = () => { }
        this.form.addField(this)
        this.evaluateValidationEnabled()
    },
    beforeUnmount () {
        this.stop()
    },
    methods: {
        evaluateValidationEnabled () {
            let { form, prop } = this
            let { model, rules } = form
            if (!!(rules && prop && rules[prop])) {
                this.isValidationEnabled = true
                this.stop = watch(
                    () => model[prop],
                    (count, prevCount) => {
                        this.validate()
                    }
                )
            }
        },
        validate () {
            let { form, prop } = this
            let { model, rules } = form
            if (!this.isValidationEnabled) {
                return true
            }
            let validate = false
            if (typeof rules[prop] !== 'function') {
                debugWarn('Form', `rules [${prop}] is not a function !`)
                return false
            }
            try {
                if (!IsNullOrEmpty(model[prop])) {
                    validate = rules[prop](model[prop])
                } else {
                    validate = false
                    this.msg = this.label + '不可为空'
                }
            } catch (error) {
                this.msg = error.message
                validate = false
            }
            this.error = !validate
            return validate
        }
    }
}
</script>

<style lang="less" scoped>
.form-item {
    flex: 1;
    border-radius: 3px;
    display: flex;
    align-items: center;
    margin-bottom: 1.2em;

    .form-item-label {
        width: 3em;
        text-align: right;
        font-size: 0.9em;
        margin-right: 6px;

        &.required::before {
            content: "*";
            color: red;
            position: absolute;
            margin-left: -0.8em;
        }
    }

    ::-webkit-input-placeholder,
    :-moz-placeholde,
    ::-moz-placeholder,
    :-ms-input-placeholder {
        color: var(--color-meta, #c5c5c5);
    }

    &:focus,
    &:focus-within,
    &:focus-visible {
        border-color: rgb(0, 140, 255);
    }

    .form-item-content {
        flex: 1;

        :deep(input) {
            box-sizing: border-box;
            background: transparent;
            padding: 0 0.5em;
            width: 100%;
            height: 2.8em;
            border: 0.5px solid #eee;
            border-radius: 4px;

            &:focus {
                outline-offset: 0px;
                outline: none;
                border-color: rgb(0, 140, 255);
            }
        }
    }

    .error {
        :deep(input) {
            border-color: red !important;
        }
    }

    .error-msg {
        position: absolute;
        font-size: 0.8em;
        color: red;
    }
}

@media screen and (max-width: 600px) {
    .form-item {
        margin: 10px 0 !important;
    }
}
</style>