<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance,ref } from 'vue'
import { storeToRefs } from 'pinia';
import { mainStore } from '../store/main';
import '../icon/iconfont.js'
export default defineComponent({
    setup() {
        const { proxy } = getCurrentInstance() as any;
        const store = mainStore();
        const { datelist, hot} = storeToRefs(store);
        const isActive = ref(0);
        const scity = ref(0);
        const daynum = ref(0);
        const data1 = ref([]);
        const data2 = ref([]);
        let timer = ref(null);
        let timer1 = ref(null);
        onMounted(() => {//需要获取到element,所以是onMounted的Hook
            const echarts = proxy.$ECharts
            const rightChart = echarts.init(document.getElementById("rightChart"));
            const rightPan = echarts.init(document.getElementById("rightPan"));
            const value: number = 60
            // 绘制图表
            let option={
                backgroundColor: "#394056",
                title: {
                    text: "请求数",
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 12,
                        color: "#F1F1F3",
                    },
                    left: "1%",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        lineStyle: {
                            color: "#57617B",
                        },
                    },
                },
                legend: {
                    icon: "rect",
                    itemWidth: 12,
                    itemHeight: 2,
                    itemGap: 1,
                    data: ["预计销售", "实际销售"],
                    right: "4%",
                    textStyle: {
                        fontSize: 10,
                        color: "#F1F1F3",
                    },
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: true,
                        axisLine: {
                            lineStyle: {
                                color: "#57617B",
                            },
                        },
                        axisLabel: {
                            interval: 0,
                            textStyle: {
                                fontSize: 8,
                            },
                        },
                        data: [
                            "1月",
                            "2月",
                            "3月",
                            "4月",
                            "5月",
                            "6月",
                            "7月",
                            "8月",
                            "9月",
                            "10月",
                            "11月",
                            "12月",
                        ],
                    },
                    {
                        axisPointer: {
                            show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: "#57617B",

                            },
                        },

                        axisTick: {
                            show: false,
                            // length: 2,    // 坐标轴刻度的长度
                        },

                        position: "bottom",
                        offset: 20,
                        data: [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ]
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "单位（%）",
                        axisTick: {
                            show: false,
                        },
                        // boundaryGap : [ 0.000000002, 0.00000002 ],
                        axisLine: {
                            lineStyle: {
                                color: "#57617B",
                            },
                        },
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                fontSize: 10,
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#57617B",
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: "预计销售",
                        type: "line",
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1,
                            },
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgba(137, 189, 27, 0.3)",
                                        },
                                        {
                                            offset: 0.8,
                                            color: "rgba(137, 189, 27, 0)",
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: "rgba(0, 0, 0, 0.1)",
                                shadowBlur: 10,
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: "rgb(137,189,27)",
                                borderColor: "rgba(137,189,2,0.27)",
                                borderWidth: 12,
                            },
                        },
                        data:  store.datelist[isActive.value].data1,
                    },
                    {
                        name: "实际销售",
                        type: "line",
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 5,
                        showSymbol: false,
                        lineStyle: {
                            normal: {
                                width: 1,
                            },
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgba(0, 136, 212, 0.3)",
                                        },
                                        {
                                            offset: 0.8,
                                            color: "rgba(0, 136, 212, 0)",
                                        },
                                    ],
                                    false
                                ),
                                shadowColor: "rgba(0, 0, 0, 0.1)",
                                shadowBlur: 10,
                            },
                        },
                        itemStyle: {
                            normal: {
                                color: "rgb(0,136,212)",
                                borderColor: "rgba(0,136,212,0.2)",
                                borderWidth: 12,
                            },
                        },
                        data:  store.datelist[isActive.value].data2,
                    },
                ],
            };
            rightChart.setOption(option,true);
            // 刷新数据
            startmove();
            // 仪表盘
            rightPan.setOption(
                {
                    angleAxis: {
                        show: false,
                        max: (100 * 360) / 180, //-45度到225度，二者偏移值是270度除360度
                        type: 'value',
                        startAngle: 180, //极坐标初始角度
                        splitLine: {
                            show: false,
                        },
                    },
                    barMaxWidth: 10, //圆环宽度
                    radiusAxis: {
                        show: false,
                        type: 'category',
                    },
                    //圆环位置和大小
                    polar: {
                        center: ['50%', '69%'],
                        radius: '180%',
                    },
                    series: [
                        {
                            //下层圆环，显示最大值
                            type: 'bar',
                            data: [
                                {
                                    value: 100,
                                    itemStyle: {
                                        color: { //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 1, //从左到右 0-1
                                            y2: 0,
                                            colorStops: [{
                                                offset: 0,
                                                color: 'rgb(11,255,0)'
                                            }, {
                                                offset: 0.3,
                                                color: 'rgb(239,255,0)'
                                            }, {
                                                offset: 0.6,
                                                color: 'rgb(239,255,0)'
                                            }, {
                                                offset: 1,
                                                color: '#f00'
                                            }],
                                        },
                                    },
                                },
                            ],
                            barGap: '-100%',
                            coordinateSystem: 'polar',
                            roundCap: true,
                            z: 1,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                color: value < 35 ? 'rgb(11,255,0)' : value < 80 ? 'rgb(239,255,0)' : '#f00',
                                }
                            }
                        },
                        {
                            type: "gauge",
                            progress: {
                                show: false,  
                                itemStyle: {
                                    color: '#fff'
                                },
                                width: 10
                            },
                            radius: '100%',
                            center: ["50%", "70%"],
                            splitNumber: 100, //刻度数量
                            startAngle: 180,
                            endAngle: 0,
                            axisLine: {
                                show: false,
                            },
                            //分隔线样式。
                            splitLine: {
                                show: false,
                            },
                            axisLabel: {
                                show: true,
                                fontSize: 12,
                                distance: -45,
                                color: value < 35 ? 'rgb(11,255,0)' : value < 80 ? 'rgb(239,255,0)' : '#f00',
                                formatter: function (params) {
                                    if (params == parseInt(value + '')) {
                                        return value + '%'
                                    } else {
                                        return ''
                                    }
                                }
                            },
                            axisTick: {
                                show: false,
                            },
                            pointer: {
                                show: true,  //是否显示指针
                                length: "50%",
                                width: "5%",
                            },
                            itemStyle: {
                                color: '#8280bc',
                            },
                            //仪表盘详情，用于显示数据。
                            detail: {
                                show: true,
                                offsetCenter: ['0', '-56%'],
                                textStyle: {
                                    fontSize: 12,
                                    color: value < 35 ? 'rgb(11,255,0)' : value < 80 ? 'rgb(239,255,0)' : '#f00',
                                },
                                formatter: () => {
                                    return value < 35 ? '正常' : value < 80 ? '良好' : '异常'
                                }
                            },
                            data: [{
                                value: value,
                            },],

                        }
                    ],
                }
            )
        });       
        const action = () => {
            const echarts = proxy.$ECharts
            if (isActive.value === 3) {
                    isActive.value = 0;
                } else {
                    ++isActive.value
            }
            const rightChart = echarts.init(document.getElementById("rightChart"));
            const option = rightChart.getOption();
            option.series[0].data = store.datelist[isActive.value].data1;
            option.series[1].data = store.datelist[isActive.value].data2;
            rightChart.setOption(option, true);
            
        };
        const startmove = () => {
            clearTimeout(timer.value)
            //定时器触发周期
            timer.value = setInterval(action, 4000);
        };
        const switchTab = (id:number) => {
            isActive.value = id-1;
            action();
        };
        // 获取选中的id，然后显示对应数据
        const rightDay = (id: number) => {
            daynum.value = id;
        };
        // 城市选择
        const citynum = (id:number) => {
            scity.value = id;
        }
        //开始
        const start = () => {
            clearTimeout(timer.value)
            startmove();
        };
        const stop = () => {
            clearTimeout(timer.value);
            clearTimeout(timer1.value)
        }
        return {
            datelist,
            switchTab,
            isActive,
            data1,
            data2,
            daynum,
            rightDay,
            hot,
            scity,
            citynum,
            start,
            stop
        }
    },
})
</script>

