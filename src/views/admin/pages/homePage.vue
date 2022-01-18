<template>
    <div class="summary">
        <m-card title="PV">
            <div class="numeral">2142,000</div>
            <div class="content" ref="one"></div>
            <div class="footer">
                <span>近七天</span>
                <span>569</span>
            </div>
        </m-card>
        <m-card title="UV">
            <div class="numeral">142,000</div>
            <div class="content" ref="two"></div>
            <div class="footer">
                <span>近七天</span>
                <span>40</span>
            </div>
        </m-card>
        <m-card title="评论量">
            <div class="numeral">890</div>
            <div class="content"></div>
            <div class="footer">
                <span>近七天</span>
                <span>16</span>
            </div>
        </m-card>
        <m-card title="用户类型">
            <div class="numeral">322</div>
            <div class="content"></div>
            <div class="footer">
                <span>近七天</span>
                <span>23</span>
            </div>
        </m-card>
    </div>
    <m-card title="PV" class="mt-10">
        <div class="card-body">
        </div>
    </m-card>
</template>
<script>
import tcb from '@/tcb';
export default {
    name: "HomePage",
    mounted () {
        this.init()
        /* echarts.init(this.$refs.one).setOption(this.barLineOption('line',
            ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            [160, 182, 191, 134, 150, 56, 12, 32, 145, 122, 165, 122]));

        echarts.init(this.$refs.two).setOption(this.barLineOption('bar',
            ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            [160, 182, 191, 134, 150, 56, 12, 32, 145, 122, 165, 122])); */
    },
    methods: {
        init () {
            tcb.callFunction('getChartData', {}).then(res => {
                console.log(res);
            })
        },
        barLineOption (type, xData, yData) {
            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { lineStyle: { color: '#00000000' } }
                },
                grid: { left: 0, top: 0, right: 0, bottom: 0, show: false },
                xAxis: [{ show: false, boundaryGap: false, type: 'category', data: xData }],
                yAxis: [{ show: false, type: 'value', }],
                series: [{
                    type,
                    smooth: true,
                    symbol: "none",
                    lineStyle: { opacity: 0 },
                    areaStyle: { normal: { opacity: 1, color: '#975fe4' } },
                    data: yData
                }]
            }
        }
    },
}
</script>
<style lang="less">
@import url('css/variables.less');

.summary {
    display: flex;
    width: 100%;

    .m-card {
        flex: 1;

        + .m-card {
            margin-left: 10px;
        }
    }

    .numeral {
        font-size: 32px;
        line-height: 40px;
        height: 40px;
    }

    .content {
        font-size: 14px;
        padding-top: 10px !important;
        height: 40px;
    }

    .footer {
        border-top: 1px solid @ui-dividing-line;
        margin-top: 10px;
        padding-top: 10px;
        font-size: 14px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }
}
</style>