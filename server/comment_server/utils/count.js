// 站点统计
const { db, getIp, _, $, isAdministrator } = require('./app')
const { validata, getDayStart, formatRes, generateYearMonthData } = require('./utils')
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
const getUV = async () => {
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
        date: _.gte(getDayStart())
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

/**
 * 
 * @param {*} event 
 * @returns 
 */
const getChartData = async () => {
    const isAdmin = await isAdministrator();
    let res = {}
    if (isAdmin) {
        // PV 统计
        const getPVData = async () => {
            let { data } = await site.aggregate().match({
                date: _.gte(getDayStart(365))
            }).unwind({
                path: '$childer',
            }).group({
                _id: $.dateToString({
                    date: '$childer.time',
                    format: '%Y-%m'
                }),
                num: $.sum(1)
            }).end()
            let count = await site.aggregate().match({
                date: _.gte(getDayStart(7))
            }).group({
                _id: null,
                count: $.sum($.size('$childer'))
            }).end().then(res => res.data[0].count)

            return {
                chart: generateYearMonthData(data),
                count
            }
        }
        res.pvData = await getPVData()

        // UV 统计
        const getUVData = async () => {
            let { data } = await site.aggregate().match({
                date: _.gte(getDayStart(365))
            }).unwind({ path: '$childer' }).group({
                _id: {
                    date: $.dateToString({
                        date: '$date',
                        format: '%Y-%m'
                    }),
                    ip: '$childer.ip'
                },
                num: $.sum(1)
            }).group({
                _id: '$_id.date',
                num: $.sum(1)
            }).sort({ _id: 1 }).end()

            let count = await site.aggregate().match({
                date: _.gte(getDayStart(7))
            }).unwind({ path: '$childer' }).group({
                _id: {
                    date: $.dateToString({
                        date: '$date',
                        format: '%Y-%m'
                    }),
                    ip: '$childer.ip'
                },
                num: $.sum(1)
            }).group({
                _id: null,
                count: $.sum(1)
            }).end().then(res => res.data[0].count)
            return {
                chart: generateYearMonthData(data),
                count
            }
        }
        res.uvData = await getUVData()

        // 评论 统计
    }
    return formatRes(res)
}


module.exports = {
    getPV,
    getBatchPV,
    getUV,
    addPVUV,
    getChartData
}