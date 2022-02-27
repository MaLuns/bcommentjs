// 评论回复

const md5 = require('blueimp-md5')
const bowser = require('bowser')
const app = require('./app')
const { db, $, _, getUid, getIp, isAdministrator } = app
const { updateArticle, getArticle } = require('./articles')
const { regexp, validata, getQQAvatar, uuid, formatRes, getObjOfKeys, RES_CODE } = require('./utils')
const { sendEmail, sendNotice } = require('./notice')
const commentsDB = db.collection('db_comments')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { getEnvEmail, notAdminLimit } = require('./app')
const { marked } = require('marked')

// markdown 转换
const hljs = require('highlight.js');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-',
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true
});

/**
 * 获取浏览器标识
 * @param {*} uaStr 
 * @returns 
 */
const getua = (uaStr) => {
    const ua = bowser.getParser(uaStr)
    const os = ua.getOS()
    return {
        browser: ua.getBrowserName(),
        version: ua.getBrowserVersion(),
        os: os.name,
        osVersion: os.versionName ? os.versionName : os.version
    }
}

/**
 * 格式化参数
 * @param {*} data 
 * @returns 
 */
const parse = async (data, isAdmin = false) => {
    const email = getEnvEmail()
    if (!isAdmin) {
        // 限制SMTP服务邮箱和管理员邮箱
        if (email === data.email || data.email === app.config.sender_email) throw new Error('请先登录管理面板，再使用博主身份发送评论')
    } else {
        data.email = email
        data.nick = app.config.nick
    }

    const timestamp = new Date()
    const articleID = await updateArticle(data).then(res => res.data)
    const commentDo = {
        uid: await getUid(),// 用户ID 
        ip: getIp(),// 用户IP
        articleID: articleID || '', // 评论归属模块ID（文章id）
        nick: DOMPurify.sanitize(data.nick), // 昵称
        email: DOMPurify.sanitize(data.email), // 邮箱
        avatar: md5(data.email), // 头像
        link: data.link || '', // 链接
        ua: getua(data.ua), // 浏览器标识
        content: DOMPurify.sanitize(marked.parse(data.content), { FORBID_TAGS: ['style'], FORBID_ATTR: ['style'] }), // 评论内容
        replyId: data.replyId || '', // 被回复ID
        created: timestamp, // 评论时间
        updated: timestamp,
        isPrivate: data.isPrivate || false, // 是否私密消息
        isAudit: isAdmin ? true : !app.config.is_audit, // 审核
        delete: false // 删除
    }
    if (app.config.is_use_qq_avatar && regexp.qq.test(commentDo.email)) {
        commentDo.qqAvatar = await getQQAvatar(data.email)
    }
    // if (data.at) commentDo.at = data.at
    if (isAdmin) commentDo.tag = app.config.tag || '博主'
    return commentDo
}

/**
 * 评论限流
 */
const currentLimit = async () => {
    // 一分钟
    const time = 1 * 60 * 1000;
    const limitPerMinuteUser = parseInt(app.config.limit_per_minute_user)
    if (limitPerMinuteUser && limitPerMinuteUser > 0) {
        // 五分钟
        const fiveAgo = new Date(Date.now() - 5 * time)
        // 统计评论数
        const pCount = await commentsDB.where({
            ip: getIp(),
            created: _.gt(fiveAgo)
        }).count().then(res => res.total)

        // 统计回复数
        const rCount = await commentsDB.aggregate()
            .unwind({
                path: '$childer',
            }).match({
                'childer.ip': getIp(),
                'childer.created': _.gt(fiveAgo)
            }).count('total')
            .end().then(res => {
                if (res.data.length === 0) return 0
                return res.data[0].total
            })
        if (pCount + rCount > limitPerMinuteUser) {
            throw new Error('发言频率过高');
        }
    }

    const limitThirtyMinuteAll = parseInt(app.config.limit_thirty_minute_all)
    if (limitThirtyMinuteAll && limitThirtyMinuteAll > 0) {
        // 三十分钟
        const halfHourAgo = new Date(Date.now() - 30 * time)
        // 统计评论数
        const pCount = await commentsDB.where({
            created: _.gt(halfHourAgo)
        }).count().then(res => res.total)
        // 统计回复数
        const rCount = await commentsDB.aggregate()
            .unwind({
                path: '$childer',
            }).match({
                'childer.created': _.gt(halfHourAgo)
            }).count('total')
            .end().then(res => {
                if (res.data.length === 0) return 0
                return res.data[0].total
            })
        if (pCount + rCount > limitThirtyMinuteAll) {
            throw new Error('发言频率过高');
        }
    }
}

/**
 * 根据文章ID获取评论
 * @param {*} commentsDB db
 * @param {*} pageIndex 页码
 * @param {*} pagesize  分页条数
 * @param {*} articleID 文章ID
 * @returns 
 */