<template>
<!-- 右边头部 -->
<div class="right-top">
 <!-- <div id="myChart" :style="{ width: '100%', height: '300px' }"></div> -->
    <div class="select-tab" >
        <div class="mid-item" v-for="item in datelist" :key="item.id">
        <p @click="rightDay(item.id)" style="cursor: pointer;"
        :class="{ activep:item.id===daynum}">{{item.day}}
            <span class="mid-xian">|</span>
        </p>
        </div>
    </div>
    <div class="right-tab">
        <div class="item">
            <h3>
                {{datelist[daynum].order}}
            </h3>
            <p style="color: #006cff; font-size: 12px; margin-top: -5px;">
               <span class="iconfont icon-dot" style="color: #ed3f35;"></span>
               订单量
            </p>
        </div>
        <div class="item">
            <h3>
                 {{datelist[daynum].sale}}
            </h3>
            <p style="color: #006cff; font-size: 12px; margin-top: -5px;">
               <span class="iconfont icon-dot" style="color: #eacf19;;"></span>
                销售额（万元）
            </p>
        </div>
    </div>   
</div>
<!-- 中间部分，折线图 -->
<div class="right-mid1">
    <!-- 右边中间头部 -->
  <div class="select-tab">
        <div style="color:#fff; margin-left: -10px; display: inline-block;">
              <p>一季销售进度</p>
        </div>
        <div class="mid-xian">
            |
        </div>
       <div class="mid-item" >
            <a href="javascript:;" class="right-a" 
       v-on:click="switchTab(item.id)"
            :class="{ activelink:item.id===isActive}" 
            v-for="item in datelist" :key="item.id"
             @mousemove="stop" @mouseleave="start">
                    {{item.name}}
            </a>
        </div>
  </div>
  <div class="right-line">
    <!-- 中间折线图 -->
    <div id="rightChart" :style="{ width: '340px', height: '140px' }">
    </div>
  </div>
