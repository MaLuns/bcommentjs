<template>
    <div class="comment-item">
        <m-avatar :src="getAvatar(comment)"></m-avatar>
        <div class="comment-user-container">
            <span class="comment-user-top" v-if="comment.top">
                <!-- <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
                    <path d="M1023.914667 481.860267L542.1568 1.0752H0.477867l1023.4368 1022.344533z" fill="#ff5252" />
                    <path d="M590.609067 217.719467l-51.541334-51.4048-148.906666 148.957866-38.570667-38.5024 148.906667-148.957866-51.421867-51.285334 31.4368-31.4368 141.533867 141.175467-31.4368 31.453867z m-45.568 76.6464c28.245333-28.2624 59.511467-43.008 93.764266-44.288 34.2528-1.262933 64.938667 11.639467 92.074667 38.690133 25.8048 25.736533 37.9904 55.04 36.573867 87.893333-1.399467 32.8704-15.581867 62.7712-42.513067 89.7024-28.091733 28.1088-59.0848 42.752-92.945067 43.946667-33.860267 1.194667-64.0512-11.434667-90.555733-37.888-25.890133-25.8048-38.434133-55.261867-37.632-88.354133 0.785067-33.092267 14.5408-62.976 41.233067-89.7024z m42.564266 38.263466c-17.544533 17.544533-27.648 36.113067-30.327466 55.7056-2.6624 19.592533 3.396267 36.7616 18.158933 51.490134 15.086933 15.035733 32.1536 21.4016 51.217067 19.114666 19.063467-2.321067 37.614933-12.458667 55.620266-30.481066 18.773333-18.773333 29.5424-37.717333 32.290134-56.763734 2.730667-19.0464-3.310933-35.976533-18.158934-50.773333-15.069867-15.0528-32.546133-21.2992-52.394666-18.773333-19.831467 2.542933-38.638933 12.6976-56.405334 30.481066z m189.661867 243.1488l-62.8736 62.8736-38.485333-38.365866 180.360533-180.394667 62.122667 61.986133c44.936533 44.8 48.384 86.237867 10.359466 124.279467-18.4832 18.4832-40.072533 26.5216-64.768 24.132267-24.695467-2.389333-47.0016-13.9776-66.901333-34.747734l-19.8144-19.7632z m87.671467-87.7056l-58.2144 58.231467 16.674133 16.64c22.613333 22.545067 43.741867 24.0128 63.3856 4.369067 19.165867-19.165867 17.5616-39.936-4.829867-62.2592l-17.015466-16.981334z" fill="#FFFFFF" />
                </svg>-->
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48">
                    <path d="M73.143 311h329.143v402.286H73.143C32.747 713.286 0 680.539 0 640.143v-256C0 343.747 32.747 311 73.143 311z" fill="#ffffff" />
                    <path d="M402.286 311v402.286H73.143C32.747 713.286 0 680.539 0 640.143v-256C0 343.747 32.747 311 73.143 311h329.143zM384 695V329.286H73.143c-29.215 0-53.096 22.837-54.764 51.634l-0.093 3.223v256c0 29.215 22.837 53.095 51.634 54.764l3.223 0.093H384z" fill="#ff5252" />
                    <path d="M950.857 311.5H394.443v401.286h556.414c20.06 0 38.22-8.131 51.366-21.277s21.277-31.306 21.277-51.366v-256c0-20.06-8.13-38.22-21.277-51.366-13.145-13.146-31.306-21.277-51.366-21.277z" fill="#ff5252" />
                    <path d="M701.733 602.182v-12.727h-31.818v-96.768h-63.634c0.878-3.95 1.536-8.119 2.414-12.508h89.088v-12.068H610.45l1.317-12.727h71.095v-41.033H523.995v41.033h71.973l-1.317 12.727h-85.357v12.068h83.602l-2.414 12.508h-53.32v96.768h-31.818v12.727h196.389zM667.94 444.193h-32.695v-18.212h32.695v18.212z m-47.178 0h-34.67v-18.212h34.67v18.212z m-48.932 0h-32.695v-18.212h32.695v18.212z m82.505 73.29H552.521v-13.825h101.815v13.824z m0 23.698H552.521v-13.824h101.815v13.824z m0 23.917H552.521v-13.824h101.815v13.824z m0 24.357H552.521v-14.482h101.815v14.482z m176.64-31.159V468.55h66.487v89.307h15.58V453.848h-44.106c1.317-7.46 2.194-15.14 2.853-23.04h48.493v-15.36h-111.03v15.36h46.518c-0.658 7.9-1.536 15.58-2.852 23.04h-37.303v104.448h15.36z m-74.606 46.08c12.508 0 18.871-6.583 18.871-19.53V430.809h26.332v-15.36H725.21v15.36h33.792v150.09c0 6.143-2.852 9.435-8.118 9.435-7.242 0-14.922-0.44-22.821-0.878l3.51 14.921h24.796z m44.764 1.975c24.356-7.46 41.91-17.554 52.663-30.281 10.971-13.605 16.676-32.256 17.334-55.516v-39.058h-15.579v39.058c-0.658 18.652-5.266 33.792-14.043 45.422-9.216 11.19-25.454 20.187-48.933 26.99l8.558 13.385z m109.495 1.097l11.41-11.63c-10.752-12.288-24.137-24.356-39.936-36.644l-10.752 10.093c16.676 13.605 29.623 26.332 39.278 38.181z" fill="#FFFFFF" />
                    <path d="M199.295 450.63c4.067 0 8.002 1.69 10.832 4.562L279.45 526.3c4.996 5.154 3.67 9.844 2.83 11.619-0.796 1.816-3.493 5.957-10.876 5.957h-28.87c-0.09 0-0.178 0.084-0.178 0.169v50.785c0 8.07-6.897 14.66-15.341 14.66h-55.487c-8.444 0-15.341-6.59-15.341-14.66v-50.743c0-0.084-0.089-0.169-0.177-0.169h-28.87c-7.384 0-10.081-4.183-10.877-5.957-0.796-1.775-2.166-6.507 2.874-11.661l69.325-71.108c2.83-2.915 6.764-4.563 10.832-4.563z m82.798-42.282a1 1 0 0 1 1 1v31.524a1 1 0 0 1-1 1H116.474a1 1 0 0 1-1-1v-31.524a1 1 0 0 1 1-1h165.619z" fill="#ff5252" />
                </svg>
            </span>
            <template v-if="isAdmin">
                <span class="comment-user-top" v-if="!comment.isAudit">
                    <svg viewBox="0 0 2889 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="56">
                        <path
                            d="M712.994054 73.135021H2742.564028a146.270042 146.270042 0 0 1 146.270043 146.270043v585.08017a146.270042 146.270042 0 0 1-146.270043 146.270042H621.648412v-30.387601a623.110381 623.110381 0 0 0 292.540085-528.217691V229.022319A311.299218 311.299218 0 0 1 712.994054 73.135021z m545.002178 372.440096v34.995108h337.956933v-34.995108h-148.500661v-72.001428h128.498233v-34.51973h-128.498233V269.063743H1407.484215v69.990216h-127.474342v34.483162h127.474342v72.001428h-149.487983z m1.02389 97.964361v34.995108h222.98868v102.974109c0 22.671857-10.348606 34.007785-31.009249 34.007785-23.000964 0-49.000464-1.17016-77.9985-3.510481 3.327643 16.01657 5.997072 29.985359 8.008285 41.979503 32.983895 0.329108 59.166232 0.511945 78.473877 0.511945 41.650395 0 62.493876-19.673321 62.493876-58.983395v-116.979466h77.9985v-34.995108h-77.9985v-47.501196h-40.004857v47.501196H1259.020122z m-155.485055 21.501696c6.655287 13.676249 12.506089 26.986823 17.515838 40.004857a736.469664 736.469664 0 0 0 55.984858-63.225226v220.721494h37.481699v-271.477199a1357.751669 1357.751669 0 0 0 46.001928-72.001428l-34.995108-17.991215c-37.993644 68.30811-78.656715 122.976538-121.989215 163.968717z m0.987323-156.472378c7.679177 11.994143 14.480734 23.842017 20.514373 35.507053 48.013141-40.992179 93.174017-92.99118 135.482627-155.997l-35.507053-20.514374c-33.313002 57.008749-73.500696 103.998-120.489947 141.004321z m190.480163 208.471378a1054.899546 1054.899546 0 0 1 60.482662 75.475342l31.996572-24.500232a1347.183659 1347.183659 0 0 0-63.481198-73.500696l-28.998036 22.525586z m385.970074-185.982359v244.965754h37.006321v-23.512909h127.474342v108.971181h38.980966v-108.971181h127.986288v23.512909h37.00632v-244.965754h-164.992608v-54.010213h-38.980966v54.010213h-164.480663z m-44.50266-104.473378v93.503125h38.980966V362.566868h379.461058v57.484127h38.980966V326.584437h-220.977466l23.512909-14.480734c-10.348606-15.650895-22.342749-32.179409-35.982431-49.512409l-34.483162 20.514373c10.823983 15.175517 20.514373 29.656251 28.998036 43.47877h-218.490876z m247.964289 290.967682v-58.983394h127.986288v58.983394h-127.986288z m-166.491875 0v-58.983394h127.474342v58.983394H1717.942381z m294.478163-151.499196v58.508017h-127.986288v-58.508017h127.986288z m-294.478163 58.508017v-58.508017h127.474342v58.508017H1717.942381z m567.966575 109.483127c9.653823 9.98293 19.161376 20.148698 28.48609 30.497304 114.310038-63.005821 199.987716-144.478234 256.959897-244.490376l-36.494375-19.490484a495.233796 495.233796 0 0 1-49.987787 75.475342c-37.664536 2.340321-74.817127 4.497804-111.49434 6.509017a1423.682891 1423.682891 0 0 0 75.475342-104.473378h176.986751v-36.018998h-152.998464l26.511445-17.515837a1617.45413 1617.45413 0 0 0-43.990715-57.484127l-32.508517 20.514374c11.665036 16.01657 24.317395 34.154055 37.993643 54.48559H2307.410652v35.982431h95.002392a763.602757 763.602757 0 0 1-61.506552 87.98143c-7.679177 9.98293-18.320323 18.64943-31.996572 25.9995l18.50316 36.494376a179.912152 179.912152 0 0 1 34.483163-6.984394c28.010713-2.998536 58.325179-6.179909 90.979966-9.507553-44.978038 47.025819-100.633789 87.68889-166.967253 122.025783z m-158.008214-47.501197c6.326179 14.992679 11.665036 29.656251 16.01657 43.990716 22.671857-32.983895 42.491447-76.82834 59.49534-131.496769v264.968182h37.481698v-256.959897c16.674785 15.321787 33.166732 31.813734 49.512409 49.51241l25.487555-25.487555a1082.325179 1082.325179 0 0 0-59.49534-54.010213l-15.504624 16.491947v-87.981431h57.008749v-34.995107h-57.008749V271.074956h-37.481698v99.500197h-72.001429v34.995107h71.489483a571.659894 571.659894 0 0 1-74.999964 180.97261z m173.000893 145.977503c11.335928 12.981466 20.148698 23.988287 26.511445 32.983894a667.283934 667.283934 0 0 0 167.479199-107.983858 3272.719066 3272.719066 0 0 1 104.985323 98.988251l30.497304-32.508517a3383.226083 3383.226083 0 0 0-107.983859-92.003857 751.169803 751.169803 0 0 0 93.978502-111.49434l-34.007785-23.000964c-73.646966 108.715209-167.479199 187.042817-281.460129 235.019391z"
                            fill="#ff5252"
                        />
                        <path d="M475.37837 1024l-11.372496-3.729886A671.854873 671.854873 0 0 1 0.000731 380.228975V215.858015l26.950256-7.350069A312.286541 312.286541 0 0 0 234.179069 23.074099L243.357515 0h464.005142l9.141878 23.074099a312.286541 312.286541 0 0 0 207.228082 185.433847l27.023391 7.350069v164.37096a671.89144 671.89144 0 0 1-464.005143 640.041139l-11.372495 3.729886zM73.135753 270.672714v109.592829c0 256.338249 161.116452 482.54487 402.242617 566.686712a598.866121 598.866121 0 0 0 402.242616-566.686712V270.672714A386.262615 386.262615 0 0 1 658.618165 73.135021H292.138574A386.262615 386.262615 0 0 1 73.135753 270.672714z" fill="#ff5252" p-id="26620" />
                        <path d="M621.648412 548.512659h-219.405064a36.567511 36.567511 0 0 1-36.56751-36.56751V329.107596a36.567511 36.567511 0 0 1 73.135021 0v146.270042h182.837553a36.567511 36.567511 0 0 1 0 73.135021z" fill="#ff5252" p-id="26621" />
                    </svg>
                </span>
            </template>
            <div class="comment-user-info">
                <template v-if="comment.nick">
                    <a v-if="comment.link" class="comment-user-nick link" rel="nofollow" :href="comment.link" target="_blank" v-text="comment.nick"></a>
                    <span v-else class="comment-user-nick" v-text="comment.nick"></span>
                </template>
                <span class="comment-user-tag" v-if="comment.tag">{{ comment.tag }}</span>
                <span class="comment-user-sys">{{ comment.ua.browser }} {{ comment.ua.version }}</span>
                <span class="comment-user-sys">{{ comment.ua.os }} {{ comment.ua.osVersion }}</span>
            </div>
            <div class="comment-user-text">
                <template v-if="comment.at">
                    <a v-if="comment.at.link" class="comment-replylink link" rel="nofollow" :href="comment.at.link" target="_blank">@{{ comment.at.nick || comment.at.tag }}</a>
                    <span v-else class="comment-replylink">@{{ comment.at.nick || comment.at.tag }}</span>
                </template>
                <div v-html="formatContent(comment.content)"></div>
            </div>
            <div class="comment-user-meta">
                <span class="comment-time">{{ timeAgo(new Date(comment.created)) }}</span>
                <div>
                    <span v-if="comment.isAudit" class="comment-reply" @click="handleReply(comment)">回复</span>
                    <template v-if="isAdmin">
                        <span v-if="!comment.isAudit" class="comment-reply" @click="handleAudit(comment)">审核</span>
                        <span class="comment-reply" @click="handleDelete(comment)">删除</span>
                    </template>
                    <!-- <span class="comment-zan" @click="handleReply(comment)">赞</span> -->
                </div>
            </div>
            <div class="comment-edit-container" v-if="$root.reply && $root.reply.id === comment.id">
                <m-editor :is-admin="isAdmin" isCancel @cancel="handleReply(null)"></m-editor>
            </div>
            <div class="comment-reply-container" v-if="comment.childer && comment.childer.length > 0">
                <template v-if="comment.childer.length < 3">
                    <m-comment-item v-for="element in comment.childer" :key="element.id" :comment="element" :is-admin="isAdmin"></m-comment-item>
                </template>
                <template v-else>
                    <m-comment-item v-for="idx in len" :key="comment.childer[idx - 1].id" :comment="comment.childer[idx - 1]" :is-admin="isAdmin"></m-comment-item>
                    <span class="toggle-btn link" @click="handleToggle(comment.childer.length)">{{ len === 2 ? '显示更多' : '折叠评论' }}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import mAvatar from '+/avatar'
