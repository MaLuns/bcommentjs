const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const { config, db, isAdministrator } = require('./app')
const { getArticle } = require('./articles')

/**
 * 获取 nodemailer
 * @returns 
 */
const getTransporter = async () => {
    try {
        if (!config.sender_email || !config.sender_pass) {
            throw new Error('未找到邮箱配置信息')
        }
        if (!config.smtp_host || !config.smtp_port) {
            throw new Error('SMTP 服务器没有配置')
        }
        const transporter = nodemailer.createTransport({
            host: config.smtp_host,
            port: config.smtp_port,
            secure: config.smtp_secure,
            auth: {
                user: config.sender_email,
                pass: config.sender_pass
            }
        });
        try {
            const success = await transporter.verify()
            if (success) return transporter
        } catch (error) {
            throw new Error('SMTP 邮箱配置异常：', error)
        }
    } catch (error) {
        console.error('邮件初始化异常：', e.message)
    }
}

/**
 * 开启推送列表
 * @param {*} data 
 */
const noticeQueue = {
    noticeWeChat (data) {

    }
}

/**
 * 消息推送
 * @param {*} data 
 */
const notice = (data) => {
    Object.keys(noticeQueue).forEach(key => {
        noticeQueue[key](data)
    })
}

/**
 * 发送邮件
 * @param {*} type true 通知其他人  false 通知博主 
 * @returns 
 */
const noticeEmail = async ({ email, nick, content, articleID = '', type = true }) => {
    let article = await getArticle(articleID)

    const template = fs.readFileSync('../templates/email.template.ejs', { encoding: 'utf8' });
    const html = ejs.render(template, {
        date: str,
        from: `来自于${config.site_name}`,
        title: article.title,
        href: article.url,
        nick,
        content,
        type
    });
    const mail = {
        from: `${config.sender_name} <${config.sender_email}>`,
        subject: config.subject,
        to: type ? email : config.sender_email,
        html
    }
    const transporter = await getTransporter()
    transporter.sendMail(mail)
}

module.exports = {
    notice
}