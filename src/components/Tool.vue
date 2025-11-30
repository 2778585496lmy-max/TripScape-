<template>
    <!-- 手风琴折叠壳：仅包最外层，内部代码一行不动 -->
    <div class="tool-accordion">
        <!-- 折叠手柄 -->
        <div class="accordion-header" @click="toggleAccordion">
            <span class="accordion-title">工具栏</span>
            <i class="accordion-arrow" :class="{ 'is-open': accordionOpen }"></i>
        </div>

        <!-- 折叠内容：原整颗组件 -->
        <transition name="accordion">
            <div v-show="accordionOpen" class="accordion-body">
                <div class="tool-container">
                    <!-- 以下全部是你原来的 template 内容，一行没动 -->
                    <div class="tool-section">
                        <div class="section-title">底图切换</div>
                        <div class="layer-switcher">
                            <button v-for="layer in availableLayers" :key="layer.name"
                                :class="{ active: currentLayer === layer.name }" @click="switchLayer(layer.name)"
                                class="compact-btn">{{ layer.label }}</button>
                        </div>
                    </div>
                    <div class="tool-section">
                        <div class="section-title">测量工具</div>
                        <div class="measure-buttons">
                            <button @click="toggleMeasure" :class="{ active: isMeasuring }" title="测量距离"
                                class="compact-btn">
                                <i class="fas fa-ruler"></i> 测量距离
                            </button>
                            <button @click="toggleAreaMeasure" :class="{ active: isMeasuringArea }" title="测量面积"
                                class="compact-btn">
                                <i class="fas fa-draw-polygon"></i> 测量面积
                            </button>
                        </div>
                        <div v-if="measureDistance" class="measure-result">距离: {{ measureDistance }} 米</div>
                        <div v-if="areaResult" class="measure-result">面积: {{ areaResult }}</div>
                        <div class="measure-clear-buttons">
                            <button v-if="measurePoints.length > 0" @click="clearMeasure" class="compact-btn clear-btn">
                                <i class="fas fa-trash"></i> 清除测距
                            </button>
                            <button v-if="areaFeatureCount > 0" @click="clearAreaMeasurements"
                                class="compact-btn clear-btn">
                                <i class="fas fa-eraser"></i> 清除面积
                            </button>
                        </div>
                    </div>

                    <div class="tool-section">
                        <div class="section-title">路线编辑</div>
                        <div class="route-tools">
                            <button @click="addStartPoint" :class="{ active: currentAction === 'start' }" title="添加起点"
                                class="compact-btn"><i class="fas fa-flag-checkered"></i> 起点</button>
                            <button @click="addEndPoint" :class="{ active: currentAction === 'end' }" title="添加终点"
                                class="compact-btn"><i class="fas fa-flag"></i> 终点</button>
                            <button @click="addWaypoint" :class="{ active: currentAction === 'waypoint' }" title="添加途经点"
                                class="compact-btn"><i class="fas fa-map-marker-alt"></i> 途经点</button>
                        </div>
                        <div class="route-info" v-if="routePoints.length > 0">
                            <div>已添加 {{ routePoints.length }} 个点</div>
                            <div class="route-points-list">
                                <div v-for="(point, index) in routePoints" :key="index" class="route-point-item">{{
                                    index + 1 }}. {{ point.name }}</div>
                            </div>
                        </div>
                        <button v-if="routePoints.length > 0" @click="clearRoute" class="compact-btn clear-btn"><i
                                class="fas fa-trash"></i> 清除路线</button>
                    </div>

                    <div class="tool-section">
                        <div class="section-title">路线操作</div>
                        <div class="route-actions">
                            <button @click="saveRoute" :disabled="routePoints.length < 2" class="compact-btn"
                                :class="{ disabled: routePoints.length < 2 }"><i class="fas fa-save"></i> 保存</button>
                            <button @click="createNewRoute" class="compact-btn"><i class="fas fa-plus-circle"></i>
                                新建</button>
                            <button @click="openGaodeNavigation" :disabled="routePoints.length < 2" class="compact-btn"
                                :class="{ disabled: routePoints.length < 2 }">
                                <i class="fas fa-location-arrow"></i> 高德导航
                            </button>
                        </div>
                    </div>

                    <div class="tool-section" v-if="savedRoutes.length > 0">
                        <div class="section-title">历史路线</div>
                        <div class="saved-route-list">
                            <div v-for="route in savedRoutes" :key="route.id" class="saved-route-item">
                                <div class="saved-route-info">
                                    <div class="saved-route-name">{{ route.name }}</div>
                                    <div class="saved-route-meta">{{ formatRouteTimestamp(route.createdAt) }} · {{
                                        route.points.length }} 个点</div>
                                </div>
                                <div class="saved-route-actions">
                                    <button class="compact-btn" @click="loadSavedRoute(route.id)">
                                        加载
                                    </button>
                                    <button class="compact-btn" @click="renameSavedRoute(route.id)">
                                        改名
                                    </button>
                                    <button class="compact-btn danger" @click="removeSavedRoute(route.id)">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