import mEditor from '+/editor'
import { timeAgo } from "@/timeago.js";
import { parse } from "@/emojis";

export default {
    name: "mCommentItem",
    inject: ['app'],
    components: {
        mAvatar,
        mEditor
    },
    data () {
        return {
            len: 2
        }
    },
    props: {
        comment: Object,
        isAdmin: Boolean
    },
    methods: {
        timeAgo,
        // 格式化内容
        formatContent (html = '') {
            return parse(html)
        },
        // 头像显示
        getAvatar (comment) {
            if (this.$root.config && this.$root.config.is_use_qq_avatar) {
                return comment.qqAvatar || comment.gavatar
            }
            return comment.gavatar
        },
        // 回复
        handleReply (comment) {
            this.app.replyComment(comment)
        },
        // 审核
        handleAudit (comment) {
            this.app.auditComment(comment)
        },
        // 显示更多
        handleToggle (len) {
            this.len = this.len === 2 ? len : 2
        }
    }
}
</script>

<style lang="less" scoped>
@import url("../../styles/variables.less");
.comment-item {
    display: flex;
    padding: 1em 0;

    .comment-user-container {
        flex: 1;
        margin-left: 1em;
        position: relative;

        .comment-user-top {
            position: absolute;
            right: 0;
            top: 0;
        }
        // 昵称
        .comment-user-nick {
            position: relative;
            margin-right: 0.875em;
            display: inline-block;
        }
        // 系统信息
        .comment-user-sys {
            display: inline-block;
            font-size: 0.75em;
            margin-right: 0.875em;
            color: @ui-aide-text;
        }
        // 标识
        .comment-user-tag {
            color: @ui-text-inversion;
            background-color: @ui-info;
            display: inline-block;
            padding: 0.2em 0.5em;
            font-size: 0.75em;
            border-radius: 0.2em;
            margin-right: 0.875em;
        }
        // 用户次要信息
        .comment-user-meta {
            margin-top: 0.8em;
            display: flex;
            justify-content: space-between;

            .comment-time {
                color: @ui-aide-text;
                font-size: 0.9em;
            }

            .comment-reply,
            .comment-zan {
                cursor: pointer;
                font-size: 0.9em;
                margin-left: 0.875em;
                user-select: none;
                color: @ui-aide-text-stress;
            }
        }
    }

    .comment-reply {
        opacity: 0;
        margin-right: 1.2em;
    }

    &:hover {
        > .comment-user-container > .comment-user-meta .comment-reply {
            opacity: 1;
        }
    }

    + .comment-item {
        border-top: 1px dashed @ui-dividing-line;
    }

    .comment-item {
        padding: 1.2em 0;
        + .comment-item {
            border-top: 1px dashed @ui-dividing-line;
        }
    }
}