</div>
<!-- 中间下面两个方块部分 -->
<div class="right-mid2">
    <!-- 左侧  渠道分布 -->
    <div class="mid-right">
        <div class="select-tab">
            <div  style="color:#fff; margin-left: -10px;">
              <p>渠道分布</p>
            </div>
            <!-- 下面四小区域 -->
            <div class="left-midl">
                <div class="item">
                    <h3 style="color:#fff">
                    39%
                     </h3>
                    <p style="color: #006cff; font-size: 12px;">
            <i class="iconfont icon-feiji"></i>
                    机场
                    </p>
                </div>
        <div class="item">
            <h3 style="color:#fff">
                28%
            </h3>
            <p style="color: #006cff; font-size: 12px;">
            <span class="iconfont icon-shangchang"></span>
                商场
            </p>
        </div>
        <div class="item">
            <h3 style="color:#fff">
                20%
            </h3>
            <p style="color: #006cff; font-size: 12px;">
            <span class="iconfont icon-ditie"></span>
                地铁
            </p>
        </div>
        <div class="item">
            <h3>
                13%
            </h3>
            <p style="color: #006cff; font-size: 12px;">
            <span class="iconfont icon-huoche"></span>
                火车
            </p>
        </div>
        </div>
    </div>
    </div>
         <!-- 中间右侧区域 -->
    <div class="mid-left">
        <div class="select-tab">
            <div  style="color:#fff; margin-left: -10px;">
              <p>一季销售进度</p>
            </div>
            <!-- 下面仪表盘区域 -->
            <div class="left-mid2">
                <div class="item">
                    <!-- 仪表盘 -->
                    <div id="rightPan" :style="{ width: '130px', height: '90px' }"></div>
                </div>
                <div class="left-midr">
                    <div class="item">
                <h3 style="color:#fff">
                1,321
            </h3>
            <p style="color: #006cff; font-size: 12px;">
               <span class="iconfont icon-dot" style="color: #ed3f35;"></span>
                销售额
            </p>
        </div>
        <div class="item">
            <h3 style="color:#fff">
                150%
            </h3>
            <p style="color: #006cff; font-size: 12px;">
               <span class="iconfont icon-dot" style="color: #6acca3;"></span>
                增长比
            </p>
        </div>
     </div>
        
        </div>
        </div>
    </div>

