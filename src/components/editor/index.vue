<template>
    <div class="comment-editor">
        <m-form ref="form" inline :model="form" :rules="rules">
            <m-form-item prop="nick" label="昵称">
                <input v-model.trim="form.nick" type="text" placeholder="取个昵称吧～" autocomplete="off" />
            </m-form-item>
            <m-form-item prop="email" label="邮箱">
                <input v-model.trim="form.email" type="text" placeholder="放心不会泄漏～" autocomplete="off" />
            </m-form-item>
            <m-form-item label="网站">
                <input v-model.trim="form.link" type="text" placeholder="相信你，不会打广告的" autocomplete="off" />
            </m-form-item>
        </m-form>
        <div class="editor-container" :class="{ 'placeholder-shown': form.content === '' }" placeholder="来都来了，说一句吧～">
            <div ref="editor" class="editor" contenteditable @paste="handlePaste" @click="updateLastEditRange" @input="handleInput"></div>
        </div>
        <div class="emojis-btn">
            <div class="display: inherit;">
                <m-emojis v-for="(item,index) in emojis" :key="index" :emoji="item" @checked="handleChecked"></m-emojis>
            </div>
            <div class="btn-container">
                <m-button type="dashed" v-if="isCancel" @click="handleCancel">取消</m-button>
                <m-button type="primary" @click="handleSubmit">提交</m-button>
            </div>
        </div>
    </div>
</template>

<script>
import { emojis } from "@/emojis";
import { insertAtCaret } from "@/util";
import mEmojis from "./emojis";
import mForm from "+/form/form";
import mFormItem from "+/form/formItem";
import mButton from "+/button"

export default {
    components: {
        mEmojis,
        mForm,
        mFormItem,
        mButton
    },
    data () {
        return {
            lastEditRange: null,
            form: {
                nick: "",
                email: "",
                link: "",
                content: ""
            },
            rules: {
                nick: (val) => /^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(val),
                email: (val) => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)
            },
            emojis
        }
    },
    props: {
        isCancel: Boolean
    },
    created () {
        this.content = localStorage.getItem('content') || ''
    },
    methods: {
        // 记录光标位置
        updateLastEditRange () {
            this.lastEditRange = this.$root.$el.getRootNode().getSelection().getRangeAt(0)
        },
        handleInput ($event) {
            this.form.content = $event.target.innerText;
            localStorage.setItem('content', this.form.content)
            this.updateLastEditRange()// 重新获取光标位置
        },
        // 取消
        handleCancel () {
            this.$emit('cancel')
        },
        // 插入表情
        handleChecked (text) {
            this.insertAtCaret(text)
            this.form.content = this.$refs.editor.innerText;
        },
        insertAtCaret (text) {
            this.lastEditRange = insertAtCaret(this.$refs.editor, text, this.$root.$el.getRootNode(), this.lastEditRange)
        },
        // 粘贴
        handlePaste (e) {
            e.preventDefault();
            let clipboardData = e.clipboardData
            // 获取剪切板文本信息，TODO 图片上传图床
            let data = clipboardData.getData("text")
            this.insertAtCaret(data)
        },
        // 提交
        handleSubmit () {
            if (this.$refs.form.validate()) {
                this.$root.addComments({ ...this.form }, () => {
                    this.form.content = ''
                    localStorage.setItem('content', '')
                })
            }
        }
    },
}
</script>

<style lang="less" scoped>
.comment-editor {
    margin-top: 10px;
    padding: 5px 0 0;
    transition: all var(--transitionTime, 0.3s ease);

    // 编辑框
    .editor-container {
        border: 0.5px solid #eee;
        border-radius: 3px;
        margin-bottom: 10px;
        padding: 10px;
        display: block;

        &.placeholder-shown::before {
            content: attr(placeholder);
            color: #99a2aa;
            position: absolute;
            pointer-events: none;
            font-size: 14px;
            line-height: 22px;
            letter-spacing: 1px;
        }

        &:focus,
        &:focus-within {
            &.placeholder-shown::before {
                display: none;
            }
        }

        .editor {
            vertical-align: baseline;
            outline: none;
            font-size: 14px;
            line-height: 22px;
            letter-spacing: 1px;
            box-sizing: border-box;
            background: transparent;
            overflow: hidden;
            resize: none;
            border: none;
            width: 100%;
            min-height: 100px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    }

    .emojis-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>