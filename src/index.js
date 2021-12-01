import { defineCustomElement, createApp } from 'vue'
import ComSiteCount from '~/siteCount'
import ComComment from '~/comment/index.vue'

const customElementObj = {
    ComSiteCount,
    ComComment
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
 * 注册customElements
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

registe(customElementObj)


export default {
    setConfig () {
        console.log(1);
    }
}