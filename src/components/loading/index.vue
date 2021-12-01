<script>
import { h } from 'vue'
export default {
    render () {
        return h('div', {
            class: 'loading-box',
            style: ({
                color: this.color
            })
        }, [
            h('div'),
            h('div')
        ])
    },
    props: {
        color: {
            type: String,
            default: "#f4696b"
        }
    }
}
</script>
<style lang="less" scoped>
.loading-box {
    position: relative;
    display: block;
    margin: auto;
    font-size: 0;
    width: 32px;
    height: 32px;
    color: #333;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    div {
        position: absolute;
        left: 0;
        width: 100%;
        display: inline-block;
        float: none;
        background-color: currentColor;
        border: 0 solid currentColor;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    > div:nth-child(1) {
        top: -25%;
        z-index: 1;
        height: 100%;
        border-radius: 10%;
        -webkit-animation: loading-box-animate 0.6s -0.1s linear infinite;
        -moz-animation: loading-box-animate 0.6s -0.1s linear infinite;
        -o-animation: loading-box-animate 0.6s -0.1s linear infinite;
        animation: loading-box-animate 0.6s -0.1s linear infinite;
    }
    > div:nth-child(2) {
        bottom: -9%;
        height: 10%;
        background: #000;
        border-radius: 50%;
        opacity: 0.2;
        -webkit-animation: loading-box-shadow 0.6s -0.1s linear infinite;
        -moz-animation: loading-box-shadow 0.6s -0.1s linear infinite;
        -o-animation: loading-box-shadow 0.6s -0.1s linear infinite;
        animation: loading-box-shadow 0.6s -0.1s linear infinite;
    }
}

/*
 * Animations
 */
@-webkit-keyframes loading-box-animate {
    17% {
        border-bottom-right-radius: 10%;
    }
    25% {
        -webkit-transform: translateY(25%) rotate(22.5deg);
        transform: translateY(25%) rotate(22.5deg);
    }
    50% {
        border-bottom-right-radius: 100%;
        -webkit-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
        transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    }
    75% {
        -webkit-transform: translateY(25%) rotate(67.5deg);
        transform: translateY(25%) rotate(67.5deg);
    }
    100% {
        -webkit-transform: translateY(0) rotate(90deg);
        transform: translateY(0) rotate(90deg);
    }
}
@-moz-keyframes loading-box-animate {
    17% {
        border-bottom-right-radius: 10%;
    }
    25% {
        -moz-transform: translateY(25%) rotate(22.5deg);
        transform: translateY(25%) rotate(22.5deg);
    }
    50% {
        border-bottom-right-radius: 100%;
        -moz-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
        transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    }
    75% {
        -moz-transform: translateY(25%) rotate(67.5deg);
        transform: translateY(25%) rotate(67.5deg);
    }
    100% {
        -moz-transform: translateY(0) rotate(90deg);
        transform: translateY(0) rotate(90deg);
    }
}
@-o-keyframes loading-box-animate {
    17% {
        border-bottom-right-radius: 10%;
    }
    25% {
        -o-transform: translateY(25%) rotate(22.5deg);
        transform: translateY(25%) rotate(22.5deg);
    }
    50% {
        border-bottom-right-radius: 100%;
        -o-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
        transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    }
    75% {
        -o-transform: translateY(25%) rotate(67.5deg);
        transform: translateY(25%) rotate(67.5deg);
    }
    100% {
        -o-transform: translateY(0) rotate(90deg);
        transform: translateY(0) rotate(90deg);
    }
}
@keyframes loading-box-animate {
    17% {
        border-bottom-right-radius: 10%;
    }
    25% {
        -webkit-transform: translateY(25%) rotate(22.5deg);
        -moz-transform: translateY(25%) rotate(22.5deg);
        -o-transform: translateY(25%) rotate(22.5deg);
        transform: translateY(25%) rotate(22.5deg);
    }
    50% {
        border-bottom-right-radius: 100%;
        -webkit-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
        -moz-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
        -o-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
        transform: translateY(50%) scale(1, 0.9) rotate(45deg);
    }
    75% {
        -webkit-transform: translateY(25%) rotate(67.5deg);
        -moz-transform: translateY(25%) rotate(67.5deg);
        -o-transform: translateY(25%) rotate(67.5deg);
        transform: translateY(25%) rotate(67.5deg);
    }
    100% {
        -webkit-transform: translateY(0) rotate(90deg);
        -moz-transform: translateY(0) rotate(90deg);
        -o-transform: translateY(0) rotate(90deg);
        transform: translateY(0) rotate(90deg);
    }
}
@-webkit-keyframes loading-box-shadow {
    50% {
        -webkit-transform: scale(1.25, 1);
        transform: scale(1.25, 1);
    }
}
@-moz-keyframes loading-box-shadow {
    50% {
        -moz-transform: scale(1.25, 1);
        transform: scale(1.25, 1);
    }
}
@-o-keyframes loading-box-shadow {
    50% {
        -o-transform: scale(1.25, 1);
        transform: scale(1.25, 1);
    }
}
@keyframes loading-box-shadow {
    50% {
        -webkit-transform: scale(1.25, 1);
        -moz-transform: scale(1.25, 1);
        -o-transform: scale(1.25, 1);
        transform: scale(1.25, 1);
    }
}
</style>