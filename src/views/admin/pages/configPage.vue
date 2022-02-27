<template>
    <div class="config-page">
        <MForm ref="form" :model="config" label-width="6em">
            <MFormItem>
                <h2>评论配置</h2>
            </MFormItem>
            <MFormItem label="博客地址">
                <input v-model.trim="config.site_url" class="w200" type="text" placeholder="站点地址" autocomplete="off">
                <p class="tip">
                    用于消息推送使用
                </p>
            </MFormItem>
            <MFormItem label="博客名称">
                <input v-model.trim="config.site_name" class="w200" type="text" placeholder="站点名称" autocomplete="off">
                <p class="tip">
                    用于消息推送使用
                </p>
            </MFormItem>
            <MFormItem label="博客logo">
                <input v-model.trim="config.site_logo" class="w200" type="text" placeholder="博客logo" autocomplete="off">
                <p class="tip">
                    为空，默认使用邮箱的Gavatar
                </p>
            </MFormItem>
            <MFormItem label="博主昵称">
                <input v-model.trim="config.nick" class="w200" type="text" placeholder="站点名称" autocomplete="off">
                <p class="tip">
                    用于评论时，显示昵称，如果为空则仅显示标识
                </p>
            </MFormItem>
            <MFormItem label="评论标识">
                <input v-model.trim="config.tag" class="w200" type="text" placeholder="博主评论标识" autocomplete="off">
                <p class="tip">
                    用于标识为博主评论，如果为空默认为‘博主’
                </p>
            </MFormItem>
            <MFormItem label="个人限流">
                <input v-model.number="config.limit_per_minute_user" class="w200" step="1" min="0" type="number" placeholder="个人限流" autocomplete="off">
                <p class="tip">
                    每个人10分钟内留言条数，为0时关闭
                </p>
            </MFormItem>
            <MFormItem label="全部限流">
                <input v-model.number="config.limit_thirty_minute_all" class="w200" step="1" min="0" type="number" placeholder="全部限流" autocomplete="off">
                <p class="tip">
                    所有人30分钟内留言条数，为0时关闭
                </p>
            </MFormItem>
            <MFormItem label="评论审核">
                <div class="w200 inline">
                    <input id="is_audit" v-model="config.is_audit" type="checkbox">
                    <label for="is_audit" class="ui-switch"></label>
                </div>
                <p class="tip">
                    开启后，评论需要博主审核通过后才显示
                </p>
            </MFormItem>
            <MFormItem label="私密评论">
                <div class="w200 inline">
                    <input id="is_use_private" v-model="config.is_use_private" type="checkbox">
                    <label for="is_use_private" class="ui-switch"></label>
                </div>
                <p class="tip">
                    开启后，允许用户私密留言评论
                </p>
            </MFormItem>
            <MFormItem label="必填项">
                <div class="w200 inline">
                    <input id="form_nick" v-model="config.form.nick" type="checkbox">
                    <label for="form_nick" class="ui-checkbox"></label>
                    <label for="form_nick">昵称</label>
                    <input id="form_email" v-model="config.form.email" type="checkbox">
                    <label for="form_email" class="ui-checkbox"></label>
                    <label for="form_email">邮箱</label>
                    <input id="form_link" v-model="config.form.link" type="checkbox">
                    <label for="form_link" class="ui-checkbox"></label>
                    <label for="form_link">网址</label>
                </div>
                <p class="tip">
                    用于控制评论必填项
                </p>
            </MFormItem>
            <MFormItem label="Gavatar">
                <input v-model.trim="config.gavatar_url" class="w200" type="text" placeholder="gavatar头像地址配置" autocomplete="off">
                <p class="tip">
                    配置Gavatar镜像地址，$hash会被替换成用户id
                </p>
            </MFormItem>
            <MFormItem label="QQ头像">
                <div class="w200 inline">
                    <input id="is_use_qq_avatar" v-model="config.is_use_qq_avatar" type="checkbox">
                    <label for="is_use_qq_avatar" class="ui-switch"></label>
                </div>
                <p class="tip">
                    开启后，将优先使用qq头像作为用户头像
                </p>
            </MFormItem>
            <MFormItem label="显示已删除">
                <div class="w200 inline">
                    <input id="is_show_deleted" v-model="config.is_show_deleted" type="checkbox">
                    <label for="is_show_deleted" class="ui-switch"></label>
                </div>
                <p class="tip">
                    开启后，将显示已删除评论
                </p>
            </MFormItem>
            <MFormItem label="开启表情包">
                <div class="w200 inline">
                    <input id="is_show_emoji" v-model="config.is_show_emoji" type="checkbox">
                    <label for="is_show_emoji" class="ui-switch"></label>
                </div>
                <p class="tip">
                    开启后，可使用表情包评论
                </p>
            </MFormItem>
            <MFormItem label="navigator">
                <div class="w200 inline">
                    <input id="is_show_browser" v-model="config.is_show_browser" type="checkbox">
                    <label for="is_show_browser" class="ui-switch"></label>
                </div>
                <p class="tip">
                    开启后，显示用户浏览器标识信息
                </p>
            </MFormItem>
            <MFormItem>
                <h2>邮件配置</h2>
            </MFormItem>
            <MFormItem label="SMTP地址">
                <input v-model.trim="config.smtp_host" class="w200" type="text" placeholder="SMTP服务地址" autocomplete="off">
                <p class="tip">
                    例如：腾讯企业邮箱为 smtp.exmail.qq.com
                </p>
            </MFormItem>
            <MFormItem label="SMTP端口">
                <input v-model.trim="config.smtp_port" class="w200" type="text" placeholder="SMTP端口" autocomplete="off">
                <p class="tip">
                    例如：腾讯企业邮箱为 465
                </p>
            </MFormItem>
            <MFormItem label="SMTP邮箱">
                <input v-model.trim="config.sender_email" class="w200" type="text" placeholder="SMTP邮箱" autocomplete="off">
                <p class="tip">
                    用于消息推送使用
                </p>
            </MFormItem>
            <MFormItem label="SMTP密钥">
                <input v-model.trim="config.sender_pass" class="w200" type="text" placeholder="SMTP密钥" autocomplete="off">
                <p class="tip">
                    邮箱对应密码或者密钥，建议使用密钥
                </p>
            </MFormItem>
            <MFormItem label="自定义模版">
                <div class="w200 inline">
                    <input id="is_email_template" v-model="config.is_email_template" type="checkbox">
                    <label for="is_email_template" class="ui-switch"></label>
                </div>
                <p class="tip">
                    开启后，使用自定义邮件模版
                </p>
            </MFormItem>
            <MFormItem v-if="config.is_email_template" label>
                <!-- <input class="w200" v-model.trim="config.sender_email" type="" placeholder="SMTP邮箱" autocomplete="off" /> -->
                <textarea v-model.trim="config.email_template_ejs" class="w200" rows="7" cols></textarea>
                <p class="tip">
                    自定义模版，使用ejs解析，注入参数
                    <br>siteName：站点名称
                    <br>siteLogo：站点LOGO
                    <br>title：文章标题
                    <br>href：文章链接
                    <br>type：类型 1 发送给其他用户的，2 发送给博主的
                    <br>nick：评论人昵称
                    <br>datetime：评论时间
                    <br>content：评论内容
                    <br>
                </p>
            </MFormItem>
            <MFormItem label="发件人">
                <input v-model.trim="config.sender_name" class="w200" type="text" placeholder="发件人" autocomplete="off">
                <p class="tip">
                    如果为空，则默认为：博客名称&lt;邮箱&gt;
                </p>
            </MFormItem>
            <MFormItem label="主题">
                <input v-model.trim="config.subject" class="w200" type="text" placeholder="邮件主题" autocomplete="off">
                <p class="tip">
                    如果为空，则默认为：【博客名称】收到新的留言 或 您在【博客名称】收到新的回复
                </p>
            </MFormItem>
            <MFormItem>
                <m-button type="primary" @click="handleSave">
                    保存
                </m-button>
                <m-button type="text" @click="handleTestEmail">
                    邮箱测试
                </m-button>
            </MFormItem>
        </MForm>
    </div>
