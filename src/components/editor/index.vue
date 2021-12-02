<template>
    <div class="comment-editor">
        <m-form ref="form" inline :model="form" :rules="rules">
            <m-form-item :required="isRequired('nick')" prop="nick" label="昵称">
                <input @blur="handleBlur" v-model.trim="form.nick" type="text" placeholder="取个昵称吧～" autocomplete="off" />
            </m-form-item>
            <m-form-item :required="isRequired('email')" prop="email" label="邮箱">
                <input @blur="handleBlur" v-model.trim="form.email" type="text" placeholder="放心不会泄漏～" autocomplete="off" />
            </m-form-item>
            <m-form-item :required="isRequired('link')" prop="link" label="网站">
                <input @blur="handleBlur" v-model.trim="form.link" type="text" placeholder="相信你，不会打广告的~" autocomplete="off" />
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
                <template v-if="!isCancel">
                    <input v-model="form.isPrivate" id="check" type="checkbox" class="checkbox-input" />
                    <label for="check">私密评论</label>
                </template>
                <m-button type="text" v-if="isCancel" @click="handleCancel">取消</m-button>
                <m-button class="mgl10" type="primary" @click="handleSubmit">提交</m-button>
            </div>
        </div>
    </div>
</template>

<script>
import { emojis } from "@/emojis";
import { insertAtCaret, regexp } from "@/util";
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
                content: "",
                isPrivate: false
            },
            rules: {
                nick: (val) => {
                    if (!regexp.nick.test(val))
                        throw new Error('昵称只能为中文字符数字组成')
                },
                email: (val) => {
                    if (!regexp.email.test(val))
                        throw new Error('请填写正确邮箱')
                },
                link: (val) => {
                    if (!regexp.link.test(val))
                        throw new Error('请填写正确站点(http|https)')
                }
            },
            emojis
        }
    },
    props: {
        isCancel: Boolean
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.form.content = localStorage.getItem('editor_text') || ''
            let { nick = '', email = '', link = '' } = JSON.parse(localStorage.getItem('user_info') || '{}')
            this.form.nick = nick
            this.form.email = email
            this.form.link = link
            this.$refs.editor.innerText = this.form.content;
        },
        // 是否必填
        isRequired (key) {
            return this.$root.config.form[key] || false
        },
        // 存储
        handleBlur () {
            let { nick, email, link } = this.form
            localStorage.setItem('user_info', JSON.stringify({ nick, email, link }))
        },
        // 记录光标位置
        updateLastEditRange () {
            this.lastEditRange = this.$root.$el.getRootNode().getSelection().getRangeAt(0)
        },
        handleInput ($event) {
            this.form.content = $event.target.innerText;
            localStorage.setItem('editor_text', this.form.content)
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
                    localStorage.setItem('editor_text', '')
                })
            }
        }
    },
}
</script>

<style lang="less" scoped>
@import url("../../styles/variables.less");
label {
    user-select: none;
    font-size: 0.9em;
    margin-right: 10px;
    font-weight: 400;
}
.comment-editor {
    padding: 5px 0 0;

    // 编辑框
    .editor-container {
        display: block;
        padding: 10px;
        margin-bottom: 10px;
        border: 0.5px solid @ui-form-control-line;
        border-radius: @ui-border-radius;
        transition: all @ui-transition-duration;

        &.placeholder-shown::before {
            content: attr(placeholder);
            position: absolute;
            pointer-events: none;
            color: @ui-aide-text;
            font-size: 0.9em;
            letter-spacing: 1px;
        }

        &:hover {
            border-color: @ui-form-control-line-hover;
        }

        &:focus,
        &:focus-within {
            outline-offset: 0px;
            outline: none;
            border-color: @ui-form-control-line-active;
            &.placeholder-shown::before {
                display: none;
            }
        }

        .editor {
            vertical-align: baseline;
            outline: none;
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
.mgl10 {
    margin-left: 10px;
}
</style>