<!--  -->
<template>
    <div ref="chartDom" class="linechart" style="width: 400px; height: 300px; margin: 1px auto"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { color } from 'echarts'

echarts.use([
    LineChart,
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
        title: { text: '近几年旅游人数及消费概况', left: 'center', top: 0 },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999',
                },
            },
        },
        legend: {
            data: ['旅游花费（万亿元）', '旅游人数（亿人次）'],
        },
        xAxis: [
            {
                type: 'category',
                data: [
                    '2011',
                    '2012',
                    '2013',
                    '2014',
                    '2015',
                    '2016',
                    '2017',
                    '2018',
                    '2019',
                    '2020',
                    '2021',
                    '2022',
                    '2023',
                    '2024',
                ],
                axisPointer: {
                    type: 'shadow',
                },
            },
        ],
        yAxis: [
            {
                type: 'value',
                name: '万亿元',
                min: 0,
                max: 6,
                interval: 1,
            },
            {
                type: 'value',
                name: '亿人次',
                min: 0,
                max: 70,
                interval: 10,
            },
        ],
        series: [
            {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                    { offset: 0, color: '#A7BAEC' },
                    { offset: 1, color: '#090979' },
                ]),
                name: '旅游花费（万亿元）',
                type: 'bar',
                tooltip: {
                    valueFormatter: function (value) {
                        return value
                    },
                },
                data: [1.9, 2.3, 2.6, 3.0, 3.4, 3.9, 4.6, 5.1, 5.7, 2.2, 2.9, 2.0, 4.9, 5.8],
                label: {
                    show: false,
                    valueAnimation: true,
                },
            },
            {
                name: '旅游人数（亿人次）',
                type: 'line',
                yAxisIndex: 1,
                tooltip: {
                    valueFormatter: function (value) {
                        return value
                    },
                },
                data: [26.4, 29.6, 32.6, 36.1, 39.9, 44.4, 50.0, 55.4, 60.1, 28.8, 32.5, 25.3, 48.9, 56.2],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                    { offset: 0, color: '#6DE089' },
                    { offset: 1, color: '#3BFF76' },
                ]),
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
