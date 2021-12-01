import md5 from 'md5'

/**
 * 
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
 * 
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

/**
 * 获取滚动条宽度
 * @returns 
 */
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

/**
 * 正则
 */
export const regexp = {
    emali: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, // 邮箱
    qq: /^[1-9][0-9]{6,}@qq.com/, // qq邮箱
    pass: /^(?=.*\d)(?=.*[a-zA-Z]).{8,32}$/,//密码
    link: /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+$/, // 网址
    nick: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/ // 昵称
}