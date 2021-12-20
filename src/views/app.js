
import { VueElement, defineComponent, createApp } from 'vue'
import message from '+/message'
import coms from '+/'
import store from 's/'


/**
 * 修改defineCustomElement，支持将方法挂载到，自定义元素上 
 * @param {*} options 
 * @param {*} hydate 
 * @returns 
 */
export const defineCustomElement = (options, hydate) => {
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
export const deepStylesOf = ({ styles = [], components = {} }) => {
    const unique = array => [...new Set(array)];
    return unique([...styles, ...Object.values(components).flatMap(deepStylesOf)]);
}

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

/**
 * 创建实例
 * @param {*} com 
 * @param {*} props 
 * @returns 
 */
export const createVueApp = (com, props) => {
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

    return {
        app,
        styles
    }
}