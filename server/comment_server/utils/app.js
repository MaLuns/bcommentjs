
/**
 * 初始化cloudbase
 */
const tcb = require("@cloudbase/node-sdk");
const app = tcb.init({ env: tcb.SYMBOL_CURRENT_ENV });
const auth = app.auth()
const db = app.database();

let config = {
    site_name: '',// 站点名称
    is_notice: null,// 
    notice_type: null, // 通知方法 0邮件 ... 其他类型待集成
    email_template: 0,// 邮件模板
    sender_name: '',// 邮件发送人名称
    subject: '', // 邮件主题
    sender_emali: null,// 发送邮箱
    sender_pass: null,// 邮箱密钥
    smtp_host: null, // SMTP 服务器配置
    smtp_port: null,
    smtp_secure: true,
    limit_per_minute_user: 10, // 默认单人每分钟10条
    limit_thirty_minute_all: 150,// 默认所有人三十分钟150条
    is_audit: true, // 是否需要审核
    gavatar_url: 'https://gravatar.loli.net/avatar/',// 配置 gavatar 国内镜像源
    tag: '博主', // 博主标识
    is_use_qq_avatar: false, // 是否启用QQ头像
    form: { // 控制提交评论必填项
        nick: true,
        email: true,
        link: false,
    }
};


/**
 * 初始化写入默认配置
 * @returns 
 */
const initDefaultConfig = async () => await db.collection('db_config').add(config)


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
    await initDefaultConfig()
    return res
}


/**
 * 读取配置
 * @param {*} db 
 * @returns 
 */
const initConfig = async () => {
    try {
        const res = await db.collection('db_config').limit(1).get()
        if (res.data[0]) {
            config = res.data[0]
        } else {
            await initDefaultConfig()
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
 * 判断用户是否管理员
 * @returns 
 */
const isAdministrator = async (context) => {
    try {
        let { TCB_UUID } = tcb.getCloudbaseContext();
        const { userInfo } = await auth.getEndUserInfo(TCB_UUID)
        let { environ, environment } = tcb.parseContext(context)
        const env = environment || environ
        if (userInfo && userInfo.email && env) {
            return environment['ADMIN'] === userInfo.email
        }
        return false
    } catch (error) {
        tcb.Log.error(error)
        return false
    }
};


module.exports = {
    app,
    db,
    _: db.command,
    $: db.command.aggregate,
    getUid,
    getIp,
    initConfig,
    filterConfig,
    isAdministrator,
    get config () {
        return config
    }
}