/* -- 仅新增手风琴逻辑 -- */
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import LineString from 'ol/geom/LineString'
import Polygon from 'ol/geom/Polygon'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Style from 'ol/style/Style'
import CircleStyle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'
import Draw from 'ol/interaction/Draw'
import { fromLonLat, toLonLat } from 'ol/proj'
import { getLength, getArea } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import eventBus from '@/utils/eventBus.js'

const accordionOpen = ref(false) // 默认展开
const toggleAccordion = () => (accordionOpen.value = !accordionOpen.value)

// 响应式数据
const isMeasuring = ref(false)
const currentLayer = ref('mapboxstylelayer')
const currentAction = ref(null)
const measurePoints = ref([])
const measureDistance = ref(0)
const isMeasuringArea = ref(false)
const areaResult = ref('')
const areaFeatureCount = ref(0)
const routePoints = ref([])
const gaodeNavigationUrl = ref('')
const savedRoutes = ref([])
const map = ref(null)

// 图层引用
const measureLayer = ref(null)
const areaLayer = ref(null)
const routeLayer = ref(null)
const measureLine = ref(null)
const areaInteraction = ref(null)

// 监听器引用
let mapClickListenerKey = null
const ROUTE_STORAGE_KEY = 'tripscape_saved_routes'

// 可选图层配置
const availableLayers = [
    { name: 'mapboxstylelayer', label: '底图1' },
    { name: 'over', label: '底图2' },
    { name: 'weixing', label: '卫星图' },
]

// 监听地图实例事件
const mapReadyHandler = (mapInstance) => {
    console.log('Tool 接收到地图实例:', mapInstance)
    map.value = mapInstance
    initLayers()
}

const layerSwitchedHandler = (layerName) => {
    currentLayer.value = layerName
}

onMounted(() => {
    console.log('Tool 组件挂载，开始监听 mapReady 事件')
    loadSavedRoutes()
    eventBus.on('mapReady', mapReadyHandler)
    eventBus.on('layerSwitched', layerSwitchedHandler)
    // 主动请求地图实例，防止 Tool 比 Map2 晚挂载拿不到事件
    eventBus.emit('requestMap')
})

