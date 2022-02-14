import { VueElement, defineComponent, createApp, h, withDirectives } from 'vue'
import { debugWarn } from '@/util';
import styleModule from 'css/index.less'
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
const createVueApp = (com, props, slots = []) => {
    const app = createApp({
        render () {
            const slotObj = {}
            slots.forEach(item => {
                slotObj[item.slot] = () => h(item.tagName, { innerHTML: item.innerHTML })
            })
            return h(defineComponent(com), { ...props }, slotObj)
        }
    })
    // 全局注册组件 
    let styles = deepStylesOf(com)
    coms.forEach(item => {
        styles.push(...deepStylesOf(item))
        app.component(item.name, item)
    })
    styles = [...new Set(styles)].join('')
    // 挂载 store
    app.config.globalProperties.$message = message
    app.config.globalProperties.$store = store

    const requireAll = requireContext => requireContext.keys().map(requireContext).map(e => e.default.content);
    const req = require.context('../assets/svg/', true, /\.svg$/);
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
    props: {
        ...App.props,
        highlight: {
            type: String,
            default: 'monokai_sublime'
        }
    },
    render () {
        return [
            h('link', { rel: 'stylesheet', href: `//unpkg.com/highlightjs@9.16.2/styles/${this.highlight}.css` }),
            h('svg', { ref: 'svg', style: 'position: absolute;height: 0;width: 0;overflow: hidden;' }),
            h('style', { ref: 'style' }),
            h('div', { ref: 'app' })
        ]
    },
    mounted () {
        // 获取插槽
        const root = this.$root.$el.parentNode.getRootNode().host
        const slots = root.querySelectorAll('[slot]')
        // eslint-disable-next-line no-unused-vars
        const { highlight, ...prop } = this.$props
        const { app, styles, icons = [] } = createVueApp(App, prop, slots)// 注入样式
        this.$refs.style.innerHTML = styles + styleModule
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
            // 处理子组件样式
            const component = data[key]
            component.styles = deepStylesOf(component)
            let name = key.replace(/([A-Z])/g, '-$1').toLowerCase().replace('-', '')
            !customElements.get(name) && customElements.define(name, defineCustomElement(component))
        }
    }
}