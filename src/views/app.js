
import { VueElement, defineComponent, createApp, h } from 'vue'
import message from '+/message'
import coms from '+/'
import store from 's/'

/**
 * 修改defineCustomElement，支持将方法挂载到，自定义元素上 
 * @param {*} options 
 * @param {*} hydate 
 * @returns 
 */
const defineCustomElement = (options, hydate) => {
    const Comp = defineComponent(options);
    class VueCustomElement extends VueElement {
        constructor(initialProps) {
            super(Comp, initialProps, hydate);
        }

        connectedCallback () {
            super.connectedCallback()
            if (Comp.exportMethods) {
                Object.keys(Comp.exportMethods).forEach(key => {
                    this[key] = function (...res) {
                        if (this._instance) {
                            return Comp.exportMethods[key].call(this._instance.proxy, ...res)
                        } else {
                            debugWarn('defineCustomElement', '未找到组件实例！')
                        }
                    }
                })
            }
        }
    }
    VueCustomElement.def = Comp;
    return VueCustomElement;
}

/**
 * 抽取子组件样式  @see https://github.com/vuejs/vue-loader/issues/1881
 * @param {*} 
 * @returns 
 */
const deepStylesOf = ({ styles = [], components = {} }) => {
    const unique = array => [...new Set(array)];
    return unique([...styles, ...Object.values(components).flatMap(deepStylesOf)]);
}

/**
 * 创建实例
 * @param {*} com 
 * @param {*} props 
 * @returns 
 */
const createVueApp = (com, props) => {
    const app = createApp(com, { ...props })
    // 全局注册组件 
    let styles = deepStylesOf(com)
    coms.forEach(item => {
        styles.push(...deepStylesOf(item))
        app.component(item.name, item)
    })
    styles = [...new Set(styles)].join('')
    app.config.globalProperties.$message = message
    app.config.globalProperties.$store = store

    const requireAll = requireContext => requireContext.keys().map(requireContext).map(e => e.default.content);
    const req = require.context('../assets/', true, /\.svg$/);
    const icons = requireAll(req)

    return {
        app,
        styles,
        icons
    }
}

/**
 * 创建customElements组件
 * @param {*} App 组件
 * @param {*} exportMethods 扩展方法
 * @returns 
 */
export const createComponent = (App = { props: {} }, exportMethods = {}) => ({
    props: { ...App.props },
    render () {
        return [
            h('style', { ref: 'style' }),
            h('svg', { ref: 'svg', xmlns: 'http://www.w3.org/2000/svg', 'xmlns:xlink': 'http://www.w3.org/1999/xlink', style: 'position: absolute;height: 0;width: 0;overflow: hidden;' }),
            h('div', { ref: 'app' })
        ]
    },
    mounted () {
        const { app, styles, icons = [] } = createVueApp(App, { ...this.$props })// 注入样式
        this.$refs.style.innerHTML = styles
        this.$refs.svg.innerHTML = icons.join('')
        app.mount(this.$refs.app)
    },
    exportMethods: {
        ...exportMethods
    }
})

/**
 * 注册customElements
 * @param {*} data 
 */
export const registe = async (data) => {
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            //处理子组件样式
            const component = data[key]
            component.styles = deepStylesOf(component)
            let name = key.replace(/([A-Z])/g, "-$1").toLowerCase().replace('-', '')
            !customElements.get(name) && customElements.define(name, defineCustomElement(component))
        }
    }
}