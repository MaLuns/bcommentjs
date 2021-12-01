import { h, render } from 'vue'
import Message from './message.vue'

const div = document.createElement('div')
div.setAttribute("class", "com-message")
const v = h(Message, {})
render(v, div)

const show = (props) => {
    let { duration = 2500 } = props
    if (!document.body.contains(div)) {
        document.body.append(div)
    }
    let id = v.component.ctx.add(props)
    setTimeout(() => {
        v.component.ctx.remove(id)
    }, duration);
}

const opt = { show }
const fun = ['info', 'warning', 'error']
fun.forEach(key => {
    opt[key] = (text) => show({
        text,
        type: key
    })
})

export default opt