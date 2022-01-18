<template>
    <div>
        <div class="summary">
            <m-card title="站点PV">
                <div class="numeral">2142,000</div>
                <div class="content" ref="one"></div>
                <div class="footer">
                    <span>近七天</span>
                    <span>{{ pvSum }}</span>
                </div>
            </m-card>
            <m-card title="站点UV">
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
        <div class="summary mt-10">
            <m-card title="PV">
                <div class="card-body"></div>
            </m-card>
            <m-card title="PV">
                <div class="card-body"></div>
            </m-card>
        </div>
    </div>
</template>
<script>
import tcb from '@/tcb';
export default {
    name: "HomePage",
    data () {
        return {
            pvSum: 0
        }
    },
    mounted () {
        this.init()
    },
    methods: {
        init () {
            tcb.callFunction('getChartData', {}).then(res => {
                let { pvData } = res
                let xData = [];
                let yData = []
                pvData.chart.forEach(element => {
                    xData.push(element.date)
                    yData.push(element.num)
                });
                this.pvSum = pvData.count
                echarts.init(this.$refs.one).setOption(this.barLineOption('line', xData, yData));
                echarts.init(this.$refs.two).setOption(this.barLineOption('bar', xData, yData));
            })
        },
        barLineOption (type, xData, yData) {
            return {
                tooltip: {
                    show: true,
                    trigger: 'axis'
                },
                grid: { left: 0, top: '10%', right: 0, bottom: 0, show: false },
                xAxis: [{ show: false, type: 'category', data: xData }],
                yAxis: [{ show: false, type: 'value', }],
                series: [{
                    type,
                    smooth: true,
                    symbol: "none",
                    lineStyle: { opacity: 1, color: '#975fe4' },
                    areaStyle: { normal: { opacity: 1, color: '#975fe4' } },
                    data: yData
                }]
            }
        }
    },
}
</script>
<style lang="less">
@import url("css/variables.less");

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