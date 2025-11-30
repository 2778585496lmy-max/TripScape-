<template>
    <div class="operation-panel">
        <!-- 左边：上下两行 -->
        <div class="left">
            <!-- 图层 -->
            <div class="row layer-row">
                <span class="label">图层</span>
                <div class="switch-group">
                    <div class="switch-item">
                        <span >热力图</span>
                        <input id="sw-heat" type="checkbox" @change="$emit('toggleHeat', $event.target.checked)">
                        <label for="sw-heat" class="switch"></label>
                    </div>
                    <div class="switch-item">
                        <span>散点图</span>
                        <input id="sw-scatter" type="checkbox" @change="$emit('toggleScatter', $event.target.checked)">
                        <label for="sw-scatter" class="switch"></label>
                    </div>
                </div>
            </div>

            <!-- 底图 -->
            <div class="row map-row">
                <span class="label">底图</span>
                <div class="btn-group">
                    <button @click="switchBaseMap('vector')" :class="{ active: currentBaseMap === 'vector' }">矢量</button>
                    <button @click="switchBaseMap('satellite')"
                        :class="{ active: currentBaseMap === 'satellite' }">卫星</button>
                </div>
            </div>
        </div>

        <!-- 右边：测量 -->
        <div class="right">
            <div class="measure-group">
                <span class="label">测量</span>
                <div class="btn-group">
                    <button @click="switchMeasure('LineString')"
                        :class="{ active: currentMeasure === 'LineString' }"><ion-icon name="analytics-outline"></ion-icon>距离</button>
                    <button @click="switchMeasure('Polygon')" :class="{ active: currentMeasure === 'Polygon' }"><ion-icon name="cube-outline"></ion-icon>面积</button>
                </div>
                <div class="btn-group clear-row">
                    <button class="clear" @click="switchMeasure('Clear')"
                        :class="{ active: currentMeasure === 'Clear' }"><ion-icon name="trash-outline"></ion-icon>清除所有测量</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
/* 透传事件 */
const emit = defineEmits([
    'toggleHeat',
    'toggleScatter',
    'changeBaseMap',
    'startMeasure'
])

/*+++ 底图 & 测量状态 +++*/
import { ref } from 'vue'
const currentBaseMap = ref('vector')        // 默认矢量
const currentMeasure = ref(null)            // 默认无测量

function switchBaseMap(type) {
    currentBaseMap.value = type
    emit('changeBaseMap', type)
}

function switchMeasure(type) {
    currentMeasure.value = type
    emit('startMeasure', type)
}
</script>

<style scoped>
.operation-panel {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    gap: 12px;
    padding: 8px 10px;
    box-sizing: border-box;
    font-family: 'Noto Sans SC', sans-serif;
    font-size: 13px;
}

.left {
    display: flex;
    flex-direction: column;
    gap: 8px;
    height: 100%;
}

.row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
}

.label {
    font-weight: 500;
    color: #333;
    white-space: nowrap;
}

.layer-row .switch-group {
    display: flex;
    gap: 10px;
}

.switch-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.map-row .btn-group {
    display: flex;
    gap: 6px;
}

/* 开关 */
input {
    display: none
}

.switch {
    display: block;
    width: 60px;
    height: 30px;
    background: #eee;
    border-radius: 15px;
    padding: 2px;
    box-sizing: border-box;
    cursor: pointer;
}

.switch::after {
    content: '';
    display: block;
    width: 50%;
    height: 100%;
    background: #fff;
    border-radius: 13px;
    transition: left .2s;
    position: relative;
    left: 0;
}

input:checked+.switch {
    background: #83ff5d
}

input:checked+.switch::after {
    left: 50%
}

/* 按钮基础 + hover */
button {
    padding: 4px 10px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 3px;
    cursor: pointer;
    transition: all .2s;
    display: flex;
    align-items: center;
    gap: 4px;
}

button ion-icon {
    font-size: 16px;
}

button:hover {
    background: #7AB8F7;
    color: #fff;
    border-color: #7AB8F7;
}

button.active {
    background: #7AB8F7;
    color: #fff;
    border-color: #7AB8F7;
}

button.clear.active {
    background: #f56c6c;
    border-color: #f56c6c
}

/* 清除按钮 hover 也统一 */
button.clear:hover {
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
}

.right {
    display: flex;
    align-items: flex-start;
}

.measure-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.btn-group {
    display: flex;
    gap: 6px;
}

.clear-row {
    width: 100%;
    justify-content: center;
}

.clear-row button {
    min-width: 143px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}
</style>