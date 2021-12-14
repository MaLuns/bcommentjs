<template>
    <div class="comment-editor">
        <m-form ref="form" inline :model="form" :rules="rules" labelWidth="3.6em">
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
            <div ref="editor" class="editor" contenteditable @drop="handleDrop" @paste="handlePaste" @click="updateLastEditRange" @input="handleInput"></div>
        </div>
        <div class="emojis-btn">
            <m-emojis @checked="insertAtCaret"></m-emojis>
            <div class="btn-container">
                <template v-if="!isCancel">
                    <input v-model="form.isPrivate" id="isPrivate" type="checkbox" />
                    <label for="isPrivate" class="ui-checkbox"></label>
                    <label for="isPrivate">私密评论</label>
                </template>
                <m-button type="text" class="my-face" v-if="isCancel" @click="handleCancel">取消回复</m-button>
                <m-button type="text" class="my-face" @click="handleSubmit">发布</m-button>
            </div>
        </div>
    </div>
</template>

<script>
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
            }
        }
    },
    props: {
        isCancel: Boolean
    },
    mounted () {
        this.init()
    },
    watch: {
        '$root.user': {
            deep: true,
            handler (val) {
                let { nick, email } = val
                if (nick) this.form.nick = nick
                if (email) this.form.email = email
            }
        }
    },
    methods: {
        init () {
            this.lastEditRange = null;
            this.form.content = localStorage.getItem('editor_text') || ''
            let { nick = '', email = '', link = '' } = JSON.parse(localStorage.getItem('user_info') || '{}')
            this.form.nick = nick
            this.form.email = email
            this.form.link = link
            this.$refs.editor.innerText = this.form.content;

            this.RootNode = this.$root.$el.getRootNode()
        },
        // 是否必填
        isRequired (key) {
            return this.$root.config.form[key] || false
        },
        // 存储
        handleBlur () {
            let { nick, email, link, content } = this.form
            localStorage.setItem('editor_text', content)
            localStorage.setItem('user_info', JSON.stringify({ nick, email, link }))
        },
        // 记录光标位置
        updateLastEditRange (e) {
            if (this.RootNode.getSelection) {
                this.lastEditRange = this.RootNode.getSelection().getRangeAt(0)
            }
        },
        // 禁止拖拽输入
        handleDrop (e) {
            e.preventDefault();
        },
        // 输入
        handleInput ($event) {
            this.form.content = $event.target.innerText;
            this.updateLastEditRange()// 重新获取光标位置
        },
        // 插入表情
        insertAtCaret (text) {
            if (this.RootNode.getSelection) {
                this.lastEditRange = insertAtCaret(this.$refs.editor, text, this.RootNode, this.lastEditRange)
            } else {
                // fix: 对不支持 ShadowRoot.getSelection() ，插入到末尾
                this.$refs.editor.appendChild(document.createTextNode(text))
            }
            this.form.content = this.$refs.editor.innerText;
        },
        // 粘贴
        handlePaste (e) {
            e.preventDefault();
            let clipboardData = e.clipboardData
            // 获取剪切板文本信息，TODO 图片上传图床
            let data = clipboardData.getData("text")
            this.insertAtCaret(data)
        },
        // 取消回复
        handleCancel () {
            this.$emit('cancel')
        },
        // 提交
        handleSubmit () {
            if (this.$refs.form.validate() && this.form.content.trim().length) {
                this.$root.addComments({ ...this.form }, () => {
                    this.$refs.editor.innerText = ''
                    this.form.content = ''
                    localStorage.setItem('editor_text', '')
                })
            }
        }
    },
}
</script>

<style lang="less" scoped>
@import url('../../styles/variables.less');
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

        .btn-container {
            display: flex;
            align-items: center;
        }
    }
}
.mgl10 {
    margin-left: 10px;
}
</style>