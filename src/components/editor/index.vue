<template>
    <div class="m-editor">
        <!-- <div v-if="$store.config.is_admin"></div> -->
        <MForm ref="form" inline :model="form" :rules="rules" label-width="3.6em">
            <MFormItem :required="isRequired('nick')" prop="nick" label="昵称">
                <input v-model.trim="form.nick" type="text" placeholder="取个昵称吧～" autocomplete="off" @blur="handleBlur">
            </MFormItem>
            <MFormItem :required="isRequired('email')" prop="email" label="邮箱">
                <input v-model.trim="form.email" type="text" placeholder="放心不会泄漏～" autocomplete="off" @blur="handleBlur">
            </MFormItem>
            <MFormItem :required="isRequired('link')" prop="link" label="网站">
                <input v-model.trim="form.link" type="text" placeholder="相信你，不会打广告的~" autocomplete="off" @blur="handleBlur">
            </MFormItem>
        </MForm>
        <div class="m-editor-container" :class="{ 'placeholder-shown': form.content === '' }" placeholder="来都来了，说一句吧～" @keyup.ctrl.enter="handleSubmit">
            <div ref="editor" class="m-editor-instance" contenteditable @drop="handleDrop" @paste="handlePaste" @click="updateLastEditRange" @input="handleInput" />
        </div>
        <div class="m-editor-emojis">
            <div>
                <MEmojis v-if="$store.config.is_show_emoji" @checked="insertAtCaret" />
            </div>
            <div class="m-editor-emojis-btn">
                <MButton v-if="isCancel" type="text" class="my-face" @click="handleCancel">
                    取消回复
                </MButton>
                <template v-if="$store.config.is_use_private && !isCancel">
                    <input id="isPrivate" v-model="form.isPrivate" type="checkbox">
                    <label for="isPrivate" class="ui-checkbox" />
                    <label for="isPrivate">私密评论</label>
                </template>
                <MButton type="text" class="my-face" @click="handleSubmit">
                    发布
                </MButton>
            </div>
        </div>
    </div>
</template>

<script>
import { insertAtCaret, regexp } from '@/util';
import MEmojis from './emojis';

export default {
    name: 'MEditor',
    components: {
        MEmojis,
    },
    props: {
        isCancel: Boolean,
        type: {
            type: String,
            default: 'pl'
        }
    },
    emits: ['cancel', 'sumbit'],
    data () {
        return {
            form: {
                nick: '',
                email: '',
                link: '',
                content: '',
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
    mounted () {
        this.init()
    },
    methods: {
        init () {
            this.lastEditRange = null;
            this.form.content = localStorage.getItem(this.type + '_editor_text') || ''
            let { nick = '', email = '', link = '' } = JSON.parse(localStorage.getItem('user_info') || '{}')
            this.form.nick = nick
            this.form.email = email
            this.form.link = link
            this.$refs.editor.innerText = this.form.content;

            this.RootNode = this.$root.$el.getRootNode()

            this.$watch(
                '$store.user',
                (val) => {
                    let { nick, email } = val || {}
                    if (nick) this.form.nick = nick
                    if (email) this.form.email = email
                },
                { immediate: true, deep: true, }
            )
        },
        // 是否必填
        isRequired (key) {
            return this.$store.config.form[key] || false
        },
        // 存储
        handleBlur () {
            let { nick, email, link, content } = this.form
            localStorage.setItem(this.type + '_editor_text', content)
            localStorage.setItem('user_info', JSON.stringify({ nick, email, link }))
        },
        // 记录光标位置
        updateLastEditRange () {
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
            localStorage.setItem(this.type + '_editor_text', this.form.content)
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
            let data = clipboardData.getData('text')
            this.insertAtCaret(data)
        },
        // 取消回复
        handleCancel () {
            this.$emit('cancel')
        },
        // 提交
        handleSubmit () {
            if (this.form.content.trim().length) {
                if (this.$store.config.is_admin || this.$refs.form.validate()) {
                    this.$emit(
                        'sumbit',
                        { ...this.form },
                        () => {
                            this.$refs.editor.innerText = ''
                            this.form.content = ''
                            localStorage.setItem(this.type + '_editor_text', '')
                        }
                    )
                }
            }
        }
    },
}
</script>