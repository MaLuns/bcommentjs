// 文章信息存储
const { validata, uuid, formatRes } = require('./utils')
const { db, } = require('./app')
const articleDB = db.collection('db_articles');

/**
 * 获取文章信息
 * @param {*} articleID 
 * @returns 
 */
const getArticle = async (articleID) => {
    let { data } = await articleDB.where({ _id: articleID }).field({ _id: 0 }).get();
    if (data.length === 0) {
        return formatRes(false)
    }
    return formatRes(data[0])
}

/**
 * 更新文章信息
 * @param {*} data 
 * @returns 
 */
const updateArticle = async (event) => {
    validata(event, ['hash'])
    try {
        let { hash, url = '', title = '' } = event
        let { data } = await articleDB.field({ _id: 1 }).where({ hash }).get();
        let articleID = '';
        if (data.length === 0) {
            let { id } = await articleDB.add({ date: new Date(), url, hash, title })
            articleID = id;
        } else {
            let { _id } = data[0]
            articleID = _id;
        }
        return formatRes(articleID)
    } catch (error) {
        throw new Error('文章信息读取失败！')
    }
}


module.exports = {
    getArticle,
    updateArticle
}