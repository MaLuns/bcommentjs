const nodeuuid = require('node-uuid');
const https = require("https")

// 返回状态码
const RES_CODE = {
    SUCCESS: 0,
    FAIL: 1000,
    HANDLER_NOT_EXIST: 1001,
    PASS_EXIST: 1010,
    CONFIG_NOT_EXIST: 1020,
    CREDENTIALS_NOT_EXIST: 1021,
    CREDENTIALS_INVALID: 1025,
    PASS_NOT_EXIST: 1022,
    PASS_NOT_MATCH: 1023,
    NEED_LOGIN: 1024,
}

// 状态码对应消息
const RES_INFO = {
    0: "调用成功",
    1000: "调用失败",
    1001: "未找到处理程序",
    1010: "请先登录再修改密码",
    1020: "配置信息读取失败",
    1021: "未配置登录私钥",
    1025: "无效的私钥文件",
    1022: "未配置管理密码",
    1023: "密码错误",
    1024: "请登录后访问",
}

/**
 * 格式化响应数据
 * @param {*} data 
 * @param {*} code 
 * @param {*} message 
 * @returns 
 */
const formatRes = (data = null, code = RES_CODE.SUCCESS, message) => ({
    data, code,
    message: message || RES_INFO[code] || '调用成功'
})


/**
 * 空字符校验
 * @param {*} val 
 * @returns 
 */
const isNullOrEmpty = (val) => val === '' || val === null || val === undefined

/**
 * 参数校验
 * @param {*} event 
 * @param {*} requiredParams 
 */
const validata = (event = {}, requiredParams = [], err) => {
    for (const requiredParam of requiredParams) {
        if (!event[requiredParam] || isNullOrEmpty(event[requiredParam])) {
            if (err) throw new Error(err);
            else throw new Error(`参数"${requiredParam}"不合法`);
        }
    }
}

/**
 * 获取QQ头像地址
 * @param {*} qq 
 * @returns 
 */
const getQQAvatar = async (qq) => {
    try {
        const qqNum = qq.replace(/@qq.com/ig, '')
        const result = await new Promise((resolve, reject) => {
            https.get(`https://ptlogin2.qq.com/getface?imgtype=4&uin=${qqNum}`, function (res) {
                let data = ''
                res.on("data", (str) => data += str)
                res.on("end", () => resolve(data))
            })
        })
        if (result) {
            const start = result.indexOf('http')
            const end = result.indexOf('"', start)
            if (start === -1 || end === -1) return null
            return result.substring(start, end)
        }
    } catch (e) {
        console.error('获取 QQ 头像失败：', e)
    }
}

/**
 * 生成UUID
 */
const uuid = () => nodeuuid.v1().replace(/\-/g, '');

/**
 * 获取今天00:00:00 时间
 * @returns 
 */
const toDayStart = () => new Date(new Date().setHours(0, 0, 0, 0))

/**
 * 正则
 */
const regexp = {
    emali: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    qq: /^[1-9][0-9]{6,}@qq.com/
}

module.exports = {
    uuid,
    regexp,
    validata,
    RES_CODE,
    formatRes,
    getQQAvatar,
    isNullOrEmpty,
    toDayStart,
}