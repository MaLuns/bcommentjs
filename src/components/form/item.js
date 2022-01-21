import { debugWarn, IsNullOrEmpty } from "@/util";

export default {
    name: 'm-form-item',
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
    render () {
        return (
            <div>
                <div class="m-form-item">
                    <span class="m-form-item-label" class={{ required: this.isValidationEnabled }} style={{ width: this.form.labelWidth }}>
                        {this.$slots.title ? this.$slots.title() : this.label}
                    </span>
                    <div class="m-form-item-content" class={{ error: this.error }}>
                        {this.$slots.default?.()}
                    </div>
                </div>
                {this.error && this.msg ? <div class="error-msg" style={{ paddingLeft: this.form.labelWidth }} >{this.msg}</div> : null}
            </div>
        )
    },
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