// 初始化测量和路线图层
const initLayers = () => {
    if (!map.value) return

    // 测量图层
    measureLayer.value = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            stroke: new Stroke({ color: 'red', width: 2 }),
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({ color: 'red' }),
                stroke: new Stroke({ color: 'white', width: 2 }),
            }),
        }),
    })

    // 面积图层
    areaLayer.value = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            stroke: new Stroke({
                color: '#5c7c95',
                width: 2,
                lineDash: [6, 6],
            }),
            fill: new Fill({
                color: 'rgba(92, 124, 149, 0.2)',
            }),
        }),
    })

    // 路线图层
    routeLayer.value = new VectorLayer({
        source: new VectorSource(),
        style: (feature) => {
            const type = feature.get('type')
            const name = feature.get('name')

            if (type === 'point') {
                let color = 'green'
                if (name === '起点') color = 'red'
                if (name === '终点') color = 'blue'
                return new Style({
                    image: new CircleStyle({
                        radius: 6,
                        fill: new Fill({ color }),
                        stroke: new Stroke({ color: 'white', width: 2 }),
                    }),
                    text: new Text({
                        text: name,
                        offsetY: -15,
                        fill: new Fill({ color: '#000' }),
                        stroke: new Stroke({ color: '#fff', width: 2 }),
                    }),
                })
            } else if (type === 'line') {
                return new Style({
                    stroke: new Stroke({ color: 'blue', width: 3 }),
                })
            }
        },
    })

    // 添加图层到地图
    map.value.addLayer(measureLayer.value)
    map.value.addLayer(areaLayer.value)
    map.value.addLayer(routeLayer.value)
}

// 清理所有监听器
const cleanupListeners = () => {
    if (mapClickListenerKey) {
        unByKey(mapClickListenerKey)
        mapClickListenerKey = null
    }
}

const disableAreaInteraction = () => {
    if (areaInteraction.value && map.value) {
        map.value.removeInteraction(areaInteraction.value)
        areaInteraction.value = null
    }
}

const stopAreaMeasuring = () => {
    disableAreaInteraction()
    isMeasuringArea.value = false
}

// 重置所有状态
const resetAllStates = ({ preserveMeasure = false, preserveArea = false } = {}) => {
    cleanupListeners()
    if (!preserveMeasure) {
        isMeasuring.value = false
    }
    if (!preserveArea) {
        stopAreaMeasuring()
    }
    currentAction.value = null
}

const loadSavedRoutes = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
        const stored = localStorage.getItem(ROUTE_STORAGE_KEY)
        if (stored) {
            savedRoutes.value = JSON.parse(stored)
        }
    } catch (error) {
        console.error('加载历史路线失败', error)
        savedRoutes.value = []
    }
}

const persistSavedRoutes = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
        localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify(savedRoutes.value))
    } catch (error) {
        console.error('保存历史路线失败', error)
    }
}

const promptRouteName = (defaultName) => {
    if (typeof window === 'undefined' || typeof window.prompt !== 'function') {
        return defaultName
    }
    const result = window.prompt('请输入路线名称', defaultName)
    if (!result) return defaultName
    return result.trim() || defaultName
}

// 地图控制功能
const zoomIn = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法放大')
        return
    }
    const view = map.value.getView()
    view.animate({ zoom: view.getZoom() + 1, duration: 250 })
}

const zoomOut = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法缩小')
        return
    }
    const view = map.value.getView()
    view.animate({ zoom: view.getZoom() - 1, duration: 250 })
}

const resetView = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法重置视图')
        return
    }
    map.value.getView().animate({
        center: fromLonLat([119.7139, 30.2]),
        zoom: 10,
        duration: 500,
    })
}

// 测量工具功能
const toggleMeasure = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法使用测量工具')
        return
    }

    if (isMeasuring.value) {
        stopMeasuring()
        return
    }

    resetAllStates({ preserveMeasure: true })
    isMeasuring.value = true
    startMeasuring()
}

const startMeasuring = () => {
    if (!map.value || !measureLayer.value) return

    // 清除之前的测量数据
    clearMeasureData()

    // 添加点击监听器
    mapClickListenerKey = map.value.on('click', (evt) => {
        addMeasurePoint(evt.coordinate)
    })

    console.log('开始测量模式')
}

