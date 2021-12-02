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
        required: {
            type: Boolean,
            default: true
        }
    },
    inject: ['form'],
    created () {
        //this.stop = () => { }
        this.form.addField(this)
        this.evaluateValidationEnabled()
    },
    beforeUnmount () {
        this.form.removeField(this)
        //this.stop()
    },
    watch: {
        required () {
            this.evaluateValidationEnabled()
        }
    },
    methods: {
        evaluateValidationEnabled () {
            let { form, prop } = this
            let { model, rules = {} } = form
            if (this.required && prop) {
                if (!rules[prop]) {
                    debugWarn('Form', `rules [${prop}] is not found !`)
                } else {
                    this.isValidationEnabled = true
                }
                /* this.stop = watch(
                    () => model[prop],
                    (count, prevCount) => {
                        this.validate()
                    }
                ) */
            }
        },
        validate () {
            let { form, prop } = this
            let { model, rules } = form
            let validate = false

            if ((this.isValidationEnabled || rules[prop]) && typeof rules[prop] !== 'function') {
                debugWarn('Form', `rules [${prop}] is not a function !`)
                return false
            }

            if (IsNullOrEmpty(model[prop])) {
                // 必填
                if (this.isValidationEnabled) {
                    validate = false
                    this.msg = this.label + '不可为空'
                    this.error = true
                    return validate
                } else {
                    this.error = false
                    return true
                }
            }

            try {
                validate = true
                if (rules[prop]) {
                    rules[prop](model[prop])
                }
            } catch (error) {
                validate = false
                this.msg = error.message
            }
            this.error = !validate
            return validate
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../styles/variables.less");
.form-item {
    flex: 1;
    display: flex;
    align-items: center;
    margin-bottom: 1.5em;

    .form-item-label {
        width: 3em;
        text-align: right;
        margin-right: 6px;

        &.required::before {
            content: "*";
            position: absolute;
            margin-left: -0.8em;
            color: @ui-danger;
        }
    }

    .form-item-content {
        flex: 1;
    }

    .error {
        :deep(input) {
            border-color: @ui-danger !important;
        }
    }

    .error-msg {
        position: absolute;
        font-size: 0.9em;
        color: @ui-danger;
    }
}

@media screen and (max-width: 600px) {
    .form-item {
        margin: 10px 0 !important;
    }
}
</style>