</div>
<!-- 右侧全国热榜 -->
<div class="right-bottom">
   <div class="hot">
     <div class="left-hot">
        <p>
        全国热榜
        </p>
        <div class="hot-first">
            <span style="margin-bottom:15px">
            <span class="iconfont icon-cup1" style="color: #d93f36;"></span>
                可爱多
            </span>
            <span style="margin-bottom:15px">
            <span class="iconfont icon-cup2" style="color: #d93f36;"></span>
                娃哈哈
            </span>
            <span style="margin-bottom:15px">
            <span class="iconfont icon-cup3" style="color: #d93f36;"></span>
                喜之郎
            </span>
        </div>
    </div>
    <div class="mid-hot">
        <p>
            各省热销
        </p>
        <!-- 热销排行城市 -->
        <div class="hot-first" style="width: 150px;">
        <ul style="list-style:none;margin: -3px; cursor: pointer;padding: 5px;" 
        :class="{ activehot:item.id===scity}"
        v-for="item in hot" :key="item.id" @click="citynum(item.id)">
            <li style="width:100px; margin-bottom: -15px;display:inline-block">
            <span style="color: #fff;" >
                {{item.city}}
            </span>
            <span style="margin-left:20px;color: #fff;" >
                {{item.num}}
            </span>
                    <span v-if="item.isup===true" class="iconfont icon-up">
                    </span>
                    <span v-if="item.isdown===true" class="iconfont icon-down">
                    </span>
            </li>
        </ul>
        </div>
    </div>
    <div class="right-hot">
        <p>
            近30日
        </p>
        <div style="margin-top: -15px; margin-left: -20px; background-color:rgba(16, 45, 99, 0.5) ;">
            <ul style="list-style:none; margin: 0;" v-for="item in hot[scity].toplist" :key="item.name"> 
                <li>
                    <span style="font-size: 12px; color: #42ffff;">
                    {{item.name}}
                    </span>
                   <span v-if="item.isup===true" class="iconfont icon-up">
                    </span>
                    <span v-if="item.isdown===true" class="iconfont icon-down">
                    </span>
                </li>
            </ul>
        </div>
    </div>
   </div>
</div>
</template>

<style>
.right-top{
    width: 100%;
    height: 17%;
    margin-bottom: 15px;
    border: 13px solid #ccc;
    border-image: url('../pic/border.png') 55 40 25 130 stretch;
    border-width: 43px 40px 25px 130px;
    box-sizing: border-box;

}
.right-tab{
    display: flex;
    justify-content: space-around;
    /* text-align: center; */
    margin-left: -120px;
    margin-top: -15px;
}
.right-line{
    margin-left: -100px;
}
.right-mid1{
    flex: 1;
    width: 100%;
    height: 300px;
    margin-bottom: 15px;
    border: 13px solid #ccc;
    border-image: url('../pic/border.png') 55 40 25 130 stretch;
    border-width: 43px 40px 25px 130px;
    box-sizing: border-box;
}
.right-mid2{
    display: flex;
    flex: 1;
    width: 100%;
    height: 200px;
    margin-bottom: 15px;
   
}
.mid-right{
    width: 50%;
    height: 190px;
    margin-right: 10px;
    border: 13px solid #ccc;
    border-image: url("/src/pic/border.png") 55 40 25 130 / 3 / 0 stretch;
    border-width: 43px 40px 25px 130px;
    box-sizing: border-box;

}
.right-a{
    margin-right: 10px;
    text-decoration: none;
    color: #006cff; 
    font-size: 12px;
}
.activelink{
    background-color: #006cff;
    color: #fff;
}
.activehot{
    background-color:rgba(16, 45, 99, 0.5) ;
}
.activep{
    color: #fff;
}
.left-midl{
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin-top: -10px;
    width: 50%;
    height: 100%;
}

.left-mid2{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: -10px;
    width: 100%;
    height: 100%;
}
.left-midr{
    display: flex;
    justify-content: space-around;
    /* text-align: center; */
    margin-top: -10px;
}
.mid-left{
    flex: 1;
    border: 14px solid #ccc;
    border-image: url("/src/pic/border.png") 55 40 25 130 / 3 / 0 stretch;
    border-width: 43px 40px 25px 130px;
    box-sizing: border-box;
}
.right-bottom{
    width: 100%;
    height: 200px;
    border: 0px solid #ccc;
    border-image: url('../pic/border.png') 55 40 25 130 stretch;
    border-width: 43px 40px 25px 130px;
    box-sizing: border-box;
    margin-bottom: 15px;
}
.hot{
    display: flex;
    justify-content: space-between;
    /* margin-left: -100px; */
    margin-top: -50px;
    width: 100%;
    height: 100px;
}
.left-hot{
    width: 100px;
    height: 100%;
    color: #fff;
}
.mid-hot{
    flex: 1;
    color: #fff;

}
.right-hot{
    width: 100px;
    height: 100%;
    color: #fff;
    padding: 0;

}
.hot-first{
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: flex-end;
    align-items: center;
    margin-top: -10px;
    color: #006cff; 
    font-size: 10px;
}
</style>