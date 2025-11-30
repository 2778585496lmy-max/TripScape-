<!-- 仅替换配色方案 -->
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

    /**************  仅这里替换两种渐变  **************/
    const gradBlue = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
        { offset: 0, color: '#7AB8F7' }, // 左上角
        { offset: 1, color: '#5FB2FF' }, // 右下角
    ])
    const gradGreen = new echarts.graphic.LinearGradient(0, 0, 1, 1, [
        { offset: 0, color: '#64E9D0' },
        { offset: 1, color: '#38FFDC' },
    ])
    /**************************************************/

    const option = {
        title: { text: 'A级景区数量前十的省份', left: 'center', top: 0 },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: ['数量'], top: 20, left: 50 },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['山东', '浙江', '四川', '江苏', '安徽', '广西', '河南', '陕西', '新疆', '广东'],
        },
        yAxis: { type: 'value' },
        series: [
            {
                name: '数量',
                type: 'bar',
                data: [1227, 798, 726, 615, 605, 557, 495, 460, 440, 426],
                // 仅这里换成两种渐变交替
                color: Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? gradBlue : gradGreen)),
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' },
                        ]),
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