const nodeuuid = require('node-uuid');
const https = require('https')

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
    0: '调用成功',
    1000: '调用失败',
    1001: '未找到处理程序',
    1010: '请先登录再修改密码',
    1020: '配置信息读取失败',
    1021: '未配置登录私钥',
    1025: '无效的私钥文件',
    1022: '未配置管理密码',
    1023: '密码错误',
    1024: '请登录后访问',
}

/**
 * 格式化响应数据
 * @param {*} data 
 * @param {*} code 
 * @param {*} message 
 * @returns 
 */
const formatRes = (data = null, code = RES_CODE.SUCCESS, message) => ({
    data,
    code,
    message: message || RES_INFO[code] || '调用成功'
})

/**
 * 格式化时间
 * @param {*} fmt 
 * @param {*} time 
 * @returns 
 */
const dateFormat = (fmt = 'yyyy-MM-dd Hh:mm:ss', time = new Date()) => {
    let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        'S': time.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
}

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
        const result = await new Promise((resolve) => {
            https.get(`https://ptlogin2.qq.com/getface?imgtype=4&uin=${qqNum}`, function (res) {
                let data = ''
                res.on('data', (str) => data += str)
                res.on('end', () => resolve(data))
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
const getDayStart = (days = 0) => {
    let date = new Date(new Date().setHours(0, 0, 0, 0));
    date.setTime(date.getTime() - 3600 * 1000 * 24 * days)
    return date
}

/**
 * 
 * @param {*} data  
 * @param {*} key 
 */
const generateYearMonthData = (data = []) => {
    let res = [];
    for (let i = 0; i < 12; i++) {
        let d = new Date();
        d.setDate(1);
        d.setMonth(d.getMonth() - i);
        let m = d.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let key = `${d.getFullYear()}-${m}`;
        let item = data.find(item => item._id === key)
        if (item) {
            res.unshift({ date: key, num: item.num })
        } else {
            res.unshift({ date: key, num: 0 })
        }
    }
    return res
}

/**
 * 是否是Obj
 * @param {*} obj 
 * @returns 
 */
const isObject = (obj) => obj !== null && typeof obj === 'object'

/**
 * 将一个对象填充到另一个上
 * @param {*} to 
 * @param {*} from 
 * @returns 
 */
const extend = (to, from) => {
    for (const key in to) {
        if (isObject(from[key])) {
            to[key] = extend(to[key], from[key]);
        } else {
            to[key] = from[key]
        }
    }
    return to
}

/**
 * 获取对象需要key-val,并返回新的对象
 * @param {*} obj 
 * @param {*} keys 
 */
const getObjOfKeys = (obj, keys = []) => {
    let res = {}
    keys.forEach(key => {
        if (Object.hasOwnProperty.call(obj, key)) {
            res[key] = obj[key];
        }
    });
    return res
}

/**
 * 正则
 */
const regexp = {
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    qq: /^[1-9][0-9]{6,}@qq.com/
}

module.exports = {
    uuid,
    extend,
    regexp,
    validata,
    RES_CODE,
    formatRes,
    isNullOrEmpty,
    dateFormat,
    getQQAvatar,
    getObjOfKeys,
    getDayStart,
    generateYearMonthData
}