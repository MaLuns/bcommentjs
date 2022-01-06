
/**
 * 初始化cloudbase
 */
const tcb = require("@cloudbase/node-sdk");
const { validata, formatRes, RES_CODE, extend } = require("./utils");
const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const auth = app.auth()
const db = app.database();

let admin_email = '';
let config = {
    site_name: '',// 站点名称
    site_logo: '',// loggo
    nick: '',// 昵称
    tag: '博主',// 评论标识
    limit_per_minute_user: 10,// 个人限流
    limit_thirty_minute_all: 150,// 全部限流
    is_audit: true,//评论审核
    form: { // 控制提交评论必填项
        nick: true,
        email: true,
        link: false,
    },
    gavatar_url: 'https://gravatar.loli.net/avatar/$hash?d=mp',// 配置 gavatar 国内镜像源
    is_use_qq_avatar: false, // 是否启用QQ头像
    is_show_deleted: false,// 显示已删除

    smtp_host: null, // SMTP 服务器配置
    smtp_port: null,// SMTP 端口
    smtp_secure: true,
    sender_email: null,// 发送邮箱
    sender_pass: null,// 邮箱密钥

    sender_name: '',// 邮件发送人名称
    subject: '', // 邮件主题
    is_email_template: false,// 是否使用自定义模版
    email_template_ejs: '',// 自定义模版
};


/**
 * 写入配置
 * @param {*} newConfig 
 * @returns 
 */
const writeConfig = async (newConfig) => {
    if (!Object.keys(newConfig).length) return 0
    console.info('写入配置：', newConfig)
    try {
        let { updated } = await db
            .collection('db_config')
            .doc('192771')
            .set({ ...newConfig })
        return updated
    } catch (e) {
        console.error('写入配置失败：', e)
        return null
    }
}

/**
 * 创建数据库集合
 * @param {*} db 
 * @returns 
 */
const createCollections = async () => {
    const collections = ['db_comments', 'db_articles', 'db_site', 'db_config', 'db_no_notice']
    const res = {}
    for (const collection of collections) {
        try {
            res[collection] = db.createCollection(collection)
        } catch (e) {
            console.error('建立数据库失败：', e)
            throw new Error('建立数据库失败')
        }
    }
    await writeConfig(config)
    return res
}

/**
 * 读取配置
 * @returns 
 */
const initConfig = async (context) => {
    try {
        // 获取环境变量
        const { environ, environment } = tcb.parseContext(context)
        const env = environment || environ
        admin_email = env['ADMIN']
        // 初始化配置
        const res = await db.collection('db_config').where({ _id: '192771' }).field({ _id: false }).get()
        console.log(res);
        if (res.data[0]) {
            config = extend(config, res.data[0])
        } else {
            await writeConfig(config)
        }
    } catch (e) {
        console.error('读取配置失败：', e)
        await createCollections()
        // config = {}
    }
}

/**
 * 过滤配置信息
 */
const filterConfig = () => {
    let userConfig = {}
    let keys = ['gavatar_url', 'is_use_qq_avatar', 'form']
    keys.forEach(key => {
        userConfig[key] = config[key]
    })
    return userConfig
}

/**
 * 获取配置
 * @param {*} event 
 * @returns 
 */
const getConfig = async (event) => {
    const is_admin = await isAdministrator()
    let _config = { ...config }
    if (!is_admin) {
        _config = filterConfig(config)
    }
    return formatRes({ ..._config, is_admin })
}

/**
 * 修改配置
 * @param {*} event 
 */
const updateConfig = async (event) => {
    const isAdmin = await isAdministrator()
    if (isAdmin) {
        validata(event, ['config'])
        let newConfig = {}
        Object.keys(config).forEach(key => {
            newConfig[key] = Object.hasOwnProperty.call(event.config, key) ? event.config[key] : config[key]
        })
        let count = await writeConfig(newConfig)
        return count > 0 ? formatRes(null) : formatRes(null, RES_CODE.FAIL, '配置更新失败')
    } else {
        return formatRes(null, RES_CODE.NEED_LOGIN)
    }
}

/**
 * 获取IP
 * @returns 
 */
const getIp = () => auth.getClientIP()


/**
 * 获取用户uid
 * @returns 
 */
const getUid = async () => {
    let { userInfo } = await auth.getEndUserInfo()
    return userInfo.uid
}

/**
 * 获取登录人信息
 * @returns 
 */
const getUserInfo = async () => {
    let { TCB_UUID } = tcb.getCloudbaseContext();
    const { userInfo } = await auth.getEndUserInfo(TCB_UUID)
    return userInfo
}

/**
 * 获取管理员邮箱
 * @returns 
 */
const getEnvEmail = () => admin_email;

/**
 * 判断用户是否管理员
 * @returns 
 */
const isAdministrator = async () => {
    try {
        const { TCB_UUID } = tcb.getCloudbaseContext();
        const { userInfo } = await auth.getEndUserInfo(TCB_UUID)
        const adminEmail = getEnvEmail()
        if (userInfo && userInfo.email) {
            return adminEmail === userInfo.email
        }
        return false
    } catch (error) {
        console.error('验证失败：', error)
        return false
    }
};

/**
 * 过滤非管理员
 */
const notAdminLimit = async () => {
    if (!await isAdministrator()) {
        throw new Error('当前登陆非管理员账户，请切换账户')
    }
}


module.exports = {
    app,
    db,
    _: db.command,
    $: db.command.aggregate,
    getUid,
    getIp,
    getUserInfo,
    initConfig,
    getConfig,
    updateConfig,
    isAdministrator,
    notAdminLimit,
    getEnvEmail,
    get config () {
        return config
    }
}