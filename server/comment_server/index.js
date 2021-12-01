const tcb = require("@cloudbase/node-sdk");
const { initConfig, config, isAdmin } = require('./utils/app')
const { getComments, addComments, currentLimit } = require('./utils/comments')
const { addPVUV, getPV, getBatchPV, getUV } = require('./utils/count')
const { getArticle, updateArticle } = require('./utils/articles')
const { validata, RES_CODE, formatRes, } = require('./utils/utils')

// 处理程序
const handler = {
    getComments,// 获取评论
    addComments,// 添加评论
    getPV,// 获取文章pv
    getBatchPV,// 批量获取
    getUV,// 获取站点UV
    addPVUV,// 记录访问记录
    getArticle, // 获取文章信息
    updateArticle,// 更新文章信息
    async getConfig (event, context) {
        if (await isAdmin(context)) {
            return formatRes(config)
        }
        return formatRes(null, RES_CODE.CONFIG_NOT_EXIST)
    }
}

/**
 * 主入口
 * @param {*} event 
 * @param {*} context 
 * @returns 
 */
exports.main = async (event, context) => {
    let res = {}
    let { handlerName } = event
    try {
        validata(event, ['handlerName'], '请指定处理程序')
        await initConfig()
        if (handler[handlerName]) {
            res = await handler[handlerName](event, context)
        } else {
            res = formatRes(null, RES_CODE.HANDLER_NOT_EXIST, `调用失败：未找到处理程序 ${handlerName} 。`)
        }
    } catch (error) {
        console.error('请求参数：', event)
        console.error('错误信息：', error)
        res = formatRes(null, RES_CODE.FAIL, error.message)
    }
    return res
}
