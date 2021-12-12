import cloudbase from "@cloudbase/js-sdk";
import message from '+/message'

const msg = {
    'INVALID_ACTION': '调用接口名非法',
    'EXCEED_REQUEST_SIZE_LIMIT': '请求包体积超限',
    'EXCEED_SYS_RATE_LIMIT': '请求频率超过系统限制',
    'INVALID_REQUEST_SOURCE': '请求来源非法，请检查 WEB 安全域名配置等。',
    'INVALID_COMMON_PARAM': '请求公共参数错误',
    'INVALID_PARAM': '请求参数错误',
    'SIGN_PARAM_INVALID': '认证参数非法',
    'LOGIN_MANNER_UNREGISTED': '使用的登录方式已被关闭',
    'APP_SIGN_EXPIRED': '移动应用签名过期',
    'INVALID_APP_SIGN': '移动应用签名非法、签名格式错误',
    'INVALID_APP_ACCESS': '非法的移动应用访问、移动应用版本未找到',
    'CHECK_LOGIN_FAILED': '登录态校验失败、access token 过期（旧）',
    'ACCESS_TOKEN_EXPIRED': 'access token 已过期',
    'REFRESH_TOKEN_EXPIRED': 'refresh token 已过期或不存在',
    'INVALID_REFRESH_TOKEN': '非法的 refresh token',
    'REFRESH_TOKEN_EXHAUSTED': '多点登录数量超限',
    'INVALID_ENV': '错误的环境、环境未找到',
    'INVALID_ENV_STATUS': '环境状态非法、不可用',
    'INVALID_ENV_SOURCE': '小程序绑定云开发环境来源非法',
    'RESOURCE_NOT_INITIAL': '云资源未初始化完成、云资源不可用',
    'EXCEED_REQUEST_LIMIT': '请求次数超限、套餐资源耗尽',
    'EXCEED_CONCURRENT_REQUEST_LIMIT': '请求并发超限',
    'INVALID_OPERATION': '操作非法，当前状态（资源、帐号等）不允许进行相应操作',
    'PERMISSION_DENIED': '无操作权限',

    'UNCTIONS_EXECUTE_FAIL': '云函数执行失败，云函数通用错误',
    'FUNCTIONS_TIME_LIMIT_EXCEEDED': '云函数执行超时',
    'FUNCTIONS_MEMORY_LIMIT_EXCEEDED': '云函数运行内存超限',
    'FUNCTION_NOT_FOUND': '云函数未找到',

    'AUTH_EMAIL_HAS_BEEN_BOUND': '当前邮箱已注册',
    'INVALID_EMAIL_TOKEN': '邮箱激活 token 过期或者不存在',
    'AUTH_LOGIN_FAILED': '登录失败'
}

const tcb = {
    app: null,
    auth: null
}

/**
 * 初始CloudBase
 * @param {*} param
 */
const initApp = async ({ env, region = '' }) => {
    if (tcb.app !== null) {
        return tcb
    } else {
        tcb.app = cloudbase.init({ env: env, region: region })
        await auth()
        return tcb
    }
}

/**
 * 匿名登录
 * @returns 
 */
const auth = () => {
    return new Promise((resolve, reject) => {
        tcb.auth = tcb.app.auth({
            persistence: 'local'
        })
        if (tcb.auth.hasLoginState()) {
            resolve()
        } else {
            tcb.auth
                .anonymousAuthProvider()
                .signIn()
                .then(resolve)
                .catch(reject)
        }
    })
}

/**
 * 邮箱登录
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
const login = async (email, password) => {
    return await tcb.auth
        .signInWithEmailAndPassword(email, password)
        .then((loginState) => loginState.user)
        .catch(e => {
            if (msg[e.code]) message.danger(msg[e.code])
            else message.danger('用户名或密码错误')
        });
}

/**
 * 邮箱注册
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
const regster = async (email, password) => {
    return await tcb.auth
        .signUpWithEmailAndPassword(email, password)
        .then(() => true)
        .catch(e => {
            if (msg[e.code]) message.danger(msg[e.code])
            else message.danger('注册失败')
        });
}

/**
 * 重置密码
 * @param {*} email 
 * @returns 
 */
const reset = async (email) => {
    return await tcb.auth
        .sendPasswordResetEmail(email)
        .then(() => true)
        .catch(e => {
            if (msg[e.code]) message.danger(msg[e.code])
            else message.danger('注册失败')
        });
}


/**
 * 调用云函数
 * @param {*} handlerName 
 * @param {*} data 
 */
const callFunction = async (handlerName, data = {}) => {
    if (tcb.app) {
        if (__DEBUGGER__) {
            console.log(JSON.stringify({ handlerName, ...data }))
        }
        return await tcb.app.callFunction({
            name: 'comment_server',
            data: { handlerName, ...data }
        }).then(({ result }) => {
            if (result.code === 0) return result.data
            else message.danger(result.message)
        }).catch(e => {
            if (msg[e.code]) message.danger(msg[e.code])
        })
    } else {
        message.danger('未找到 CloudBase 初始化数据')
    }
}


/**
 * 用于长列表延迟批量获取
 * @param {*} hash 
 * @param {*} callback 
 */
const getBatchPV = (() => {
    let cache = {}
    let _settimeout = null
    return (hash, callback) => {
        if (!cache[hash]) {
            cache[hash] = []
        }
        cache[hash].push(callback)
        clearTimeout(_settimeout)
        _settimeout = setTimeout(() => {
            callFunction('getBatchPV', {
                hash: Object.keys(cache)
            }).then(res => {
                res.forEach(item => {
                    cache[item.hash].forEach(cb => cb(item.count))
                    delete cache[item.hash]
                })
                Object.keys(cache).forEach(key => {
                    cache[key].forEach(cb => cb())
                })
                cache = {}
            })
        }, 200);
    }
})();

export default {
    initApp,
    login,
    regster,
    reset,
    callFunction,
    getBatchPV,
    get cloudbase () {
        if (tcb.app) {
            return tcb
        } else {
            message.danger('未找到 CloudBase 初始化数据')
        }
    }
}
