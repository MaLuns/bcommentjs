
import { getScrollWidth, hasScrollbar } from '@/util'
import { TransitionGroup } from 'vue'

export default {
    name: 'm-model',
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
        scroll: {
            type: Boolean,
            default: true
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
        if (this.scroll) {
            document.body.style.width = null;
            document.body.style.overflow = null;
        }
    },
    watch: {
        modelValue: {
            immediate: true,
            handler (val) {
                if (this.scroll) {
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
                        <div class="m-model-header">
                            <p class="m-model-title">{this.title}</p>
                            <span class="close-btn" onClick={this.handleClose}>
                                <m-icon name="close2" width="16"></m-icon>
                            </span>
                        </div>
                        <div class="m-model-body" onMousedown={(e) => e.stopPropagation()}>
                            {this.$slots.default?.()}
                        </div>
                    </div> : null
                }
            </TransitionGroup>
        )
    },
}