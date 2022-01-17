import md5 from 'md5'


/**
 * 错误日志
 */
class CommentjsError extends Error {
    constructor(m) {
        super(m)
        this.name = 'CommentjsError'
    }
}

/**
 * 在光标处插入文本
 * @param {*} edit 
 * @param {*} val 
 * @param {*} shadowRoot 
 * @param {*} lastEditRange 
 */
export const insertAtCaret = (edit, val, shadowRoot, lastEditRange) => {
    // 编辑框设置焦点
    edit.focus()
    // 获取选定对象
    var selection = shadowRoot.getSelection()
    // 判断是否有最后光标对象存在
    if (lastEditRange) {
        // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
        selection.removeAllRanges()
        selection.addRange(lastEditRange)
    }

    // 判断选定对象范围是编辑框还是文本节点
    if (selection.anchorNode.nodeName != '#text') {
        // 如果是编辑框范围。则创建表情文本节点进行插入
        var emojiText = document.createTextNode(val)

        if (edit.childNodes.length > 0) {
            // 如果文本框的子元素大于0，则表示有其他元素，则按照位置插入表情节点
            for (var i = 0; i < edit.childNodes.length; i++) {
                if (i == selection.anchorOffset) {
                    edit.insertBefore(emojiText, edit.childNodes[i])
                }
            }
        } else {
            // 否则直接插入一个表情元素
            edit.appendChild(emojiText)
        }
        // 创建新的光标对象
        var range = document.createRange()
        // 光标对象的范围界定为新建的表情节点
        range.selectNodeContents(emojiText)
        // 光标位置定位在表情节点的最大长度
        range.setStart(emojiText, emojiText.length)
        // 使光标开始和光标结束重叠
        range.collapse(true)
        // 清除选定对象的所有光标对象
        selection.removeAllRanges()
        // 插入新的光标对象
        selection.addRange(range)
    } else {
        // 如果是文本节点则先获取光标对象
        var range = selection.getRangeAt(0)
        // 获取光标对象的范围界定对象，一般就是textNode对象
        var textNode = range.startContainer;
        // 获取光标位置
        var rangeStartOffset = range.startOffset;
        // 文本节点在光标位置处插入新的表情内容
        textNode.insertData(rangeStartOffset, val)
        // 光标移动到到原来的位置加上新内容的长度
        range.setStart(textNode, rangeStartOffset + val.length)
        // 光标开始和光标结束重叠
        range.collapse(true)
        // 清除选定对象的所有光标对象
        selection.removeAllRanges()
        // 插入新的光标对象
        selection.addRange(range)
    }
    // 无论如何都要记录最后光标对象
    lastEditRange = selection.getRangeAt(0)
    return lastEditRange
}

/**
 * 打印提示
 * @param {*} name 
 * @param {*} message 
 */
export const debugWarn = (name, message) => {
    if (process.env.NODE_ENV !== 'production') {
        console.warn(new CommentjsError(`[${name}] ${message}`))
    }
}

/**
 * 注入样式body
 * @param {*} styleTxt 
 */
export const appendStyle = (styleTxt) => {
    let id = md5(styleTxt);
    if (!document.getElementById(id)) {
        let style = document.createElement('style')
        style.id = id
        style.innerHTML = styleTxt
        document.head.appendChild(style)
    }
}

/**
 * 判断 val 是 null,undefined或者是空字符
 * @param {*} val 
 * @returns 
 */
export const IsNullOrEmpty = (val) => [null, undefined, ''].includes(val)

// 获取滚动条宽度
let cached;
export const getScrollWidth = () => {
    if (cached === undefined) {
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        document.body.removeChild(outer);

        cached = widthContained - widthScroll;
    }
    return cached;
}

// 是否有滚动条
export const hasScrollbar = () => {
    return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight)
}

// 防抖
export const debounce = function (fn, time = 300) {
    let _setTimeout = null;
    return function (...args) {
        _setTimeout && clearTimeout(_setTimeout);
        _setTimeout = setTimeout(() => {
            fn(...args)
        }, time);
    }
}

// 节流
export const throttle = function (fn, time) {
    let isRun = false;
    return function (...args) {
        if (!isRun) {
            isRun = true;
            setTimeout(() => {
                fn(...args);
                isRun = false
            }, time);
        }
    }
}

// 正则
export const regexp = {
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, // 邮箱
    qq: /^[1-9][0-9]{6,}@qq.com/, // qq邮箱
    pass: /^(?=.*\d)(?=.*[a-zA-Z]).{8,32}$/,//密码
    link: /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+$/, // 网址
    nick: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/ // 昵称
}

// 表情转换
export const emojiParse = (emojiList, str) => String(str).replace(/::(.+?)::/g, (placeholder, key) => {
    let keys = Object.keys(emojiList);
    for (let index = 0; index < keys.length; index++) {
        const item = emojiList[keys[index]];
        if (['image'].includes(item.type)) {
            let emoji = item.container.find(element => element.text === key)
            if (emoji) { return `<i class="emoji-icon"><img alt referrerpolicy="no-referrer" src="${emoji.icon}" /></i>`; }
        }
    }
    return placeholder
})

// 时间格式化
export const format = (time, fmt) => {
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

export const timeAgo = (date) => {
    if (date) {
        try {
            var oldTime = date.getTime();
            var currTime = new Date().getTime();
            var diffValue = currTime - oldTime;

            var days = Math.floor(diffValue / (24 * 3600 * 1000));
            if (days === 0) {
                //计算相差小时数
                var leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                if (hours === 0) {
                    //计算相差分钟数
                    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
                    var minutes = Math.floor(leave2 / (60 * 1000));
                    if (minutes === 0) {
                        //计算相差秒数
                        var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
                        var seconds = Math.round(leave3 / 1000);
                        return seconds + `秒前`;
                    }
                    return minutes + `分钟前`;
                }
                return hours + `小时前`;
            }
            if (days < 0) return '刚刚';

            if (days < 8) {
                return days + `天前`;
            } else if (days > 7 && days < 31) {
                return parseInt(days / 7) + `周前`
            } else if (days > 30 && days < 365) {
                return Math.ceil(days / 31) + `月前`
            } else {
                return format(date, 'yyyy-MM-dd hh:mm')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

// 获取当前script
export const getCurrentScript = () => {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
        return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
        return document.currentScript
    }

    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
        throw new Error();
    }
    catch (err) {
        // Find the second match for the "at" string to get file src url from stack.
        var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
            ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
            stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
            scriptLocation = (stackDetails && stackDetails[1]) || false,
            line = (stackDetails && stackDetails[2]) || false,
            currentLocation = document.location.href.replace(document.location.hash, ''),
            pageSource,
            inlineScriptSourceRegExp,
            inlineScriptSource,
            scripts = document.getElementsByTagName('script'); // Live NodeList collection

        if (scriptLocation === currentLocation) {
            pageSource = document.documentElement.outerHTML;
            inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
            inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
        }

        for (var i = 0; i < scripts.length; i++) {
            // If ready state is interactive, return the script tag
            if (scripts[i].readyState === 'interactive') {
                return scripts[i];
            }

            // If src matches, return the script tag
            if (scripts[i].src === scriptLocation) {
                return scripts[i];
            }

            // If inline source matches, return the script tag
            if (
                scriptLocation === currentLocation &&
                scripts[i].innerHTML &&
                scripts[i].innerHTML.trim() === inlineScriptSource
            ) {
                return scripts[i];
            }
        }

        // If no match, return null
        return null;
    }
}