const getComments = async (data) => {
    validata(data, ['pageIndex', 'hash'])
    let { pageIndex = 1, pagesize = 10 } = data
    if (isNaN(parseInt(pageIndex)) || pageIndex < 1) {
        throw new Error('参数pageIndex不合法')
    }

    let articleID; // 文章ID 
    if (data.articleID) {
        articleID = data.articleID
    } else {
        articleID = await updateArticle(data, false).then(res => res.data)
        if (!articleID) return formatRes({ list: [], page: { pagesize, pageIndex } })
    }

    const filed = { articleID: 1, nick: 1, link: 1, qqAvatar: 1, tag: 1, content: 1, top: 1, ua: 1, at: 1, created: 1, isAudit: 1, delete: 1, isPrivate: 1 }
    const avatars = app.config.gavatar_url.split('$hash');

    const isAdmin = await isAdministrator()
    let matchWhere;
    let projectWhere;
    if (isAdmin) {
        matchWhere = { articleID: articleID }
        projectWhere = true
        if (!app.config.is_show_deleted) {
            matchWhere.delete = false
            projectWhere = $.eq(['$$item.delete', false])
        }
    } else {
        matchWhere = _.and([
            { articleID: articleID, delete: false },
            _.or([
                { isPrivate: false, isAudit: true },
                { isPrivate: true, uid: await getUid() }
            ])
        ])
        projectWhere = $.and([
            $.eq(['$$item.delete', false]),
            $.or([
                $.eq(['$$item.isAudit', true]),
                $.eq(['$$item.uid', await getUid()]),
            ])
        ])
    }

    let { data: list } = await commentsDB
        .aggregate()
        .match(matchWhere)
        .sort({ top: -1, created: -1 })
        .skip((pageIndex - 1) * pagesize).limit(pagesize)
        .project({
            _id: 0,
            id: '$_id',
            ...filed,
            gavatar: $.concat([avatars[0], '$avatar', avatars[1] || '']),
            childer: $.filter({
                input: '$childer',
                as: 'item',
                cond: projectWhere
            }),
        })
        .project({
            id: 1,
            gavatar: 1,
            ...filed,
            childer: $.cond({
                if: $.ifNull(['$childer', false]),
                else: [],
                then: $.map({
                    input: '$childer',
                    as: 'item',
                    in: {
                        id: '$$item.id',
                        articleID: '$$item.articleID',
                        nick: '$$item.nick',
                        link: '$$item.link',
                        qqAvatar: '$$item.qqAvatar',
                        tag: '$$item.tag',
                        content: '$$item.content',
                        ua: '$$item.ua',
                        at: '$$item.at',
                        created: '$$item.created',
                        isAudit: '$$item.isAudit',
                        delete: '$$item.delete',
                        gavatar: $.concat([avatars[0], '$$item.avatar', avatars[1] || '']),
                    }
                })
            })
        }).end()

    let total = await commentsDB
        .aggregate()
        .match(matchWhere)
        .count('total')
        .end()
        .then(res => {
            if (res.data.length === 0) return 0
            return res.data[0].total
        })

    return formatRes({
        list,
        page: {
            total,
            pageIndex,
            pagesize
        },
    })
};

/**
 * 根据ID查找评论
 * @param {*} id 
 * @returns 
 */
const getCommentByID = async (id) => {
    let { data } = await commentsDB.where({ _id: id }).get()
    if (data.length === 0) {
        let { data } = await commentsDB.aggregate()
            .match({ 'childer.id': id })
            .project({
                _id: 0,
                item: $.filter({
                    input: '$childer',
                    as: 'item',
                    cond: $.eq(['$$item.id', id])
                })
            })
            .end();
        if (data.length > 0) return data[0].item[0]
        return {}
    } else {
        return data[0];
    }
}

/**
 * 添加评论
 * @param {*} event 
 * @returns 
 */
const addComment = async (event) => {
    // #region 数据校验
    const isAdmin = await isAdministrator()
    const par = ['hash', 'ua', 'content']
    if (!isAdmin) {
        await currentLimit()
        Object.keys(app.config.form).forEach(key => {
            if (app.config.form[key]) par.push(key)
        })
    }
    if (event.type === 1) par.push('replyId')// type 0评论 1回复
    validata(event, par)
    // #endregion

    // 格式化数据
    const data = await parse(event, isAdmin);
    const { data: { title = '', href = '' } } = await getArticle(data.articleID) // 文章信息
    const res = { ...data, gavatar: app.config.gavatar_url.replace('$hash', data.avatar), }
    const noticeData = {
        title,
        href: app.config.site_url + href,
        nick: data.nick,
        content: data.content,
    }

    if (event.type === 0) { // 评论
        let { id } = await commentsDB.add(data)
        res.id = id
    } else { // 回复
        const comment = await getCommentByID(data.replyId) // 查找被回复评论
        data.at = getObjOfKeys(comment, ['link', 'nick', 'tag'])
        data.id = uuid(); // 唯一id
        res.id = data.id
        res.at = data.at

        // 将回复评论插入到, 顶层评论下
        await commentsDB.where(_.or([
            { _id: data.replyId },
            { 'childer.id': data.replyId }
        ])).update({ childer: _.push([data]) })

        // 通知被回复人
        if (comment.email !== data.email && comment.email !== getEnvEmail() && comment.email !== app.config.sender_email) {
            sendEmail({ ...noticeData, type: 1, toEmail: comment.email })
        }
    }

    // 通知博主
    try {
        if (!isAdmin) {
            sendEmail({ ...noticeData, type: 2, toEmail: getEnvEmail() || app.config.sender_email })
            sendNotice(data)
        }
    } catch (error) {
        console.error('通知失败', error);
    }

    return formatRes(res)
}

/**
 * 修改评论
 * @param {*} event 
 * @returns 
 */
const updateComment = async (event) => {
    await notAdminLimit();
    validata(event, ['id']);
    let newData = {}, tag = false;
    ['content', 'isAudit', 'delete'].forEach(key => {
        if (Object.hasOwnProperty.call(event, key)) {
            newData[key] = event[key]
            tag = true;
        }
    })
    if (!tag) {
        return formatRes(null, RES_CODE.FAIL)
    }
    let { updated } = await commentsDB.doc(event.id).update(newData)
    if (updated === 0) {
        await commentsDB.where({
            'childer.id': event.id
        }).update({
            'childer.$': newData
        })
    }
    return formatRes(true)
}

module.exports = {
    getComments,
    addComment,
    updateComment,
    currentLimit
}