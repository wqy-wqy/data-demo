<script lang="ts">
import { defineComponent,nextTick, onMounted, getCurrentInstance,ref, onUnmounted,reactive ,onBeforeUnmount} from 'vue';
import { storeToRefs } from 'pinia';
import { mainStore } from '../store/main';
import '../icon/iconfont.css'
export default defineComponent({
    setup() {
        const { proxy } = getCurrentInstance() as any;
        const store = mainStore();
        const { equmt } = storeToRefs(store);
        const num = ref(0);
        const animate = ref(true);
        let timer = ref(null);
        let roll = ref(null);
        onBeforeUnmount(()=>{
        //清除定时器
            clearTimeout(timer.value)
        })
        onMounted(() => {//需要获取到element,所以是onMounted的Hook
            const echarts = proxy.$ECharts
            const leftChart = echarts.init(document.getElementById("leftChart"));
            // const animate=ref(true)
            // 绘制图表
            leftChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [{
                    name: '地点',
                    type: 'pie',
                    radius: ['30%', '80%'],
                    center: ['40%', '50%'],
                    roseType: 'radius',
                    label: {
                        show: true,
                        normal: {
                            position: 'outside',
                            fontSize: 12
                        }
                    },
                    labelLine: {
                        length: 1,
                        length2: 1,
                        smooth: true
                    },
                    data: [{
                        value: 1,
                        name: '北京',
                        itemStyle: {
                            color: "rgba(50,123,250,0.7)",
                            borderColor: "rgba(50,123,250,1)",
                            borderWidth: 2
                        }
                    },
                    {
                        value: 2,
                        name: '上海',
                        itemStyle: {
                            color: "rgba(244,201,7,0.7)",
                            borderColor: "rgba(244,201,7,1)",
                            borderWidth: 2
                        }
                    },
                    {
                        value: 3,
                        name: '深圳',
                        itemStyle: {
                            color: "rgba(23,216,161,0.7)",
                            borderColor: "rgba(23,216,161,1)",
                            borderWidth: 2
                        }
                    },
                    {
                        value: 4,
                        name: '武汉',
                        itemStyle: {
                            color: "rgba(122,60,235,0.7)",
                            borderColor: "rgba(122,60,235,1)",
                            borderWidth: 2
                        }
                    },
                    {
                        value: 5,
                        name: '南京',
                        itemStyle: {
                            color: "rgba(15,197,243,0.7)",
                            borderColor: "rgba(15,197,243,1)",
                            borderWidth: 2
                        }
                    }
                    ]
                }]
            });
            start()
        });
        const Equnum = (id: number) => {
            num.value = id;
            // if
        };
        const testMove = () => {
            clearTimeout(timer.value)
        };
        const testMend = () => {
            start();
        };
        const start = () => {
            clearTimeout(timer.value)
            //定时器触发周期
            let speed = ref(75)
            timer.value = setInterval(MarqueeTest, speed.value)
        };
        const MarqueeTest = () => {
            let test1 = roll.value
            //判断组件是否渲染完成
            if (test1.offsetHeight == 0) {
                test1 = roll.value
            } else {
                //组件进行滚动
                test1.scrollTop += 1
                //判断滚动条是否滚动到底部
                if (test1.scrollTop >= (test1.scrollHeight - test1.clientHeight-10)) {
                    //获取组件第一个节点
                    let a = test1.childNodes[0]
                    // console.log(a)
                    //删除节点
                    test1.removeChild(a)
                    //将该节点拼接到组件最后
                    test1.append(a);
                }
            }
        };
        start()

        nextTick(()=>{
        start()
    })
        return {
            equmt,
            Equnum,
            num,
            animate,
            testMove,
            testMend,
            roll
        }
    },
})
</script>

<template>
<div class="left-top">
    <div class="ltop-main">
        <div class="item">
            <h1>
                2,190
            </h1>
            <p style="color: #2c9bfd;">
            <span class="iconfont icon-dot"></span>
                设备总数
            </p>
        </div>
        <div class="item">
            <h1>
                190
            </h1>
            <p style="color: #2c9bfd;">
                <span class="iconfont icon-dot" style="color: #6acca3; "></span>
                季度新增
            </p>
        </div>
        <div class="item">
            <h1>
                3001
            </h1>
            <p style="color: #2c9bfd; font-size: 12px;">
            <span class="iconfont icon-dot" style="color: #6acca3;"></span>
                运营设备
            </p>
        </div>
        <div class="item">
            <h1>
                108
            </h1>
            <p style="color: #2c9bfd; font-size: 12px;">
            <span class="iconfont icon-dot" style="color: #ed3f35;"></span>
                异常设备
            </p>
        </div>
    </div>