const addMeasurePoint = (coordinate) => {
    if (!measureLayer.value) return

    measurePoints.value.push(coordinate)

    // 添加测量点
    const point = new Feature({
        geometry: new Point(coordinate),
    })
    measureLayer.value.getSource().addFeature(point)

    // 添加测量线
    if (measurePoints.value.length > 1) {
        // 移除旧的测量线
        if (measureLine.value) {
            measureLayer.value.getSource().removeFeature(measureLine.value)
        }

        const line = new Feature({
            geometry: new LineString(measurePoints.value),
        })
        measureLayer.value.getSource().addFeature(line)
        measureLine.value = line

        // 计算距离
        calculateDistance()
    }
}

const calculateDistance = () => {
    if (measurePoints.value.length < 2) {
        measureDistance.value = 0
        return
    }

    const lineString = new LineString(measurePoints.value)
    const length = getLength(lineString)
    measureDistance.value = length.toFixed(2)
    console.log('测量距离:', measureDistance.value, '米')
}

const stopMeasuring = () => {
    clearMeasureData()
    resetAllStates()
    console.log('结束测量模式')
}

const clearMeasure = () => {
    stopMeasuring()
}

const clearMeasureData = () => {
    if (measureLayer.value) {
        measureLayer.value.getSource().clear()
    }
    measurePoints.value = []
    measureDistance.value = 0
    measureLine.value = null
}

const toggleAreaMeasure = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法使用面积测量')
        return
    }

    if (isMeasuringArea.value) {
        stopAreaMeasuring()
        return
    }

    resetAllStates()
    isMeasuringArea.value = true
    startAreaMeasuring()
}

const startAreaMeasuring = () => {
    if (!map.value || !areaLayer.value) return

    disableAreaInteraction()

    const source = areaLayer.value.getSource()
    areaInteraction.value = new Draw({
        source,
        type: 'Polygon',
    })

    areaInteraction.value.on('drawstart', () => {
        source.clear()
        areaResult.value = ''
        areaFeatureCount.value = 0
    })

    areaInteraction.value.on('drawend', (evt) => {
        const geometry = evt.feature.getGeometry()
        const areaValue = calculateAreaForGeometry(geometry)
        areaResult.value = formatAreaValue(areaValue)
        areaFeatureCount.value = source.getFeatures().length
        stopAreaMeasuring()
    })

    map.value.addInteraction(areaInteraction.value)
}

const calculateAreaForGeometry = (geometry) => {
    if (!geometry) return 0
    const projection = map.value?.getView()?.getProjection()
    return getArea(geometry, { projection })
}

const formatAreaValue = (area) => {
    if (!area || Number.isNaN(area)) return ''
    if (area >= 1_000_000) {
        return `${(area / 1_000_000).toFixed(2)} km²`
    }
    if (area >= 10_000) {
        return `${(area / 10_000).toFixed(2)} 公顷`
    }
    return `${area.toFixed(2)} m²`
}

const clearAreaMeasurements = () => {
    if (areaLayer.value) {
        areaLayer.value.getSource().clear()
    }
    areaResult.value = ''
    areaFeatureCount.value = 0
}

// 路线编辑功能
const addStartPoint = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法添加起点')
        return
    }
    addPoint('start', '起点')
}

const addEndPoint = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法添加终点')
        return
    }
    addPoint('end', '终点')
}

const addWaypoint = () => {
    if (!map.value) {
        console.error('地图实例不存在，无法添加途经点')
        return
    }
    addPoint('waypoint', '途经点')
}

const addPoint = (type, name) => {
    if (!map.value) return

    // 清理其他模式
    resetAllStates()

    currentAction.value = type

    // 添加点击监听器
    mapClickListenerKey = map.value.on('click', (evt) => {
        createRoutePoint(evt.coordinate, { name, type })
        // 单次点击后自动结束
        resetAllStates()
    })

    console.log(`开始添加${name}`)
}

