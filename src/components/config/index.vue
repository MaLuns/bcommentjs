<template>
    <div class="config">
        <m-form ref="form" :model="config" labelWidth="6em">
            <h3 class="center">邮箱配置</h3>
            <m-form-item label="SMTP地址">
                <input v-model.trim="config.smtp_host" type="text" placeholder="SMTP服务地址" autocomplete="off" />
            </m-form-item>
            <m-form-item label="SMTP端口">
                <input v-model.trim="config.smtp_port" type="text" placeholder="SMTP端口" autocomplete="off" />
            </m-form-item>
            <m-form-item label="SMTP邮箱">
                <input v-model.trim="config.sender_email" type="text" placeholder="SMTP邮箱" autocomplete="off" />
            </m-form-item>
            <m-form-item label="SMTP密钥">
                <input v-model.trim="config.sender_pass" type="text" placeholder="SMTP密钥" autocomplete="off" />
            </m-form-item>
            <m-form-item label="邮件模版"></m-form-item>
            <m-form-item label="发件人">
                <input v-model.trim="config.sender_name" type="text" placeholder="发件人" autocomplete="off" />
            </m-form-item>
            <m-form-item label="主题">
                <input v-model.trim="config.subject" type="text" placeholder="邮件主题" autocomplete="off" />
            </m-form-item>
            <h3 class="center">评论配置</h3>
            <m-form-item label="博客名称">
                <input v-model.trim="config.site_name" type="text" placeholder="站点名称" autocomplete="off" />
            </m-form-item>
            <m-form-item label="博主标识">
                <input v-model.trim="config.tag" type="text" placeholder="评论博主标识" autocomplete="off" />
            </m-form-item>
            <m-form-item label="个人限流">
                <input v-model.trim="config.limit_per_minute_user" type="text" placeholder="评论博主标识" autocomplete="off" />
                <!-- <p class="tip">每个人10分钟留言条数</p> -->
            </m-form-item>
            <m-form-item label="全部限流">
                <input v-model.trim="config.limit_thirty_minute_all" type="text" placeholder="评论博主标识" autocomplete="off" />
                <!-- <p class="tip">所有人30分钟留言条数</p> -->
            </m-form-item>
            <m-form-item label="审核">
                <input v-model="config.is_audit" id="is_use_qq_avatar" type="checkbox" class="checkbox-input" />
                <label for="is_use_qq_avatar">开启</label>
            </m-form-item>
            <m-form-item label="Gavatar">
                <input v-model.trim="config.gavatar_url" type="text" placeholder="gavatar头像地址配置" autocomplete="off" />
            </m-form-item>
            <m-form-item label="QQ头像">
                <input v-model="config.is_use_qq_avatar" id="is_use_qq_avatar" type="checkbox" class="checkbox-input" />
                <label for="is_use_qq_avatar">开启</label>
            </m-form-item>
            <m-form-item label="评论必填项">
                <input v-model="config.form.nick" id="form_nick" type="checkbox" class="checkbox-input" />
                <label for="form_nick">昵称</label>
                <input v-model="config.form.email" id="form_email" type="checkbox" class="checkbox-input" />
                <label for="form_email">邮箱</label>
                <input v-model="config.form.link" id="form_link" type="checkbox" class="checkbox-input" />
                <label for="form_link">网址</label>
            </m-form-item>
        </m-form>
    </div>
</template>
<script>
import mForm from "+/form/form";
import mFormItem from "+/form/formItem";
import mButton from "+/button"

export default {
    components: { mForm, mFormItem, mButton },
    data () {
        return {
            config: {
                notice_type: null,
                // 邮件配置
                smtp_host: null,
                smtp_port: null,
                smtp_secure: true,
                sender_email: null,
                sender_pass: null,
                // 邮件模版配置
                subject: "",
                sender_name: "",
                is_notice: null,
                email_template: 0,
                // 评论配置
                form: {
                    email: true,
                    link: false,
                    nick: true,
                },
                is_audit: true,
                gavatar_url: "https://gravatar.loli.net/avatar/$hash?d=mp",
                is_use_qq_avatar: false,
                limit_per_minute_user: 10,
                limit_thirty_minute_all: 150,
                site_name: "",
                tag: "博主",
            }
        }
    },
}
</script>
<style lang="less" scoped>
.config {
    background-color: #fff;
    padding: 1em;
    .tip {
        position: absolute;
        font-size: 12px;
        color: #aaa;
    }
}
</style>