// 评论回复

const md5 = require('blueimp-md5')
const { db, $, getUid, getIp, config, _, isAdministrator } = require('./app')
const { updateArticle } = require('./articles')
const { regexp, validata, getQQAvatar, uuid, formatRes } = require('./utils')
const { sendEmail, sendNotice } = require('./notice')
const commentsDB = db.collection('db_comments')
const marked = require('marked')

/**
 * 格式化参数
 * @param {*} data 
 * @returns 
 */
const parse = async (data) => {
    const timestamp = new Date()
    let articleID = await updateArticle(data).then(res => res.data)
    const commentDo = {
        uid: await getUid(),// 用户ID 
        ip: getIp(),// 用户IP
        articleID: articleID || '', // 评论归属模块ID（文章id）
        nick: data.nick, // 昵称
        email: data.email, // 邮箱
        avatar: md5(data.email), // 头像
        link: data.link || '', // 链接
        ua: data.ua, // 浏览器标识
        content: data.content, // 评论内容
        // firstId: data.firstId || data.replyId || '', // 顶层评论ID
        replyId: data.replyId || '', // 被回复ID
        created: timestamp, // 评论时间
        updated: timestamp,
        isPrivate: data.isPrivate || false, // 是否私密消息
        isAudit: 0, // 审核
        delete: 0 // 删除
    }
    if (config.is_use_qq_avatar && regexp.qq.test(commentDo.email)) {
        commentDo.qqAvatar = await getQQAvatar(data.email)
    }
    if (data.at) {
        commentDo.at = data.at
    }
    return commentDo
}

/**
 * 评论限流
 */
const currentLimit = async () => {
    // 一分钟
    const time = 1 * 60 * 1000;
    const limitPerMinuteUser = parseInt(config.limit_per_minute_user)
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
            throw new Error("发言频率过高");
        }
    }

    const limitThirtyMinuteAll = parseInt(config.limit_thirty_minute_all)
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
            throw new Error("发言频率过高");
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
    let { pageIndex, pagesize = 10 } = data
    if (isNaN(parseInt(pageIndex)) || pageIndex < 1) {
        throw new Error(`参数pageIndex不合法`)
    }
    let articleID = await updateArticle(data).then(res => res.data)

    const filed = {
        articleID: 1,
        nick: 1,
        link: 1,
        qqAvatar: 1,
        tag: 1,
        content: 1,
        top: 1,
        ua: 1,
        at: 1,
        created: 1,
    }

    let { data: list } = await commentsDB
        .aggregate()
        .match({
            articleID: articleID,
            //delete: 1,
            //isAudit: 1
        })
        .sort({ top: -1, created: -1 })
        .skip((pageIndex - 1) * pagesize).limit(10)
        .project({
            _id: 0,
            id: "$_id",
            ...filed,
            gavatar: $.concat([config.gavatar_url, '$avatar']),
            childer: $.filter({
                input: '$childer',
                as: 'item',
                cond: $.eq(['$$item.isAudit', 0], ['$$item.isPrivate', 0])
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
                        id: "$$item.id",
                        articleID: '$$item.articleID',
                        nick: '$$item.nick',
                        link: '$$item.link',
                        qqAvatar: '$$item.qqAvatar',
                        tag: '$$item.tag',
                        content: '$$item.content',
                        ua: '$$item.ua',
                        at: '$$item.at',
                        created: '$$item.created',
                        gavatar: $.concat([config.gavatar_url, '$$item.avatar']),
                    }
                })
            })
        }).end()

    return formatRes(list)
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
 */
const addComments = async (event, context) => {
    await currentLimit()

    //#region 数据校验
    const par = ['hash', 'ua', 'content']
    Object.keys(config.form).forEach(key => {
        if (config.form[key]) par.push(key)
    })
    if (event.type === 1) {// type 0评论 1回复
        par.push('replyId')
    }
    validata(event, par)
    //#endregion

    // 格式化数据
    let data = await parse(event);
    const res = {
        gavatar: config.gavatar_url + data.avatar,
        qqAvatar: data.qqAvatar,
        created: data.created
    }
    const isAdmin = await isAdministrator(context)
    if (isAdmin) {
        data.tag = config.tag
    }

    if (event.type === 0) {
        let { id } = await commentsDB.add(data)
        res.id = id
    } else {
        data.id = uuid();
        res.id = data.id
        // 将回复评论插入到, 顶层评论下
        await commentsDB.where(_.or([
            { _id: data.replyId },
            { 'childer.id': data.replyId }
        ])).update({ childer: _.push([data]) })
        const comment = await getCommentByID(data.replyId)
        // 通知被回复人
        if (false && comment.email !== data.email && comment.email !== config.email.auth.user) {
            sendEmail({ ...data, email: comment.email })
        }
    }

    // 通知博主
    if (config.is_notice) {
        sendNotice(data)
    }

    return formatRes(res)
}


module.exports = {
    getComments,
    addComments,
    currentLimit
}