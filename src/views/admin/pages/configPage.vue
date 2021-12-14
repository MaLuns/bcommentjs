<template>
    <div class="config">
        <m-form ref="form" :model="config" labelWidth="6em">
            <m-form-item label="博客名称">
                <input class="w200" v-model.trim="config.site_name" type="text" placeholder="站点名称" autocomplete="off" />
                <p class="tip">用于消息推送使用</p>
            </m-form-item>
            <m-form-item label="博客logo">
                <input class="w200" v-model.trim="config.site_logo" type="text" placeholder="博客logo" autocomplete="off" />
                <p class="tip">为空，默认使用邮箱的Gavatar</p>
            </m-form-item>
            <m-form-item label="博主昵称">
                <input class="w200" v-model.trim="config.nick" type="text" placeholder="站点名称" autocomplete="off" />
                <p class="tip">用于评论时，显示昵称，如果为空则仅显示标识</p>
            </m-form-item>
            <m-form-item label="评论标识">
                <input class="w200" v-model.trim="config.tag" type="text" placeholder="博主评论标识" autocomplete="off" />
                <p class="tip">用于标识为博主评论，如果为空默认为‘博主’</p>
            </m-form-item>
            <m-form-item label="个人限流">
                <input class="w200" v-model.number="config.limit_per_minute_user" step="1" min="0" type="number" placeholder="个人限流" autocomplete="off" />
                <p class="tip">每个人10分钟内留言条数，为0时关闭</p>
            </m-form-item>
            <m-form-item label="全部限流">
                <input class="w200" v-model.number="config.limit_thirty_minute_all" step="1" min="0" type="number" placeholder="全部限流" autocomplete="off" />
                <p class="tip">所有人30分钟内留言条数，为0时关闭</p>
            </m-form-item>
            <m-form-item label="评论审核">
                <div class="w200 inline">
                    <input v-model="config.is_audit" id="is_audit" type="checkbox" />
                    <label for="is_audit" class="ui-switch"></label>
                </div>
                <p class="tip">开启后，评论需要博主审核通过后才显示</p>
            </m-form-item>
            <m-form-item label="必填项">
                <div class="w200 inline">
                    <input v-model="config.form.nick" id="form_nick" type="checkbox" />
                    <label for="form_nick" class="ui-checkbox"></label>
                    <label for="form_nick">昵称</label>
                    <input v-model="config.form.email" id="form_email" type="checkbox" />
                    <label for="form_email" class="ui-checkbox"></label>
                    <label for="form_email">邮箱</label>
                    <input v-model="config.form.link" id="form_link" type="checkbox" />
                    <label for="form_link" class="ui-checkbox"></label>
                    <label for="form_link">网址</label>
                </div>
                <p class="tip">用于控制评论必填项</p>
            </m-form-item>
            <m-form-item label="Gavatar">
                <input class="w200" v-model.trim="config.gavatar_url" type="text" placeholder="gavatar头像地址配置" autocomplete="off" />
                <p class="tip">配置Gavatar镜像地址，$hash会被替换成用户id</p>
            </m-form-item>
            <m-form-item label="QQ头像">
                <div class="w200 inline">
                    <input v-model="config.is_use_qq_avatar" id="is_use_qq_avatar" type="checkbox" />
                    <label for="is_use_qq_avatar" class="ui-switch"></label>
                </div>
                <p class="tip">开启后，将优先使用qq头像作为用户头像</p>
            </m-form-item>

            <m-form-item label="SMTP地址">
                <input class="w200" v-model.trim="config.smtp_host" type="text" placeholder="SMTP服务地址" autocomplete="off" />
                <p class="tip">例如：腾讯企业邮箱为 smtp.exmail.qq.com</p>
            </m-form-item>
            <m-form-item label="SMTP端口">
                <input class="w200" v-model.trim="config.smtp_port" type="text" placeholder="SMTP端口" autocomplete="off" />
                <p class="tip">例如：腾讯企业邮箱为 465</p>
            </m-form-item>
            <m-form-item label="SMTP邮箱">
                <input class="w200" v-model.trim="config.sender_email" type="text" placeholder="SMTP邮箱" autocomplete="off" />
                <p class="tip">用于消息推送使用</p>
            </m-form-item>
            <m-form-item label="SMTP密钥">
                <input class="w200" v-model.trim="config.sender_pass" type="text" placeholder="SMTP密钥" autocomplete="off" />
                <p class="tip">邮箱对应密码或者密钥，建议使用密钥</p>
            </m-form-item>
            <m-form-item label="自定义模版">
                <div class="w200 inline">
                    <input v-model="config.is_email_template" id="is_email_template" type="checkbox" />
                    <label for="is_email_template" class="ui-switch"></label>
                </div>
                <p class="tip">开启后，使用自定义邮件模版</p>
            </m-form-item>
            <m-form-item label v-if="config.is_email_template">
                <!-- <input class="w200" v-model.trim="config.sender_email" type="" placeholder="SMTP邮箱" autocomplete="off" /> -->
                <textarea class="w200" v-model.trim="config.email_template_ejs" rows="7" cols></textarea>
                <p class="tip">
                    自定义模版，使用ejs解析，注入参数
                    <br />siteName：站点名称
                    <br />siteLogo：站点LOGO
                    <br />title：文章标题
                    <br />href：文章链接
                    <br />type：类型 1 发送给其他用户的，2 发送给博主的
                    <br />nick：评论人昵称
                    <br />datetime：评论时间
                    <br />content：评论内容
                    <br />
                </p>
            </m-form-item>
            <m-form-item label="发件人">
                <input class="w200" v-model.trim="config.sender_name" type="text" placeholder="发件人" autocomplete="off" />
                <p class="tip">如果为空，则默认为：博客名称&lt;邮箱&gt;</p>
            </m-form-item>
            <m-form-item label="主题">
                <input class="w200" v-model.trim="config.subject" type="text" placeholder="邮件主题" autocomplete="off" />
                <p class="tip">如果为空，则默认为：【博客名称】收到新的留言 或 您在【博客名称】收到新的回复</p>
            </m-form-item>
            <m-form-item>
                <m-button type="primary" @click="handleSave">保存</m-button>

                <m-button type="text" @click="handleTestEmail">邮箱测试</m-button>
            </m-form-item>
        </m-form>
    </div>
</template>
<script>
import tcb from '@/tcb'
import { mForm, mFormItem, mButton, message } from '+/'
import { IsNullOrEmpty } from "@/util";

export default {
    components: { mForm, mFormItem, mButton },
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
    created () {
        tcb.callFunction('getConfig').then(res => {
            this.config = res
        })
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
                    if (res) message.success('测试邮件发送成功！')
                })
            } else {

            }
        },
        handleSave () {
            tcb.callFunction('updateConfig', {
                config: {
                    ...this.config
                }
            }).then(res => {
                message.success('更新成功！')
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import url("s/variables.less");
.config {
    border-radius: @ui-border-radius;
    background-color: @ui-global-bg-normal;
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
        color: #aaa;
    }
}
</style>