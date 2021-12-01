// 站点统计
const { db, getIp, _, $ } = require('./app')
const { validata, toDayStart, formatRes } = require('./utils')
const site = db.collection('db_site')

/**
 * 批量获取
 * @param {*} event 
 */
const getBatchPV = async (event) => {
    validata(event, ['hash'])
    let { data } = await site.aggregate().match({
        hash: $.in(event.hash),
    }).project({
        _id: 0,
        hash: 1,
        count: $.size('$childer')
    }).end()
    return formatRes(data)
}

/**
 * 获取文章总访问量
 * @param {*} event 
 * @returns 
 */
const getPV = async (event) => {
    validata(event, ['hash'])
    let count = await site.aggregate().match({
        hash: event.hash,
    }).group({
        _id: null,
        count: $.sum($.size('$childer'))
    }).end().then(res => res.data[0].count)
    return formatRes(count)
}

/**
 * 获取站点总PV
 * @param {*} event 
 * @returns 
 */
const getUV = async (event) => {
    let count = await site.aggregate()
        .unwind({
            path: '$childer',
        }).group({
            _id: {
                date: '$date',
                ip: '$childer.ip'
            }
        }).count('count')
        .end().then(res => {
            if (res.data.length === 0) return 0
            return res.data[0].count
        })
    return formatRes(count)
}

/**
 * 增加PV UV 统计
 * @param {*} event 
 * @returns 
 */
const addPVUV = async (event) => {
    // 文章访问量
    // 以日为单位统计，方便报表统计
    const hash = event.hash || '00000000'
    validata(event, ['title', 'url'])

    let result = await site.where({
        hash,
        date: _.gte(toDayStart())
    }).update({
        childer: _.push([{
            ip: getIp(),
            email: event.email,
            time: new Date()
        }])
    })

    if (result.updated === 0) {
        result = await site.add({
            hash,
            title: event.title,
            url: event.url,
            date: new Date(),
            childer: [{
                ip: getIp(),
                email: event.email,
                time: new Date()
            }]
        })
    }
    return formatRes(result.updated || result.inserted)
}

module.exports = {
    getPV,
    getBatchPV,
    getUV,
    addPVUV
}