const createRoutePoint = (coordinate, meta) => {
    if (!routeLayer.value) return

    // 添加路线点
    const point = new Feature({
        geometry: new Point(coordinate),
        name: meta.name,
        type: 'point',
    })
    routeLayer.value.getSource().addFeature(point)

    // 保存路线点数据
    routePoints.value.push({
        coordinate,
        name: meta.name,
        type: meta.type,
    })

    // 更新路线线
    updateRouteLine()

    console.log(`添加${name}成功，当前点数:`, routePoints.value.length)
}

const updateRouteLine = () => {
    if (!routeLayer.value) return

    // 清除旧路线
    const source = routeLayer.value.getSource()
    const features = source.getFeatures()
    for (let i = features.length - 1; i >= 0; i--) {
        if (features[i].get('type') === 'line') {
            source.removeFeature(features[i])
        }
    }

    // 添加新路线
    if (routePoints.value.length >= 2) {
        const coordinates = routePoints.value.map((p) => p.coordinate)
        const line = new Feature({
            geometry: new LineString(coordinates),
            type: 'line',
        })
        source.addFeature(line)
        console.log('路线已更新，点数量:', routePoints.value.length)
    }
}

// 修复：彻底清除路线
const clearRoute = () => {
    console.log('开始清除路线，当前点数:', routePoints.value.length)

    // 1. 清除图层数据
    if (routeLayer.value) {
        const source = routeLayer.value.getSource()
        source.clear()
        console.log('路线图层已清空')
    }

    // 2. 重置所有数据
    routePoints.value = []
    updateGaodeNavigation()

    // 3. 重置状态
    resetAllStates()

    console.log('路线清除完成')
}

// 底图切换功能
const switchLayer = (name) => {
    if (!map.value) {
        console.error('地图实例不存在，无法切换底图')
        return
    }

    // 通过事件总线通知 Map2 组件切换图层
    eventBus.emit('switchLayer', name)
    currentLayer.value = name
}

