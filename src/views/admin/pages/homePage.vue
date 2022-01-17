<template>
    <div class="collection">
        <div class="card">
            <div class="card-header">PV</div>
            <div class="card-body">
                <div class="numeral">2142,000</div>
                <div class="content" ref="main"></div>
                <div class="footer">
                    <span>近七天</span>
                    <span>569</span>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">UV</div>
            <div class="card-body">
                <div class="numeral">142,000</div>
                <div class="content" ref="two"></div>
                <div class="footer">
                    <span>近七天</span>
                    <span>40</span>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">评论量</div>
            <div class="card-body">
                <div class="numeral">890</div>
                <div class="content"></div>
                <div class="footer">
                    <span>近七天</span>
                    <span>16</span>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">用户类型</div>
            <div class="card-body">
                <div class="numeral">322</div>
                <div class="content"></div>
                <div class="footer">
                    <span>近七天</span>
                    <span>23</span>
                </div>
            </div>
        </div>
    </div>
    <div class="div5"></div>
</template>
<script>
export default {
    name: "HomePage",
    mounted () {
        var chartDom = this.$refs.main;
        var myChart = echarts.init(chartDom);
        var option;

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#00000000'
                    }
                }
            },
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                show: false
            },
            xAxis: [{
                show: false,
                boundaryGap: false,
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }],
            yAxis: [{
                show: false,
                type: 'value',
            }],
            series: [{
                type: 'line',
                smooth: true,
                symbol: "none",
                lineStyle: {
                    opacity: 0
                },
                areaStyle: {
                    normal: {
                        opacity: 1,
                        color: '#975fe4'
                    }
                },
                data: [160, 182, 191, 134, 150, 56, 12, 32, 145, 122, 165, 122]
            }]
        };

        option && myChart.setOption(option);

        option.series[0].type = 'bar'
        echarts.init(this.$refs.two).setOption(option);

    },
}
</script>
<style lang="less">
@import url("css/variables.less");
.card {
    border-radius: @ui-border-radius;
    background-color: @ui-bg;
    .card-header {
        height: 48px;
        line-height: 48px;
        padding: 0 20px;
        font-weight: 500;
        border-bottom: 1px solid #ebeef5;
    }
    .card-body {
        padding: 10px 20px;
    }
}

.collection {
    display: flex;
    width: 100%;

    .card {
        flex: 1;
        margin: 0 10px;
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
        border-top: 1px solid #f0f0f0;
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