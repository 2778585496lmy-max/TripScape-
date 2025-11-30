<template>
    <div class="map-container">
        <div ref="mapElement" class="ol-map"></div>
        <!-- 图层控制 -->
        <div class="layer-control">
            <!-- 折叠开关 -->
            <div class="layer-header" @click="panelOpen = !panelOpen">
                <span>图层切换</span>
                <i class="fas fa-chevron-down" :class="{ rotate: !panelOpen }"></i>
            </div>

        </div>

        <!-- 地图工具 -->
        <div class="map-tools">
            <button class="tool-btn" @click="zoomIn">
                <i class="fas fa-plus"></i>
            </button>
            <button class="tool-btn" @click="zoomOut">
                <i class="fas fa-minus"></i>
            </button>
            <button class="tool-btn" @click="resetView">
                <i class="fas fa-crosshairs"></i>
            </button>
        </div>
        <!-- 经纬度显示 -->
        <div class="mouse-position">
            <label>经纬度:</label>
            <span>{{ mousePosition }}</span>
        </div>
    </div>
</template>

<script setup>
/* --------------------  1. 依赖引入  -------------------- */
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import { MapboxVectorLayer } from 'ol-mapbox-style'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, toLonLat } from 'ol/proj'
import { MousePosition } from 'ol/control'
import { createStringXY } from 'ol/coordinate'
import eventBus from '@/utils/eventBus'

/* --------------------  2. 接口入参  -------------------- */
const props = defineProps({
    center: { type: Array, default: () => [119.7139, 30.2] },
    zoom: { type: Number, default: 10 },
    debug: { type: Boolean, default: false }
})

/* --------------------  3. 模板引用与响应式数据  -------------------- */
const mapElement = ref(null)          // 地图挂载点
let map = null                        // ol.Map 实例

const currentLayer = ref('ditu1')       // 当前底图
const mousePosition = ref('')         // 实时鼠标经纬度
const mapStatus = ref('未初始化')     // 状态条文字
const debug = ref(props.debug)
const panelOpen = ref(false)

/* --------------------  4. 三份图层实例（直接按你要求写死）  -------------------- */
const cva = new TileLayer({
    source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=0157bf26b4209e598a74a02f8b417cd9',
        wrapX: true
    })
})

const over = new MapboxVectorLayer({
    styleUrl: 'mapbox://styles/sjbfy202467/cmhacpjd7001y01sb03mpbixr',
    accessToken: 'pk.eyJ1Ijoic2piZnkyMDI0NjciLCJhIjoiY2x4NHN5MHQ0MGlyazJqcTlnbm01NzR6biJ9.r6yJxzlpNgSJCBrNMO9l6A'
})

const ditu1 = new MapboxVectorLayer({
    styleUrl: 'mapbox://styles/sjbfy202467/cmh5fpht3001l01qv35vshme8',
    accessToken: 'pk.eyJ1Ijoic2piZnkyMDI0NjciLCJhIjoiY2x4NHN5MHQ0MGlyazJqcTlnbm01NzR6biJ9.r6yJxzlpNgSJCBrNMO9l6A'
})

const weixingtu = new TileLayer({
    source: new XYZ({
        url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=0157bf26b4209e598a74a02f8b417cd9',
        wrapX: true
    })
})

/* 统一放到「可选图层」数组里，方便模板循环按钮 */
const availableLayers = computed(() => [
    { name: 'mapboxstylelayer', label: '底图1', icon: 'fas fa-globe', layer: ditu1 },
    { name: 'over', label: '底图2', icon: 'fas fa-layer-group', layer: over },
    { name: 'weixing', label: '卫星图', icon: 'fas fa-layer-group', layer: weixingtu }

])

