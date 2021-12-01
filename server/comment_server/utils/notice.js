const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const { config, db } = require('./app')
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
            if (success)
                return transporter
        } catch (error) {
            throw new Error('SMTP 邮箱配置异常：', error)
        }
    } catch (error) {
        console.error('邮件初始化异常：', e.message)
    }
}

/**
 * 发送邮件
 * @param {*} type true 通知其他人  false 通知博主 
 * @returns 
 */
const sendEmail = async ({ email, nick, content, articleID = '', type = true }) => {
    let article = await getArticle(articleID)
    if (article) {
        const template = fs.readFileSync('../templates/email.template.ejs', { encoding: 'utf8' });
        const html = ejs.render(template, {
            date: str,
            from: `来自于${config.site_name}博客`,
            title: article.title,
            href: article.url,
            nick,
            content,
            type
        });
        const mail = {
            from: `"${config.sender_name}" <${config.sender_email}>`,
            subject: config.subject,
            to: type ? email : config.sender_email,
            html
        }
        const transporter = await getTransporter()
        if (transporter) {
            transporter.sendMail(mail)
        } else {
            noNotice({ email, nick, content, articleID, type })
        }
    } else {
        noNotice({ email, nick, content, articleID, type })
    }
}

/**
 * 发送通知
 * @param {*} data 
 */
const sendNotice = (data) => {
    switch (config.notice_type) {
        case 1:
            sendEmail({ ...data, type: false })
            break;
        case 2:
            break;
        case 3:
            break;
        default:
            break;
    }
}

/**
 * 记录未通知消息
 * @param {*} sendInfo 
 */
const noNotice = (sendInfo) => {
    db.collection('db_no_notice').add(sendInfo)
}

module.exports = {
    sendEmail,
    sendNotice
}