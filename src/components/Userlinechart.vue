<template>
    <div ref="chartRef" class="linechart" style="width: 100%; height: 100%; margin:auto;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
let myChart = null;

onMounted(() => {
    myChart = echarts.init(chartRef.value);

    const option = {
        title: {
            text: '近五年旅游天数',        // 主标题
            subtext: '单位：天',      // 副标题
            left: 'center',              // 水平居中
            top: 10,                     // 距顶部距离
            textStyle: {
                color: '#333',           // 深灰色主标题
                fontSize: 18,
                fontWeight: 'bold'
            },
            subtextStyle: {
                color: '#777',           // 中灰色副标题
                fontSize: 14
            }
        },
        xAxis: {
            type: 'category',
            data: ['2020', '2021', '2022', '2023', '2024', '2025'],
            axisLine: { lineStyle: { color: '#3b3b3b40' } },
            axisLabel: { color: '#3b3b3b' }
        },
        yAxis: {
            type: 'value',
            show: true,
            axisLine: { lineStyle: { color: 'rgba(120, 120, 120, 0.3)' } },
            axisLabel: { color: '#3b3b3b' },
            splitLine: { lineStyle: { color: 'rgba(200, 200, 200, 0.3)' } }
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '5%',
            containLabel: true
        },
        label: {
            show: false,
            position: 'center'
        },
        labelLine: {
            show: false
        },
        tooltip: { trigger: 'item' },
        series: [{
            data: [6, 18, 17, 25, 31, 24],
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolsize: 6,
            lineStyle: {
                color: '#6DE089',           // 主线条：深灰色
                width: 4,                // 线条加粗
                shadowBlur: 50,           // 微阴影增强层次
                shadowColor: '#6DE089'
            },
            itemStyle: {
                color: '#fff',
                borderWidth: 2,
                borderColor: '#3BFF76'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#6DE999' },
                    { offset: 1, color: '#3BFF7600' }
                ])
            }
        }]
    };

    myChart.setOption(option);

    const handleResize = () => myChart?.resize();
    window.addEventListener('resize', handleResize);

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
        if (myChart) {
            myChart.dispose();
            myChart = null;
        }
    });
});
</script>