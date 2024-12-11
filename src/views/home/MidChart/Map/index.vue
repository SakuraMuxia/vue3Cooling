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
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'
import { data, toolTipData, geoCoordMap } from './data/srcData.js'
import { geoJson } from './data/geoJson.js'
import axios, { type AxiosResponse } from 'axios';
import { reqDeviceList } from '@/api/device/index.ts'

const bar = ref();
const featuresList = ref([])
const img2 = 'image://data:image/png;base64,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';
const mapName = 'china'
const toolTipData1 = ref()

onMounted(() => {

    // 初始化数据
    var mycharts = echarts.init(bar.value)
    // console.log("mycharts",mycharts);

    // 加载效果
    mycharts.showLoading()
    // 获取geoJSON数据
    // getGeoJsonData()
    // 注册地图
    echarts.registerMap('china', geoJson);
    // 获取地图数据
    const mapFeatures = echarts.getMap(mapName).geoJSON.features
    // console.log(mapFeatures);

    // 隐藏加载效果
    mycharts.hideLoading();
    // 遍历geoJson数据
    mapFeatures.forEach((item: any) => {
        // 地区名称
        let name = item.properties.name;
        // 地区经纬度
        geoCoordMap[name] = item.properties.center;
    });
    // 配置项
    var option = {
        backgroundColor: "#003366",
        title: {
            show: true,
            text: "项目分布图",
            x: 'center',
            top: "10",
            textStyle: {
                color: "#fff",
                fontFamily: "等线",
                fontSize: 18,
            },
        },
        tooltip: {
            trigger: 'none',
            formatter: function (params) {
                if (typeof params.value[2] == 'undefined') {
                    var toolTiphtml = '';
                    for (var i = 0; i < toolTipData.length; i++) {
                        if (params.name == toolTipData[i].name) {
                            toolTiphtml += toolTipData[i].name + "：" + toolTipData[i].value;
                        }
                    }
                    // console.log(toolTiphtml);
                    // console.log(convertData(data))
                    return toolTiphtml;
                } else {
                    var toolTiphtml = '';
                    for (var i = 0; i < toolTipData.length; i++) {
                        if (params.name == toolTipData[i].name) {
                            toolTiphtml += toolTipData[i].name + "：" + toolTipData[i].value;
                        }
                    }
                    // console.log(toolTiphtml);

                    return toolTiphtml;
                }
            },
            backgroundColor: "#fff",
            borderColor: "#333",
            padding: [5, 10],
            textStyle: {
                color: "#fff",
                fontSize: "14"
            }
        },
        geo: [{
            layoutCenter: ['42%', '60%'],//位置
            layoutSize: '180%',//大小
            show: true,
            map: mapName,
            roam: false,
            zoom: 1.3,
            aspectScale: 1.2,
            label: {
                show: false,
                textStyle: {
                    color: '#fff'
                },

                emphasis: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            itemStyle: {
                normal: {
                    areaColor: {
                        type: "linear",
                        x: 1200,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [{
                            offset: 0,
                            color: "rgba(3,27,78,0.75)", // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: "rgba(58,149,253,0.75)", // 50% 处的颜色
                        },],
                        global: true, // 缺省为 false
                    },
                    borderColor: "#c0f3fb",
                    borderWidth: 1,
                    shadowColor: "#8cd3ef",
                    shadowOffsetY: 10,
                    shadowBlur: 120,
                },
                emphasis: {
                    areaColor: "rgba(0,254,233,0.6)",
                    // borderWidth: 0
                }
            }
        }, {
            type: "map",
            map: mapName,
            zlevel: -1,
            aspectScale: 1.2,
            zoom: 1.3,
            layoutCenter: ["42%", "61%"],
            layoutSize: "180%",
            roam: false,
            silent: true,
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    // borderColor:"rgba(17, 149, 216,0.6)",
                    borderColor: "rgba(58,149,253,0.8)",
                    shadowColor: "rgba(172, 122, 255,0.5)",
                    shadowOffsetY: 5,
                    shadowBlur: 15,
                    areaColor: "rgba(5,21,35,0.1)",
                },
            },
        }, {
            type: "map",
            map: mapName,
            zlevel: -2,
            aspectScale: 1.2,
            zoom: 1.3,
            layoutCenter: ["42%", "62%"],
            layoutSize: "180%",
            roam: false,
            silent: true,
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    // borderColor: "rgba(57, 132, 188,0.4)",
                    borderColor: "rgba(58,149,253,0.6)",
                    shadowColor: "rgba(65, 214, 255,1)",
                    shadowOffsetY: 5,
                    shadowBlur: 15,
                    areaColor: "transpercent",
                },
            },
        }, {
            type: "map",
            map: mapName,
            zlevel: -3,
            aspectScale: 1.2,
            zoom: 1.3,
            layoutCenter: ["42%", "63%"],
            layoutSize: "180%",
            roam: false,
            silent: true,
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    // borderColor: "rgba(11, 43, 97,0.8)",
                    borderColor: "rgba(58,149,253,0.4)",
                    shadowColor: "rgba(58,149,253,1)",
                    shadowOffsetY: 15,
                    shadowBlur: 10,
                    areaColor: "transpercent",
                },
            },
        }, {
            type: "map",
            map: mapName,
            zlevel: -4,
            aspectScale: 1.2,
            zoom: 1.3,
            layoutCenter: ["42%", "64%"],
            layoutSize: "180%",
            roam: false,
            silent: true,
            itemStyle: {
                normal: {
                    borderWidth: 5,
                    // borderColor: "rgba(11, 43, 97,0.8)",
                    borderColor: "rgba(5,9,57,0.8)",
                    shadowColor: "rgba(29, 111, 165,0.8)",
                    shadowOffsetY: 15,
                    shadowBlur: 10,
                    areaColor: "rgba(5,21,35,0.1)",
                },
            },
        },],
        series: [
            {
                type: 'map',
                map: mapName,
                geoIndex: 0,
                aspectScale: 1.1, //长宽比
                zoom: 1.1,
                showLegendSymbol: true,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: "#fff",
                            fontSize: "120%"
                        },
                    },
                    emphasis: {
                        // show: false,
                    },
                },
                itemStyle: {
                    normal: {
                        areaColor: {
                            type: "linear",
                            x: 1200,
                            y: 0,
                            x2: 0,
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: "rgba(3,27,78,0.75)", // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: "rgba(58,149,253,0.75)", // 50% 处的颜色
                            },],
                            global: true, // 缺省为 false
                        },
                        borderColor: "#fff",
                        borderWidth: 0.2,
                    },
                },
                layoutCenter: ["50%", "50%"],
                layoutSize: "180%",
                animation: false,
                markPoint: {
                    symbol: "none"
                },
                data: data,
            },
            //柱状体的主干
            {
                type: 'lines',
                zlevel: 5,
                effect: {
                    show: false,
                    symbolSize: 3 // 图标大小
                },
                lineStyle: {
                    width: 6, // 尾迹线条宽度
                    color: 'rgba(249, 105, 13, .6)',
                    opacity: 1, // 尾迹线条透明度
                    curveness: 0 // 尾迹线条曲直度
                },
                label: {
                    show: 0,
                    position: 'end',
                    formatter: '245'
                },
                silent: true,
                data: lineData()
            },
            // 柱状体的顶部
            {
                type: 'scatter',
                coordinateSystem: 'geo',
                geoIndex: 0,
                zlevel: 5,
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            var name = params.data[2].name
                            var value = params.data[2].value
                            var text = `{tline|${name}} : {fline|${value}}台`
                            // var text = `{tline|项目个数} : {fline|${value}}`
                            return text;
                        },
                        color: '#fff',
                        rich: {
                            fline: {
                                // padding: [0, 25],
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 600
                            },
                            tline: {
                                // padding: [0, 27],
                                color: '#ABF8FF',
                                fontSize: 12,
                            },
                        }
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    color: '#00FFF6',
                    opacity: 1
                },
                symbol: img2,
                symbolSize: [90, 50],
                symbolOffset: [0, -20],
                z: 999,
                data: scatterData(),
            },
            {
                name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(toolTipData),
                showEffectOn: 'render',
                itemStyle: {
                    normal: {
                        color: '#00FFFF',
                    }
                },
                rippleEffect: {
                    scale: 5,
                    brushType: 'stroke',
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'bottom',
                        show: false,
                        color: "#fff",
                        distance: 10,
                    },
                },
                symbol: 'circle',
                symbolSize: [20, 10],
                itemStyle: {
                    normal: {
                        color: '#16ffff',
                        shadowBlur: 10,
                        shadowColor: '#16ffff',
                    },
                    opacity: 1
                },
                zlevel: 4,
            },
        ],
    };
    // 绘画图形
    mycharts.setOption(option)
    // 获取省市区数据
    getProvinceData(mycharts)
})
// 转换数据格式 
const convertData = (data: any) => {
    // 
    var res = [];
    for (var i = 0; i < data?.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
            });
        }
    }
    return res;
}
// 柱状体的主干
function lineData() {
    return toolTipData.map((item) => {
        return {
            coords: [geoCoordMap[item.name], [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + 1.5]]
        }
    })
}
// 柱状体的顶部
function scatterData() {
    return toolTipData.map((item) => {
        return [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + 2, item]
    })
}
// 获取阿里GeoJson数据
// const getGeoJsonData = async () => {
//     const url = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
//     try {
//         const response = await axios.get(url)
//         if (response.status === 200) {
//             featuresList.value = response.data
//             console.log(featuresList.value)
//         }
//     } catch (error) {
//         console.error('请求出错:', error);
//     }
// }
// 获取省市区数据
const getProvinceData = async (obj) => {
    // 查询字符串
    const queryParams = {
        current: 1,
        size: 400,
        filter: JSON.stringify({ selOrgId: 1 }),
    }
    const res = await reqDeviceList(queryParams)
    const deviceInfoList = res.list.records
    const ProvinceData = extractProvinceData(deviceInfoList)
    // 更新柱状体的主干数据
    function lineData1() {
        return ProvinceData.map((item) => {
            return {
                coords: [geoCoordMap[item.name], [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + 1.5]]
            }
        })
    }
    // 更新柱状体的顶部数据
    function scatterData1() {
        return ProvinceData.map((item) => {
            return [geoCoordMap[item.name][0], geoCoordMap[item.name][1] + 2, item]
        })
    }
    // 更新Echarts数据
    obj.setOption({
        tooltip: {
            trigger: 'none',
            formatter: function (params) {
                if (typeof params.value[2] == 'undefined') {
                    var toolTiphtml = '';
                    for (var i = 0; i < ProvinceData.length; i++) {
                        if (params.name == ProvinceData[i].name) {
                            toolTiphtml += ProvinceData[i].name + "：" + ProvinceData[i].value;
                        }
                    }
                    // console.log(toolTiphtml);
                    // console.log(convertData(data))
                    return toolTiphtml;
                } else {
                    var toolTiphtml = '';
                    for (var i = 0; i < ProvinceData.length; i++) {
                        if (params.name == ProvinceData[i].name) {
                            toolTiphtml += ProvinceData[i].name + "：" + ProvinceData[i].value;
                        }
                    }
                    // console.log(toolTiphtml);

                    return toolTiphtml;
                }
            },
            backgroundColor: "#fff",
            borderColor: "#333",
            padding: [5, 10],
            textStyle: {
                color: "#333",
                fontSize: "14"
            }
        },
        series: [
            {
                type: 'map',
                map: mapName,
                geoIndex: 0,
                aspectScale: 1.1, //长宽比
                zoom: 1.1,
                showLegendSymbol: true,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: "#fff",
                            fontSize: "120%"
                        },
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: {
                            type: "linear",
                            x: 1200,
                            y: 0,
                            x2: 0,
                            y2: 0,
                            colorStops: [{
                                offset: 0,
                                color: "rgba(3,27,78,0.75)", // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: "rgba(58,149,253,0.75)", // 50% 处的颜色
                            },],
                            global: true, // 缺省为 false
                        },
                        borderColor: "#fff",
                        borderWidth: 0.2,
                    },
                },
                layoutCenter: ["50%", "50%"],
                layoutSize: "180%",
                animation: false,
                markPoint: {
                    symbol: "none"
                },
                data: data,
            },
            //柱状体的主干
            {
                type: 'lines',
                zlevel: 5,
                effect: {
                    show: false,
                    symbolSize: 5 // 图标大小
                },
                lineStyle: {
                    width: 6, // 尾迹线条宽度
                    color: 'rgba(249, 105, 13, .6)',
                    opacity: 1, // 尾迹线条透明度
                    curveness: 0 // 尾迹线条曲直度
                },
                label: {
                    show: 0,
                    position: 'end',
                    formatter: '245'
                },
                silent: true,
                data: lineData1()
            },
            // 柱状体的顶部
            {
                type: 'scatter',
                coordinateSystem: 'geo',
                geoIndex: 0,
                zlevel: 5,
                label: {
                    normal: {
                        show: true,
                        formatter: function (params) {
                            var name = params.data[2].name
                            var value = params.data[2].value
                            var text = `{tline|${name}} : {fline|${value}}个`
                            // var text = `{tline|项目个数} : {fline|${value}}`
                            return text;
                        },
                        color: '#fff',
                        rich: {
                            fline: {
                                // padding: [0, 25],
                                color: '#fff',
                                fontSize: 14,
                                fontWeight: 600
                            },
                            tline: {
                                // padding: [0, 27],
                                color: '#ABF8FF',
                                fontSize: 12,
                            },
                        }
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    // color: '#00FFF6',
                    color: '#00FFF6',
                    opacity: 1
                },
                // symbol: img2,
                symbol: img2,
                symbolSize: [110, 60],
                symbolOffset: [0, -20],
                z: 999,
                data: scatterData1(),
            },
            {
                name: 'Top 5',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: convertData(ProvinceData),
                showEffectOn: 'render',
                itemStyle: {
                    normal: {
                        color: '#00FFFF',
                    }
                },
                rippleEffect: {
                    scale: 5,
                    brushType: 'stroke',
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'bottom',
                        show: false,
                        color: "#fff",
                        distance: 10,
                    },
                },
                symbol: 'circle',
                symbolSize: [20, 10],
                itemStyle: {
                    normal: {
                        color: '#16ffff',
                        shadowBlur: 10,
                        shadowColor: '#16ffff',
                    },
                    opacity: 1
                },
                zlevel: 4,
            },
        ],
    })
    toolTipData1.value = ProvinceData
}
// 导出省市区数据
function extractProvinceData(data) {
    // 用于存储统计结果
    const provinceMap = {};

    // 遍历数据，提取省份和区域信息
    data.forEach(item => {
        const { snName } = item; // 获取包含省份和区域信息的字段
        let match = []
        if (snName) {
            if(snName.match(/^X/)){
                const snName1 = snName.replace('X','')
                match = snName1.match(/(.*省|.*市)(.*市|.*区)/)
                
            }else{
                match = snName.replace(/^X/, '').match(/(.*省|.*市)(.*市|.*区)/);
            }
            
            // 判断是湖北
            if(match[1] == "湖北省"){
                console.log(snName)
            }
            
            if (match) {
                const province = match[1]; // 省或直辖市部分
                
                const area = match[2]; // 市或区部分
                // 初始化省份数据
                if (!provinceMap[province]) {
                    provinceMap[province] = {
                        name: province.replace('省', ''),
                        value: 0,
                        areas: new Set(), // 使用 Set 去重
                    };
                }
                // 更新省份数据
                provinceMap[province].value += 1;
                provinceMap[province].areas.add(area.replace('市', '').replace('区', ''));
            } else {
                console.log("match不存在", snName)
            }
        }
    });

    // 转换为目标数组格式
    const result = Object.values(provinceMap).map(province => ({
        name: province.name,
        value: province.value,
        areas: Array.from(province.areas), // 将 Set 转为数组
    }));

    return result;
}

</script>

<style scoped lang="scss">
.bar-wrapper {
    margin-top: 10px;
    border-radius: 20px;
    
    ::v-deep(.el-card__body){
        padding: 0;
    }
    .top {
        font-size: 18px;
    }

    .bar {
        height: 450px;
    }

}
</style>