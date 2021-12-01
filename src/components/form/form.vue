<template>
    <div class="form" :class="{ inline }">
        <slot></slot>
    </div>
</template>
<script>
import { debugWarn } from "@/util";

export default {
    data () {
        return {
            fields: []
        }
    },
    props: {
        // 行内模式
        inline: Boolean,
        model: Object,
        // 校验规则
        rules: {
            type: Object,
            default () {
                return {}
            }
        },
        // label 宽度
        labelWidth: {
            type: String,
            default: '3em'
        },
    },
    provide () {
        const form = {
            addField: this.addField,
            removeField: this.removeField,
            rules: this.rules,
            model: this.model,
            labelWidth: this.labelWidth
        }
        return { form }
    },
    methods: {
        addField (field) {
            if (field) {
                this.fields.push(field)
            }
        },
        removeField (field) {
            if (field.prop) {
                this.fields.splice(this.fields.indexOf(field), 1)
            }
        },
        validate () {
            if (!this.model) {
                debugWarn('Form', 'model is required for validate to work!')
                return false
            }
            if (this.fields.length === 0) {
                return true;
            }

            let count = 0
            this.fields.forEach(field => {
                if (field.validate()) count++
            });
            return count === this.fields.length
        }
    }
}
</script>
<style lang="less" scoped>
.form {
    display: block;

    &.inline {
        display: flex;
        justify-content: space-around;

        :deep(.form-item) {
            + .form-item {
                margin: 0 0 1.2em 0.8em;
            }
        }
    }
}

@media screen and (max-width: 600px) {
    .form {
        display: block;
    }
}
</style>