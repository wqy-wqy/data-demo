<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia';
import { mainStore } from '../store/main';
// import * as echarts from 'echarts';
import '../assets/china.ts';

export default defineComponent({
    setup() {
        const store = mainStore()
        // 使用storeToRefs()将state中的状态解构出来，
        // 方便在视图中使用，storeToRefs函数可将普通数据变成响应式数据。
        // let { allData } = storeToRefs(store)
        const { proxy } = getCurrentInstance() as any;
        onMounted(() => {//需要获取到element,所以是onMounted的Hook
            const echarts = proxy.$ECharts
            const myChart = echarts.init(document.getElementById("myChart"));
            // 绘制图表
            myChart.setOption({
                backgroundColor:'rgba(255, 255, 255, 0.1)',
                title: {
                    text: '设备点位分布图',
                    left: 'center',
                    textStyle: {
                        color: '#fff'
                    }
                },
                legend: {
                    show: false,
                    orient: 'vertical',
                    top: 'bottom',
                    left: 'right',
                    data: ['地点', '线路'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                geo: {
                    map: 'china',
                    label: {
                        emphasis: {
                            show: true
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#323c48',
                            borderColor: '#404a59'
                        },
                        emphasis: {
                            areaColor: '#2a333d'
                        }
                    }
                },
                series: [{
                    name: '地点',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        emphasis: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: 2,
                    showEffectOn: 'render',
                    itemStyle: {
                        normal: {
                            color: '#46bee9'
                        }
                    },
                    data: store.allData.citys
                }, {
                    name: '线路',
                    type: 'lines',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    large: true,
                    effect: {
                        show: true,
                        constantSpeed: 30,
                        symbol: 'pin',
                        symbolSize: 3,
                        trailLength: 0,
                    },
                    lineStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0, color: '#58B3CC'
                            }, {
                                offset: 1, color: '#F58158'
                            }], false),
                            width: 1,
                            opacity: 0.2,
                            curveness: 0.1
                        }
                    },
                    data: store.allData.moveLines
                }]
            });
            window.onresize = function () {//自适应大小
                myChart.resize();
            };

            // 绘制中下部立体图
            const offsetX = 10;
            const offsetY = 5;
// 绘制左侧面
            const CubeLeft = echarts.graphic.extendShape({
                shape: {
                    x: 0,
                    y: 0,
                },
                buildPath: function (ctx, shape) {
                    // 会canvas的应该都能看得懂，shape是从custom传入的
                    const xAxisPoint = shape.xAxisPoint;
                    // console.log(shape);
                    const c0 = [shape.x, shape.y];
                    const c1 = [shape.x - offsetX, shape.y - offsetY];
                    const c2 = [xAxisPoint[0] - offsetX, xAxisPoint[1] - offsetY];
                    const c3 = [xAxisPoint[0], xAxisPoint[1]];
                    ctx.moveTo(c0[0], c0[1]).lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath();
                },
            });
// 绘制右侧面
            const CubeRight = echarts.graphic.extendShape({
                shape: {
                    x: 0,
                    y: 0,
                },
                buildPath: function (ctx, shape) {
                    const xAxisPoint = shape.xAxisPoint;
                    const c1 = [shape.x, shape.y];
                    const c2 = [xAxisPoint[0], xAxisPoint[1]];
                    const c3 = [xAxisPoint[0] + offsetX, xAxisPoint[1] - offsetY];
                    const c4 = [shape.x + offsetX, shape.y - offsetY];
                    ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
                },
            });
// 绘制顶面
            const CubeTop = echarts.graphic.extendShape({
                shape: {
                    x: 0,
                    y: 0,
                },
                buildPath: function (ctx, shape) {
                    const c1 = [shape.x, shape.y];
                    const c2 = [shape.x + offsetX, shape.y - offsetY]; //右点
                    const c3 = [shape.x, shape.y - offsetX];
                    const c4 = [shape.x - offsetX, shape.y - offsetY];
                    ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
                },
            });
// 注册三个面图形
            echarts.graphic.registerShape('CubeLeft', CubeLeft);
            echarts.graphic.registerShape('CubeRight', CubeRight);
            echarts.graphic.registerShape('CubeTop', CubeTop);

            const VALUE = [100, 200, 300, 400, 300];
            const mainChart = echarts.init(document.getElementById("mainChart"));
            mainChart.setOption(
                {
                    // backgroundColor: '#012366',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                        },
                        formatter: function (params, ticket, callback) {
                            const item = params[1];
                            return item.name + ' : ' + item.value;
                        },
                    },
                    grid: {
                        left: '10%',
                        right: '10%',
                        top: '15%',
                        bottom: '10%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'category',
                        data: ['北京', '上海', '深圳', '武汉', '南京'],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 2,
                                color: '#2B7BD6',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            fontSize: 12,
                        },
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 2,
                                color: '#2B7BD6',
                            },
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#153D7D',
                            },
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            fontSize: 12,
                        },
                        // boundaryGap: ['20%', '20%'],
                    },
                    series: [
                        {
                            type: 'custom',
                            renderItem: (params, api) => {
                                const location = api.coord([api.value(0), api.value(1)]);
                                return {
                                    type: 'group',
                                    children: [
                                        {
                                            type: 'CubeLeft',
                                            shape: {
                                                api,
                                                xValue: api.value(0),
                                                yValue: api.value(1),
                                                x: location[0],
                                                y: location[1],
                                                xAxisPoint: api.coord([api.value(0), 0]),
                                            },
                                            style: {
                                                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                    {
                                                        offset: 0,
                                                        color: '#33BCEB',
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: '#337CEB',
                                                    },
                                                ]),
                                            },
                                        },
                                        {
                                            type: 'CubeRight',
                                            shape: {
                                                api,
                                                xValue: api.value(0),
                                                yValue: api.value(1),
                                                x: location[0],
                                                y: location[1],
                                                xAxisPoint: api.coord([api.value(0), 0]),
                                            },
                                            style: {
                                                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                    {
                                                        offset: 0,
                                                        color: '#28A2CE',
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: '#1A57B7',
                                                    },
                                                ]),
                                            },
                                        },
                                        {
                                            type: 'CubeTop',
                                            shape: {
                                                api,
                                                xValue: api.value(0),
                                                yValue: api.value(1),
                                                x: location[0],
                                                y: location[1],
                                                xAxisPoint: api.coord([api.value(0), 0]),
                                            },
                                            style: {
                                                fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                    {
                                                        offset: 0,
                                                        color: '#43C4F1',
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: '#28A2CE',
                                                    },
                                                ]),
                                            },
                                        },
                                    ],
                                };
                            },
                            data: VALUE,
                        },
                        {
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    formatter: (e) => {
                                        return e.value + '万人';
                                    },
                                    fontSize: 10,
                                    color: '#43C4F1',
                                    offset: [0, -10],
                                },
                            },
                            itemStyle: {
                                color: 'transparent',
                            },
                            tooltip: {},
                            data: VALUE,
                        },
                    ],
                }
            )

        });
        return {}
    },
})
</script>

