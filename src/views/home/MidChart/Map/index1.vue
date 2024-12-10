<template>
    <el-card class='bar-wrapper'>
        <template #header>
            <div class="top">
                <span>设备分布</span>
            </div>
        </template>
        <!-- <v-chart :option="getOption()" autoresize class="bar" ref="bar"></v-chart> -->
        <div class='bar' ref="bar"></div>
    </el-card>
</template>

<script setup lang='ts'>
import * as echarts from 'echarts'
import { dataJson } from './data/data';
import { onMounted, ref } from 'vue';
const bar = ref();
echarts.registerMap('china', dataJson as any);
onMounted(() => {
    // 初始化实例
    const mycharts = echarts.init(bar.value)
    // 配置
    var option = {
        geo: [
            {
                map: 'china',       // 配置地图名
                zoom: 1.7,           // 放大
                center: [103, 35],  // 中心坐标
                label: {             // 文本标签
                    show: true,
                    position: 'top',
                    color: "#3498DB"
                },
                scaleLimit:{
                    min:1.5,
                    max:2
                },
                roam:true, // 开启缩放
                emphasis:{  // 高亮显示
                    label:{ 

                    },// 高亮标签设置
                    itemStyle:{ // 高亮元素设置
                        areaColor:"bluesky" // 高亮元素区域颜色设置
                    }
                }
            },

        ]
    }
    // 创建图形
    mycharts.setOption(option)
})
const getOption = () => {
    return {
        // 写一个配置项
        xAixs: {},
        yAixs: {}
    }
}

</script>

<style scoped lang="scss">
.bar-wrapper {
    margin-top: 10px;
    border-radius: 20px;
    .top{
        font-size: 18px;
    }

}

.bar {

    height: 450px;

}
</style>