</template>
<script>
import tcb from '@/tcb'
import { IsNullOrEmpty } from '@/util';

export default {
    data () {
        return {
            config: {
                form: {
                    email: true,
                    link: false,
                    nick: true,
                },
            }
        }
    },
    watch: {
        '$store.config' (newVal) {
            this.config = newVal
        }
    },
    created () {
        this.config = this.$store.config
    },
    methods: {
        // 测试邮箱
        handleTestEmail () {
            let { smtp_host, smtp_port, sender_email, sender_pass } = this.config
            let tag = [smtp_host, smtp_port, sender_email, sender_pass].some(item => IsNullOrEmpty(item))
            if (!tag) {
                tcb.callFunction('testEmail', {
                    smtp_host, smtp_port, sender_email, sender_pass
                }).then(res => {
                    if (res) this.$message.success('测试邮件发送成功！')
                })
            }
        },
        handleSave () {
            tcb.callFunction('updateConfig', {
                config: {
                    ...this.config
                }
            }).then(() => {
                this.$message.success('更新成功！')
            })
        }
    }
}
</script>
<style lang="less">
@import url('css/variables.less');
.config-page {
    border-radius: @ui-border-radius;
    background-color: @ui-bg;
    padding: 1em;

    .w200 {
        width: 200px;
    }

    .title {
        font-size: @ui-font-size-card-title;
        font-weight: @ui-font-title-weight;
        padding: 1.5em 0 1em;
    }

    .inline {
        display: inline-block;
    }

    .tip {
        margin-left: 10px;
        display: inline-block;
        font-size: 12px;
        color: @ui-aide-text;
    }
}
</style>