<template>
<div class="main-top">
   <p class="main-item">
            <span class="iconfont icon-cube"></span>
    设备数据统计</p> 
    <div class="main-main">
 <div id="myChart" :style="{ width: '100%', height: '100%' }"></div>
    </div>
</div>

<div class="main-bottom">
<p class="left-item">全国用户总量统计</p>
<!-- 中间部分左侧柱状图 -->
<div class="total-left">
    <div id="mainChart" :style="{ width: '380px', height: '200px' }"></div>
</div>
<!-- 中间下面部分右侧用户总量 -->
<div class="total-people">
<div class="cri-item">
        <h1>120,899</h1>
        <p style="color: #006cff;">
            <i class="iconfont icon-dot" style="color: #ed3f35;"></i>
        用户总量</p>
    </div>
    <div class="cri-item">
        <h1>248</h1>
        <p style="color: #006cff; font-size: 12px;">
            <span class="iconfont icon-dot" style="color: #eacf19;"></span>
        本月新增</p>
    </div>
</div>
</div>
</template>

<style>
.main-top{
    height: 100%;
}
.main-item{
    /* display: inline-block; */
    /* height:10%; */
    width: 100%;
    margin: 15px 0px 5px 40px;
    color: #fff;
    font-weight: bolder;
}
.main-main{
    height: 100%;
}
.main-bottom{
    position: relative;
    height: 65%;
    margin: 40px 0px 0px 0px;
    border: 20px solid #ccc;
    border-image: url('../pic/border.png') 55 40 25 130 stretch;
    border-width: 55px 40px 25px 130px;
    box-sizing: border-box;
}

.total-left{
    position: absolute;
    left: -140px;
    bottom: 10px;
}
.total-people{
    position: absolute;
    right: -10px;
    bottom: 0px;
}
</style>