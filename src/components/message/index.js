import { appendStyle } from '@/util'
import { h, render, TransitionGroup } from 'vue'
import style from './index.less'

const v = h({
    data () {
        return {
            list: []
        }
    },
    created () {
        this.id = 0
        appendStyle(style)
    },
    render () {
        return (
            <div class="m-message">
                <TransitionGroup name="offset">
                    {this.list.map(item => (
                        <div class="m-message-item" key={item.id}>
                            <span class="m-message-tag" class={item.type}></span>
                            <span class="m-message-title">{item.text}</span>
                        </div>
                    ))}
                </TransitionGroup>
            </div>
        )
    },
    methods: {
        add (element) {
            let item = {
                id: this.id,
                ...element
            }
            this.id++
            this.list.push(item)
            return item.id
        },
        remove (id) {
            this.list = this.list.filter(item => item.id !== id)
        }
    },
}, {})

const div = document.createElement('div')
div.setAttribute('class', 'com-message')
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

const opt = { show };
['info', 'success', 'warning', 'danger'].forEach(type => {
    opt[type] = (text) => show({ text, type })
});

export default opt