const generateRouteName = () => {
    const now = new Date()
    const pad = (num) => String(num).padStart(2, '0')
    return `路线 ${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const addRouteToHistory = (routeName) => {
    const record = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: routeName || generateRouteName(),
        createdAt: new Date().toISOString(),
        points: routePoints.value.map((point) => ({
            coordinate: [...point.coordinate],
            name: point.name,
            type: point.type,
        })),
    }
    savedRoutes.value = [record, ...savedRoutes.value]
}

const loadSavedRoute = (routeId) => {
    if (!routeLayer.value) {
        alert('地图尚未准备好，无法加载路线')
        return
    }
    const record = savedRoutes.value.find((route) => route.id === routeId)
    if (!record) {
        alert('未找到对应的历史路线')
        return
    }
    clearRoute()
    record.points.forEach((point) => {
        createRoutePoint(point.coordinate, { name: point.name, type: point.type })
    })
    if (routePoints.value.length >= 2) {
        showGaodePreview.value = true
    }
    alert(`已加载 ${record.name}`)
}

const removeSavedRoute = (routeId) => {
    savedRoutes.value = savedRoutes.value.filter((route) => route.id !== routeId)
}

const renameSavedRoute = (routeId) => {
    const route = savedRoutes.value.find((item) => item.id === routeId)
    if (!route) return
    const newName = promptRouteName(route.name)
    if (newName && newName !== route.name) {
        route.name = newName
    }
}

const formatRouteTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) return '未知时间'
    return date.toLocaleString('zh-CN', { hour12: false })
}

// 路线操作功能
const saveRoute = () => {
    if (routePoints.value.length < 2) {
        alert('请至少添加起点和终点')
        return
    }
    console.log('保存路线:', routePoints.value)
    const name = promptRouteName(generateRouteName())
    addRouteToHistory(name)
    alert(`路线保存成功！共 ${routePoints.value.length} 个点`)
    // 这里可以添加保存到服务器或本地存储的逻辑
}

const createNewRoute = () => {
    clearRoute()
}

const GAODE_NAV_URI = 'https://uri.amap.com/navigation'

const updateGaodeNavigation = () => {
    if (routePoints.value.length < 2) {
        gaodeNavigationUrl.value = ''
        return
    }

    const lonLatPoints = routePoints.value.map((point, idx) => {
        const [lon, lat] = toLonLat(point.coordinate)
        return {
            ...point,
            lon: lon.toFixed(6),
            lat: lat.toFixed(6),
            label: point.name || `点${idx + 1}`,
        }
    })

    const start = lonLatPoints[0]
    const end = lonLatPoints[lonLatPoints.length - 1]
    const vias = lonLatPoints.slice(1, -1)
    const viaParam = vias.length
        ? `&via=${vias.map((p, idx) => `${p.lon},${p.lat},途经点${idx + 1}`).join('|')}`
        : ''

    gaodeNavigationUrl.value =
        `${GAODE_NAV_URI}?from=${start.lon},${start.lat},${start.label}` +
        `&to=${end.lon},${end.lat},${end.label}${viaParam}` +
        '&mode=car&src=TripScape&coordinate=gaode&callnative=0'
}

const openGaodeNavigation = () => {
    if (!gaodeNavigationUrl.value) {
        alert('请先添加起点和终点')
        return
    }
    if (typeof window !== 'undefined' && window.open) {
        window.open(gaodeNavigationUrl.value, '_blank')
    } else {
        alert(`请手动打开链接：\n${gaodeNavigationUrl.value}`)
    }
}

watch(routePoints, () => {
    updateGaodeNavigation()
}, { deep: true })

watch(savedRoutes, () => {
    persistSavedRoutes()
}, { deep: true })

// 组件销毁时清理资源
onUnmounted(() => {
    resetAllStates()
    if (measureLayer.value && map.value) {
        map.value.removeLayer(measureLayer.value)
    }
    if (areaLayer.value && map.value) {
        map.value.removeLayer(areaLayer.value)
    }
    if (routeLayer.value && map.value) {
        map.value.removeLayer(routeLayer.value)
    }
    // 移除事件监听
    eventBus.off('mapReady', mapReadyHandler)
    eventBus.off('layerSwitched', layerSwitchedHandler)
})
</script>

<style scoped>
.tool-accordion {
    background: linear-gradient(140deg, #f8fbff , #e8eef3);
    border-radius: 16px;
    border: 1px solid rgba(109, 132, 156, 0.18);
    box-shadow: 0 20px 45px rgba(58, 79, 98, 0.16);
    width: 240px;
    overflow: hidden;
}

.accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.55);
    color: #2f3e4d;
    cursor: pointer;
    user-select: none;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.4px;
    transition: background 0.3s ease, color 0.3s ease;
}

.accordion-header:hover {
    background: rgba(255, 255, 255, 0.8);
}

.accordion-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.accordion-arrow {
    width: 12px;
    height: 12px;
    border: solid #335a82;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    transition: transform 0.25s ease;
}

.accordion-arrow.is-open {
    transform: rotate(-135deg);
}

.accordion-body {
    overflow: hidden;
    background: #ffffff00;
}

.accordion-enter-active,
.accordion-leave-active {
    transition: max-height 0.35s ease;
}

.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
    max-height: 1000px;
}

.tool-container {
    padding: 18px 16px;
    background: rgba(255, 255, 255, 0);
    border-radius: 18px;
    max-height: 80vh;
    overflow-y: auto;
    width: 240px;
}

.tool-section {
    margin-bottom: 16px;
    padding: 12px 12px 14px;
    border-radius: 14px;
    border: 1px solid rgba(135, 156, 173, 0.2);
    background: rgba(255, 255, 255, 0.93);
    box-shadow: 0 10px 25px rgba(74, 94, 111, 0.08);
}

.tool-section:last-child {
    margin-bottom: 0;
}

.section-title {
    font-size: 12px;
    font-weight: 700;
    color: #54657a;
    margin-bottom: 10px;
    letter-spacing: 0.3px;
}

.zoom-controls,
.route-tools,
.route-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.layer-switcher {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.layer-switcher .compact-btn {
    width: 100%;
}

.saved-route-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: fit-content;
    overflow-y: auto;
}

.saved-route-item {
    border: 1px solid rgba(140, 165, 187, 0.25);
    border-radius: 12px;
    padding: 5px;
    background: rgba(240, 245, 249, 0.95);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.saved-route-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.saved-route-name {
    font-size: 12px;
    font-weight: 700;
    color: #3c5266;
}

.saved-route-meta {
    font-size: 10px;
    color: #738292;
}

.saved-route-actions {
    display: flex;
    gap: 6px;
    margin-top: 8px;
}

.saved-route-actions .compact-btn {
    flex: 1;
    min-width: auto;
    height: 30px;
}

.compact-btn {
    padding: 7px 11px;
    border: none;
    border-radius: 15px;
    background: #eef2f6;
    cursor: pointer;
    font-size: 11px;
    transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
    color: #3f5466;
    border: 1px solid rgba(146, 165, 184, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-shadow: 0 6px 15px rgba(74, 95, 113, 0.12);
    flex: 1;
    min-width: 60px;
    height: 32px;
}

.compact-btn:hover {
    background: #f8fbff;
    transform: translateY(-1px);
    box-shadow: 0 12px 20px rgba(66, 86, 105, 0.18);
}

.compact-btn.active {
    background: linear-gradient(135deg, #b2c9da, #8caac2);
    color: #243648;
    border-color: transparent;
    box-shadow: 0 18px 30px rgba(119, 150, 176, 0.35);
}

.compact-btn.danger {
    background: #f4dfe1;
    color: #c1656c;
    border-color: transparent;
    box-shadow: none;
}

.compact-btn.danger:hover {
    background: #f2ced3;
}

.compact-btn.disabled {
    background: #f0f2f4;
    color: #a6afb8;
    cursor: not-allowed;
    opacity: 0.65;
    border-color: rgba(170, 180, 190, 0.4);
    box-shadow: none;
}

.compact-btn.disabled:hover {
    transform: none;
}

.clear-btn {
    background: #e2e8f0;
    color: #5d6f80;
    border-color: transparent;
    width: 100%;
    margin-top: 6px;
    box-shadow: none;
}

.clear-btn:hover {
    background: #d5dee9;
}

.measure-result {
    font-size: 11px;
    color: #4b5a67;
    background: #f2f6fa;
    padding: 5px 8px;
    border-radius: 8px;
    margin-top: 6px;
    border: 1px solid rgba(143, 162, 180, 0.35);
    text-align: center;
}

.route-info {
    margin-top: 8px;
    font-size: 11px;
    color: #5f6d7d;
}

.route-points-list {
    max-height: 110px;
    overflow-y: auto;
    margin-top: 6px;
    border: 1px solid rgba(152, 171, 190, 0.4);
    border-radius: 10px;
    padding: 6px;
    background: rgba(255, 255, 255, 0.93);
}

.route-point-item {
    padding: 4px 6px;
    font-size: 10px;
    border-bottom: 1px dashed rgba(174, 190, 205, 0.6);
    color: #4f6274;
}

.route-point-item:last-child {
    border-bottom: none;
}

.measure-buttons {
    display: flex;
    gap: 6px;
    margin-bottom: 6px;
}

.measure-clear-buttons {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
}

.tool-container::-webkit-scrollbar {
    width: 5px;
}

.tool-container::-webkit-scrollbar-track {
    background: rgba(152, 168, 184, 0.2);
    border-radius: 999px;
}

.tool-container::-webkit-scrollbar-thumb {
    background: rgba(126, 149, 170, 0.6);
    border-radius: 999px;
}
</style>