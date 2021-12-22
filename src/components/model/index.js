
import { getScrollWidth, hasScrollbar } from '@/util'
import { TransitionGroup } from 'vue'

export default {
    name: 'MModel',
    computed: {
        style () {
            return {
                width: this.width + 'px',
                left: (window.innerWidth - this.width) / 2 + 'px'
            }
        }
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        maskClose: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            default: 360
        },
        title: {
            type: String,
            default: "提示"
        },
    },
    methods: {
        handleClick () {
            if (this.maskClose) {
                this.handleClose()
            }
        },
        handleClose () {
            this.$emit('update:modelValue', false)
        }
    },
    unmounted () {
        document.body.style.width = null;
        document.body.style.overflow = null;
    },
    watch: {
        modelValue: {
            immediate: true,
            handler (val) {
                if (val) {
                    if (hasScrollbar()) {
                        document.body.style.width = `calc(100% - ${getScrollWidth()}px)`;
                        document.body.style.overflow = "hidden";
                    }
                } else {
                    document.body.style.width = null;
                    document.body.style.overflow = null;
                }
            }
        }
    },
    directives: {
        drag: {
            mounted (el) {
                el.onmousedown = (ev) => {
                    const eh = el.clientHeight
                    const ew = el.clientWidth

                    // 鼠标按下的位置
                    const mouseXStart = ev.clientX;
                    const mouseYStart = ev.clientY;
                    // 当前滑块位置
                    const rectLeft = el.offsetLeft;
                    const rectTop = el.offsetTop;
                    document.onmousemove = (e) => {
                        // 鼠标移动的位置
                        const mouseXEnd = e.clientX;
                        const mouseYEnd = e.clientY;
                        const moveX = mouseXEnd - mouseXStart + rectLeft;
                        const moveY = mouseYEnd - mouseYStart + rectTop;
                        // 限制不可移出屏幕外
                        el.style["top"] = Math.min(Math.max(0, moveY), window.innerHeight - eh) + "px";
                        el.style["left"] = Math.min(Math.max(0, moveX), window.innerWidth - ew) + "px";
                    };
                    document.onmouseup = () => {
                        // 取消事件
                        document.onmousemove = null;
                    };
                };
            },
        },
    },
    render () {
        return (
            <TransitionGroup name="opacity">
                {this.modelValue ? <div key="mask" class="m-model-mask" onClick={this.handleClick}></div> : null}
                {this.modelValue ?
                    <div class="m-model" key="model" style={this.style} v-drag>
                        <div class="header">
                            <p class="title">{this.title}</p>
                            <span class="close-btn" onClick={this.handleClose}>
                                <svg t="1638021668280" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34194" width="16" height="16">
                                    <path d="M548.992 503.744L885.44 167.328a31.968 31.968 0 1 0-45.248-45.248L503.744 458.496 167.328 122.08a31.968 31.968 0 1 0-45.248 45.248l336.416 336.416L122.08 840.16a31.968 31.968 0 1 0 45.248 45.248l336.416-336.416L840.16 885.44a31.968 31.968 0 1 0 45.248-45.248L548.992 503.744z" p-id="34195" />
                                </svg>
                            </span>
                        </div>
                        <div class="body" onMousedown={(e) => e.stopPropagation()}>
                            {this.$slots.default?.()}
                        </div>
                    </div> : null
                }
            </TransitionGroup>
        )
    },
}