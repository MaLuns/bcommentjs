const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path')
const app = require('./app')
const { notAdminLimit, getEnvEmail } = app
const { formatRes } = require('./utils');

/**
 * 获取 nodemailer
 * @returns 
 */
const getTransporter = async () => {
    if (!app.config.sender_email || !app.config.sender_pass) {
        throw new Error('未找到邮箱配置信息')
    }
    if (!app.config.smtp_host || !app.config.smtp_port) {
        throw new Error('SMTP 服务器没有配置')
    }

    try {
        const transporter = nodemailer.createTransport({
            host: app.config.smtp_host,
            port: app.config.smtp_port,
            secure: app.config.smtp_secure,
            auth: {
                user: app.config.sender_email,
                pass: app.config.sender_pass
            }
        });
        const success = await transporter.verify()
        if (success) return transporter
    } catch (error) {
        throw new Error('SMTP 邮箱配置异常：', error)
    }
}

/**
 * 消息推送
 * @param {*} data 
 */
const sendNotice = (data) => {
    Object.keys(noticeQueue).forEach(key => {
        noticeQueue[key](data)
    })
}

/**
 * 邮件发送
 * @param {*} param
 *  */
const sendEmail = async ({ title, href, type, nick, content, toEmail }) => {
    let ejsTemplate;
    if (app.config.is_email_template) {
        ejsTemplate = app.config.email_template_ejs
    } else {
        ejsTemplate = fs.readFileSync(path.resolve(__dirname, '../templates/email.template.ejs'), { encoding: 'utf8' });
    }
    const html = ejs.render(ejsTemplate, {
        title,
        href,
        type,
        nick,
        content,
        datetime: new Date(),
        siteName: app.config.site_name,
        siteLogo: app.config.site_logo
    })
    const transporter = await getTransporter()
    transporter.sendMail({
        from: `${app.config.sender_name || app.config.site_name} <${app.config.sender_email}>`,
        subject: app.config.subject || (`【${app.config.site_name}】收到新的${type === 1 ? '回复' : '留言 '}`),
        to: toEmail,
        html
    })
}

/**
 * 发送测试邮件
 * @param {*} event 
 */
const testEmail = async (event) => {
    await notAdminLimit()
    const transporter = await getTransporter()
    transporter.sendMail({
        from: app.config.sender_email,
        to: event.mail || getEnvEmail() || app.config.sender_email,
        subject: '测试邮件',
        html: '这是一条测试邮件，说明邮件功能配置正确'
    })
    return formatRes(true)
}

/**
 * 推送列表-
 * @param {*} data 
 */
const noticeQueue = {
    noticeWeChat (data) {

    }
}
module.exports = {
    sendNotice,
    sendEmail,
    testEmail
}