/* --------------------  5. 初始化地图  -------------------- */
function initMap() {
    if (!mapElement.value) { mapStatus.value = '地图容器未找到'; return }
    mapStatus.value = '初始化中...'

    map = new Map({
        target: mapElement.value,
        layers: [ditu1, cva],                 // 默认先显示mapbox
        view: new View({
            center: fromLonLat(props.center),
            zoom: props.zoom,
            maxZoom: 18,
            minZoom: 3
        }),
        controls: [
            new MousePosition({       // 鼠标经纬度
                coordinateFormat: createStringXY(4),
                projection: 'EPSG:4326',
                className: 'custom-mouse-position',
                target: document.createElement('div')
            })
        ]
    })

    map.once('rendercomplete', () => {
        eventBus.emit('mapReady', map)
        console.log('Map2: 地图渲染完成，已发送 mapReady 事件')
    })

map.on('loadstart', () => (mapStatus.value = '地图加载中...'))
map.on('loadend', () => (mapStatus.value = '地图加载完成'))

map.on('pointermove', (e) => {
    const [lon, lat] = toLonLat(e.coordinate)
    mousePosition.value = `${lon.toFixed(4)}, ${lat.toFixed(4)}`
})

mapStatus.value = '地图初始化成功'
}

/* --------------------  6. 图层切换 / 工具函数  -------------------- */
function switchLayer(name) {
    const item = availableLayers.value.find(v => v.name === name)
    if (!item || !map) return
    map.getLayers().setAt(0, item.layer)
    currentLayer.value = name
    mapStatus.value = `已切换至 ${item.label}`
    eventBus.emit('layerSwitched', name)
}

function zoomIn() {
    if (!map) return
    const v = map.getView()
    v.animate({ zoom: v.getZoom() + 1, duration: 250 })
}
function zoomOut() {
    if (!map) return
    const v = map.getView()
    v.animate({ zoom: v.getZoom() - 1, duration: 250})
}
function resetView() {
    if (!map) return
    map.getView().animate({
        center: fromLonLat(props.center),
        zoom: props.zoom,
        duration: 500
    })
}

/* --------------------  7. 生命周期  -------------------- */
const notifyMapReady = () => {
    if (map) {
        eventBus.emit('mapReady', map)
    }
}

const handleExternalLayerSwitch = (layerName) => {
    switchLayer(layerName)
}

const handleMapRequest = () => {
    notifyMapReady()
}

onMounted(() => {
    console.log('Map2 组件挂载，开始初始化地图')
    initMap()
    notifyMapReady()
    eventBus.on('switchLayer', handleExternalLayerSwitch)
    eventBus.on('requestMap', handleMapRequest)
})
onUnmounted(() => {
    if (map) {
        map.setTarget(null)
    }
    eventBus.off('switchLayer', handleExternalLayerSwitch)
    eventBus.off('requestMap', handleMapRequest)
})

/* --------------------  8. 暴露给模板  -------------------- */
/* 模板里仍用得到这些，所以需要 expose */
defineExpose({
    mapElement,
    currentLayer,
    mousePosition,
    debug,
    availableLayers,
    switchLayer,
    zoomIn,
    zoomOut,
    resetView,
    map
})
</script>

<style scoped>
@import url('https://cdn.bootcdn.net/ajax/libs/font-awesome/6.5.0/css/all.min.css');


.map-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
}

.ol-map {
    width: 100%;
    height: 100%;
    min-height: 300px;
}

.map-tools {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgb(255, 255, 255);
    border-radius: 20px;
    box-shadow: 2px 3px 10px rgba(0, 0, 0, 0.238);
    z-index: 1;
    display: flex;
    flex-direction: column;
    scale: 0.7;
}

.tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-bottom: 1px solid #eee;
    transition: all 0.3s ease;
    color: black;
}

.tool-btn:last-child {
    border-bottom: none;
}

.tool-btn:hover {
    background: #f0f0f0;
}

.mouse-position {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.8);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
}

.mouse-position label {
    font-weight: bold;
    margin-right: 5px;
}
</style>