// 回复内容块
.comment-reply-container {
    margin-top: 1em;
    padding: 0 1.2em;
    border-radius: @ui-border-radius;
    background-color: @ui-bg-weak;
    .comment-reply {
        margin-right: 0;
    }
}

@media screen and (max-width: 600px) {
    .comment-user-sys {
        display: none;
    }
}

// 编辑器容器
.comment-edit-container {
    padding: 5px 10px 10px;
    margin-top: 10px;
}

// 显示更多
.toggle-btn {
    font-size: 0.8em;
    cursor: pointer;
    display: inline-block;
    margin: 0 0 10px 56px;
}

// 评论内容 样式处理
.comment-user-text {
    margin: 0.6em 0 0;

    :deep(.emoji-icon) {
        img {
            width: 24px;
            pointer-events: none;
        }
    }

    .comment-replylink {
        font-size: 0.9rem;
        outline: 0;
        margin-bottom: 4px;
        display: inline-block;
        color: @ui-aide-text-stress;
        transition: color @ui-transition-duration,
            background-color @ui-transition-duration;
    }

    //代码块
    pre {
        font-family: Menlo, "Bitstream Vera Sans Mono", "DejaVu Sans Mono",
            Monaco, Consolas, monospace;
        position: relative;
        background: #272822 !important;
        margin: 2em 0;
        padding: 40px 20px 10px;
        overflow: auto;
        color: #ccc !important;
        border-radius: 4px;
        line-height: 20px;

        code {
            font-family: Menlo, "Bitstream Vera Sans Mono", "DejaVu Sans Mono",
                Monaco, Consolas, monospace;
        }

        &::after {
            content: " ";
            position: absolute;
            border-radius: 50%;
            background: @ui-danger-weak;
            width: 12px;
            height: 12px;
            top: 0;
            left: 12px;
            margin-top: 12px;
            box-shadow: 20px 0 @ui-warning-weak, 40px 0 @ui-success-weak;
        }
    }

    //分割线
    hr {
        height: 1px;
        padding: 0;
        border: none;
        text-align: center;
        margin: 2em 0;
        background-image: linear-gradient(
            to right,
            rgba(93, 186, 133, 0),
            rgba(93, 186, 133, 0.75),
            rgba(93, 186, 133, 0)
        );
    }

    //引用
    blockquote {
        margin: 0;
        padding: 0.6em 1em;
        border-radius: 4px;
        border-left: 5px solid @ui-info;
        background-color: rgba(var(--color-head-bg-rgb), 0.4);
    }

    a {
        text-decoration: none;
        outline: 0;
    }

    p {
        margin: 0;
    }

    table {
        border-spacing: 0;
        border-right: 1px solid @ui-border-line;
        border-bottom: 1px solid @ui-border-line;

        tr {
            border: 0;

            th {
                border-top: 1px solid @ui-border-line;
                border-left: 1px solid @ui-border-line;
                min-width: 85px;
                font-weight: bold;
                padding: 5px 10px;
            }

            td {
                padding: 5px 10px;
                border-top: 1px solid @ui-border-line;
                border-left: 1px solid @ui-border-line;
                min-width: 85px;
            }
        }
    }
}
</style>