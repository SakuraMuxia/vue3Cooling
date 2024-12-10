<template>
    <el-card class='bar-wrapper'>
        <div style="height: 450px;" ref="map"></div>
    </el-card>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import { dataJson } from "./data/data"

echarts.registerMap('china', dataJson as any);
const map = ref();
var geoCoordMap: any = {}
var data: any = [];
var lineData: any = [];

dataJson.features.forEach(function (item, index) {
    var name = item.properties.name,
        cp = item.properties.center;
    if (cp) {
        geoCoordMap[name] = cp; // 地区经纬度
        data.push({
            name: name,
            value: cp.concat(Math.round(Math.random() * 100))
        })
        if (name != "河南") {
            lineData.push([
                { name: '河南' },
                { name: name, value: Math.round(Math.random() * 100) }
            ])
        }
    }
})

var convertData = function (data: any) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
            });
        }
    }
    return res;
};
var convertDataLine = function (data: any) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
            });
        }
    }
    return res;
};
var option = {
    tooltip: {
        trigger: 'item',
    },
    visualMap: {
        show: false,
        min: 0,
        max: 100,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'], // 文本，默认为数值文本
        calculable: true,
        seriesIndex: [1],
        inRange: {
            color: ['#004693'] // 蓝绿
        }
    },
    geo: {
        show: true,
        map: 'china',
        roam: true,
        zoom: 1.25,
        label: {
            show: false,

            emphasis: {
                show: false,
            }
        },
        itemStyle: {
            areaColor: '#031525',
            borderWidth: 1,
            borderColor: '#00CFFC',

            emphasis: {
                areaColor: '#2B91B7',
            }
        }
    },
    series: [
        {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: 1,
            // symbolSize: function(val) {
            //     return val[2] / 10;
            // },
            label: {
                formatter: '{b}',
                position: 'bottom',
                show: true,

                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                color: '#05C3F9'
                
            }
        },
        {
            type: 'map',
            map: 'china',
            geoIndex: 0,
            roam: true,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
                show: true,
                
                emphasis: {
                    show: false,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#031525',
                    borderColor: '#3B5077'
                },
                emphasis: {
                    areaColor: '#2B91B7'
                }
            },
            animation: false,
            data: data
        },
        {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin', //气泡
            symbolSize: function () {
                return 40
            },
            label: {
                show: true,
                formatter: function (parm: any) {
                    return parm.value[4]
                },
                textStyle: {
                    color: '#fff'
                }
            },
            itemStyle: {
                color: '#F62157' //标志颜色
            },
            zlevel: 6,
            data: convertData(data)
        },
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            symbolSize: function (val: any) {
                return val[2] / 5;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    show: false,
                    position: 'right'
                }
            },
            itemStyle: {
                normal: {
                    color: 'yellow',
                    shadowBlur: 10,
                    shadowColor: 'yellow'
                }
            },
            zlevel: 1,
            data: convertData(data.sort(function (a: any, b: any) {
                return b.value - a.value;
            }).slice(0, 5))
        },
        {
            name: 'lines',
            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 2,
                trailLength: 0,
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: '#1CFF03',
                    width: 2,
                    opacity: 0.8,
                    curveness: 0.2 //曲线的弯曲程度
                }
            },
            data: convertDataLine(lineData)
        }
    ]
}
onMounted(() => {
    const mycharts = echarts.init(map.value)
    mycharts.setOption(option);
})





</script>

<style scoped lang="scss">
.bar-wrapper {
    margin-top: 10px;
    height: 420px;
}
</style>