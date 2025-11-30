<!-- A级景区数量饼状图 -->
<template>
    <div ref="chartDom" style="width: 400px; height: 300px;margin: 1px auto;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 注册
echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const chartDom = ref(null)
let instance = null

onMounted(() => {
    instance = echarts.init(chartDom.value)

    const option = {
        title: { text: '全国A级景区类别', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { orient: 'horizontal', left: 'center', bottom: 5 },
        series: [
            {
                name: '景区类别',
                type: 'pie',
                color: [
                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: '#6DE089' },  // 左上角颜色
                        { offset: 1, color: '#3BFF76' }   // 右下角颜色
                    ]),
                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: '#B998E7' },  // 左上角颜色
                        { offset: 1, color: '#AD6DFF' }   // 右下角颜色
                    ]),
                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: '#7AB8F7' },  // 左上角颜色
                        { offset: 1, color: '#5FB2FF' }   // 右下角颜色
                    ]),
                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: '#64E9D0' },  // 左上角颜色
                        { offset: 1, color: '#38FFDC' }   // 右下角颜色
                    ]),
                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: '#3a3a3a' },  // 左上角颜色
                        { offset: 1, color: '#000000' }   // 右下角颜色
                    ]),
                    new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                        { offset: 0, color: '#A7BAEC' },  // 左上角颜色
                        { offset: 1, color: '#090979' }   // 右下角颜色
                    ]),
                ],
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 1.5,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 113, name: '1A景区' },
                    { value: 2135, name: '2A景区' },
                    { value: 5800, name: '3A景区' },
                    { value: 3657, name: '4A景区' },
                    { value: 261, name: '5A景区' }
                ],
            }
        ]
    }

    instance.setOption(option)

    // 自适应
    window.addEventListener('resize', instance.resize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', instance.resize)
    instance.dispose()
})
</script>