</div>
<!-- 设备监控 -->
<div class="left-mid">
    <div class="select-tab">
        <div class="mid-item">
        <p @click="Equnum(0)" style="cursor:pointer"
        :class="{ activep:equmt[0].id===num}">{{equmt[0].name}}</p>
        </div>
        <div class="mid-xian">
            |
        </div>
        <div class="mid-item">
            <p @click="Equnum(1)" style="cursor:pointer"
            :class="{ activep:equmt[1].id===num}">{{equmt[1].name}}</p>
        </div>
    </div>
    <!-- 设备监控滚动部分 -->
    <div class="left-equ">
        <div class="select-head">
        <span>
            故障时间
        </span>
        <span>
            设备地址
        </span>
        <span>
            异常代码
        </span>
        </div>
        <div @mousemove="testMove" @mouseleave="testMend">
            <div ref="roll" class="left-box" >
            <div class="animateList" id="numList" v-for='item in equmt[num].list'>
           <span>
            {{item.time}}
           </span>
           <span>
            {{item.addr}}
           </span>
           <span>
            {{item.code}}
           </span>
           </div>
        </div>
        </div>
    </div>   
    </div>
<div class="left-bottom">
    <p class="left-item">点位分布统计</p>
<div class="cri-main">
    <div class="cri-left" id="leftChart" :style="{ width: '220px', height: '200px' }"></div>
<div class="cri-right">
    <div class="cri-item">
        <h1>320,11</h1>
        <p style="color: #006cff;">
            <span class="iconfont icon-dot" style="color: #ed3f35;"></span>
        点位总数</p>
    </div>
    <div class="cri-item">
        <h1>418</h1>
        <p style="color: #006cff; font-size: 12px;">
            <span class="iconfont icon-dot" style="color: #eacf19;"></span>
        本月新增</p>
    </div>
</div>
</div>

</div>
</template>

<style>
.left-top{
    position: relative;
    width: 100%;
    height:15%;
    margin-bottom: 10px;
    border: 20px solid #ccc;
    border-image: url('../pic/border.png') 55 40 25 130 stretch;
    border-width: 55px 40px 25px 130px;
    box-sizing: border-box;
}
.left-equ{
    width: 100%;
    height: 100%;
    margin-left: -105px;
}
.select-head{
    display: flex;
    justify-content: space-around;
    color: #68d8fe;
    font-size: 12px;
    background-color: rgba(255, 255, 255, 0.1);
    height: 10%;
    width: 100%;
    margin-top: -10px;

}
.left-box{
     height: 11rem;
     overflow: hidden;
}
.animateList{
        display: flex;
        justify-content: space-around;
        font-size: 10px;
        margin-top: 5px;
        height: 10px;
        color: #2c9bfd;
}
.left-mid{
    position: relative;
    flex: 1;
    width: 100%;
    height:80%;
    margin-bottom: 15px;
    border: 20px solid #ccc;
    border-image: url('../pic/border.png') 55 40 25 130 stretch;
    border-width: 55px 40px 25px 130px;
    box-sizing: border-box;
}
.left-bottom{
    position: relative;
    width: 100%;
    height: 40%;
    border: 20px solid #ccc;
    border-image: url('../pic/border.png') 55 40 25 130 stretch;
    border-width: 55px 40px 25px 130px;
    box-sizing: border-box;
    margin-bottom: 15px;

}
.left-item{
    height:20px;
    margin: -35px 0px 0px -93px;
    color: #fff;
    font-weight: bolder;
}
.ltop-main{
    position: absolute;
    top:-50px;
    left: -100px;
    width:400px
    /* text-align: center; */
}

.cri-left{
    position: absolute;
    left: -80px;
    bottom: 10px;
}
.cri-right{
    /* display: block; */
    position: absolute;
    right:15px;
    bottom: 0px;
}
.cri-item{
    color: #fff;
    font-size: 0.6rem;
    margin-top: 10px;
    margin-bottom: 40px;
}

.item{
    display: inline-block;
    margin-left:20px;
    text-align: center;
    vertical-align:top;
    color: #fff;
    font-weight: bold;
    font-size: 0.6rem;
}
.pitem{
    color: #2c9bfd;
    font-size: 0.9rem;
}
.select-tab{
    position: absolute;
    margin-top: -50px;
    margin-left: -93px;
    
}
.mid-item{
    display: inline-block;
    color: #2c9bfd;
    font-weight: bold;
    font-size: 0.9rem;
}
.mid-xian{
    display: inline-block;
    color: aquamarine;
    font-weight: bolder;
    margin: 0px 10px 0px 10px;
}
</style>