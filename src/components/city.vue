<!-- 仅把第一根柱子换成蓝→浅蓝渐变 -->
<template>
    <div ref="chartDom" class="barchart" style="width: 400px; height: 300px; margin: 1px auto"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    BarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    CanvasRenderer,
])

const chartDom = ref(null)
let instance = null

onMounted(() => {
    instance = echarts.init(chartDom.value)

    const option = {
        title: { text: '2024年旅游人数最多的国内前五名城市', left: 'center', top: 0 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['人数'], top: 20, left: 50 },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['重庆市', '上海市', '北京市', '武汉市', '杭州市'],
        },
        yAxis: {
            type: 'value',
            name: '亿人次',
        },
        series: [
            {
                name: '数量',
                type: 'bar',
                data: [4.11, 3.7, 3.22, 3.19, 2.08],
                color: [
                    // 仅这里换了第一种颜色
                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: '#B998E7' },
                        { offset: 1, color: '#AD6DFF' },
                    ]),

                ],
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' },
                        ]),
                    },
                    label: {
                        show: true,
                        valueAnimation: true,
                    },
                },
            },
        ],
    }

    instance.setOption(option)
    window.addEventListener('resize', instance.resize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', instance.resize)
    instance.dispose()
})
</script>