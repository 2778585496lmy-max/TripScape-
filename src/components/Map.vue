<!-- MapView.vue  最终合并版（含 style） -->
<template>
    <div class="map-wrapper">
        <div id="map" class="map"></div>

        <!-- 经纬度 -->
        <div id="position" class="mouseposition">
            <label style="font-family:'Ubuntu',sans-serif">position:</label>
        </div>

        <!-- 鹰眼图 -->
        <div id="overviewmap" class="overviewmap"></div>

        <!-- 信息卡片 -->
        <div ref="popup" class="info-card" v-show="showCard">
            <div class="title">{{ cardInfo.景区名称 }}</div>
            <div>地区：{{ cardInfo.地区 }}</div>
            <div>等级：{{ cardInfo.景区等级 }}</div>
            <div>经度: {{ cardInfo.经度BD ?? cardInfo.经度 }}</div>
            <div>纬度: {{ cardInfo.纬度BD ?? cardInfo.纬度 }}</div>
            <div class="card">
                <button><ion-icon name="heart-outline"></ion-icon></button>
                <button @click="showCard = false"><ion-icon name="close-outline"></ion-icon></button>
            </div>
        </div>
    </div>
</template>

<script setup>
/* ---------- 1. 依赖引入 ---------- */
import { onMounted, ref, watch } from 'vue'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import 'ol/ol.css'
import { XYZ } from 'ol/source'
import { ScaleLine, Zoom, MousePosition, FullScreen, OverviewMap, ZoomToExtent } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import { createStringXY } from 'ol/coordinate.js'
import { GeoJSON } from 'ol/format'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import { MapboxVectorLayer } from 'ol-mapbox-style'
import VectorLayer from 'ol/layer/Vector'
import { Style, Circle as CircleStyle, Fill, Stroke, Icon } from 'ol/style.js'
import Overlay from 'ol/Overlay'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

/*+++ 测量相关 +++*/
import { Draw } from 'ol/interaction'
import { getArea, getLength } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
import { LineString, Polygon } from 'ol/geom'

/* ---------- 2. 父组件开关 ---------- */
const props = defineProps({
    showHeat: Boolean,
    showScatter: Boolean,
    jumpTarget: { type: Object, default: null },
    selectedSpot: { type: Object, default: null },
    filteredSpots: { type: Array, default: () => [] },
    baseMapType: String,      // 'vector' | 'satellite'
    measureType: String       // 'LineString' | 'Polygon' | 'Clear'
})

/* ---------- 3. 响应式卡片数据 ---------- */
const popup = ref(null)
const showCard = ref(false)
const cardInfo = ref({})

/* ---------- 4. 地图实例 & 图层心跳变量 ---------- */
let map, heatmapLayer, scatterlayer
let targetVectorSource, targetVectorLayer   // 红旗
let filteredVectorSource, filteredVectorLayer // 五角星
let mapboxstylelayer, satelliteLayer, measureLayer, measureSource
let draw, sketch, measureTooltipElement, measureTooltip

/*=== 红旗跳转 ===*/
function flyToSpot(spot) {
    if (!map || !spot) return
    const { 经度, 纬度, 景区名称, 地区, 景区等级 } = spot
    clearTargetMarker()

    const feature = new Feature({
        geometry: new Point(fromLonLat([parseFloat(经度), parseFloat(纬度)])),
        景区名称, 地区, 景区等级, 经度, 纬度
    })
    feature.setStyle(new Style({
        image: new Icon({
            src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23FFD700" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
            scale: 1,
            anchor: [0.5, 1]
        })
    }))
    targetVectorSource.addFeature(feature)

    map.getView().animate({
        center: fromLonLat([parseFloat(经度), parseFloat(纬度)]),
        zoom: 12,
        duration: 2000
    })

    setTimeout(() => {
        cardInfo.value = { 景区名称, 地区, 景区等级, 经度, 纬度 }
        showCard.value = true
    }, 2100)
}
function clearTargetMarker() {
    targetVectorSource.clear()
    showCard.value = false
}

/*=== 五角星筛选 ===*/
function updateFilteredMarkers(spots = null) {
    if (!filteredVectorSource) return
    filteredVectorSource.clear()
    const list = spots || props.filteredSpots
    if (!list || !list.length) return

    list.forEach(spot => {
        const lng = parseFloat(spot.经度)
        const lat = parseFloat(spot.纬度)
        if (isNaN(lng) || isNaN(lat)) return
        const feature = new Feature({
            geometry: new Point(fromLonLat([lng, lat])),
            ...spot
        })
        feature.setStyle(new Style({
            image: new Icon({
                src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23FFD700" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
                scale: 0.8,
                anchor: [0.5, 0.5]
            })
        }))
        filteredVectorSource.addFeature(feature)
    })
}

/*---------- watch ----------*/
watch(() => props.selectedSpot, val => val && flyToSpot(val), { deep: true })
watch(() => props.filteredSpots, val => updateFilteredMarkers(val), { deep: true })
watch(() => props.jumpTarget, val => {
    if (!val || !Number.isFinite(val.lon) || !Number.isFinite(val.lat)) return
    if (!map) return
    const view = map.getView()
    const center = fromLonLat([val.lon, val.lat])
    view.animate(
        { center, duration: 600 },
        { zoom: 16, duration: 2000 },
        { easing: 'inandout' }
    )
    const highlightSource = map.getLayers().getArray().find(l => l instanceof VectorLayer && l.getSource() && !l.get('name')).getSource()
    highlightSource.clear()
    const feature = scatterlayer.getSource().getFeatures().find(f => {
        const [x, y] = f.getGeometry().getCoordinates()
        return Math.abs(x - center[0]) < 1 && Math.abs(y - center[1]) < 1
    })
    if (feature) {
        highlightSource.addFeature(feature)
        cardInfo.value = feature.getProperties()
        const overlay = map.getOverlays().getArray()[0]
        overlay.setPosition(center)
        showCard.value = true
    }
}, { immediate: true })

watch(() => props.baseMapType, val => {
    if (val === 'satellite') {
        if (mapboxstylelayer) mapboxstylelayer.setVisible(false)
        if (satelliteLayer) satelliteLayer.setVisible(true)
    } else {
        if (satelliteLayer) satelliteLayer.setVisible(false)
        if (mapboxstylelayer) mapboxstylelayer.setVisible(true)
    }
})

watch(() => props.measureType, val => {
    if (!map) return
    map.removeInteraction(draw)
    if (val === 'Clear') {
        measureSource.clear()
        document.querySelectorAll('.ol-tooltip-static').forEach(el => el.remove())
        return
    }
    if (val) addInteraction(val)
})

/*---------- 测量辅助函数 ----------*/
function addInteraction(type) {
    draw = new Draw({
        source: measureSource,
        type,
        style: new Style({
            fill: new Fill({ color: 'rgba(255,255,255,0.2)' }),
            stroke: new Stroke({ color: 'rgba(0,0,0,0.5)', lineDash: [10, 10], width: 2 }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({ color: 'rgba(0,0,0,0.7)' }),
                fill: new Fill({ color: 'rgba(255,255,255,0.2)' }),
            }),
        }),
    })
    map.addInteraction(draw)
    createMeasureTooltip()
    let listener
    draw.on('drawstart', evt => {
        sketch = evt.feature
        let tooltipCoord = evt.coordinate
        listener = sketch.getGeometry().on('change', evt => {
            const geom = evt.target
            let output
            if (geom instanceof Polygon) {
                output = formatArea(geom)
                tooltipCoord = geom.getInteriorPoint().getCoordinates()
            } else if (geom instanceof LineString) {
                output = formatLength(geom)
                tooltipCoord = geom.getLastCoordinate()
            }
            measureTooltipElement.innerHTML = output
            measureTooltip.setPosition(tooltipCoord)
        })
    })
    draw.on('drawend', () => {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
        measureTooltip.setOffset([0, -7])
        sketch = null
        measureTooltipElement = null
        createMeasureTooltip()
        unByKey(listener)
    })
}
function createMeasureTooltip() {
    if (measureTooltipElement) measureTooltipElement.parentNode.removeChild(measureTooltipElement)
    measureTooltipElement = document.createElement('div')
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
    measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false,
    })
    map.addOverlay(measureTooltip)
}
function formatLength(line) {
    const length = getLength(line)
    return length > 100
        ? Math.round((length / 1000) * 100) / 100 + ' km'
        : Math.round(length * 100) / 100 + ' m'
}
function formatArea(polygon) {
    const area = getArea(polygon)
    return area > 10000
        ? Math.round((area / 1000000) * 100) / 100 + ' km²'
        : Math.round(area * 100) / 100 + ' m²'
}

defineExpose({ flyToSpot, clearTargetMarker, getMap: () => map })

/*---------- onMounted ----------*/
onMounted(() => {
    const vectorSource1 = new VectorSource({
        url: 'public/attraction.geojson',
        format: new GeoJSON({ extractStyles: false }),
    })
    const vectorSource2 = new VectorSource({
        url: 'public/attraction.geojson',
        format: new GeoJSON({ extractStyles: false }),
    })

    targetVectorSource = new VectorSource()
    targetVectorLayer = new VectorLayer({ source: targetVectorSource, zIndex: 1000 })
    filteredVectorSource = new VectorSource()
    filteredVectorLayer = new VectorLayer({ source: filteredVectorSource, zIndex: 999 })

    heatmapLayer = new Heatmap({
        visible: props.showHeat,
        source: vectorSource1,
        blur: 8,
        radius: 3,
        weight: f => ({ '5A': 1, '4A': 0.8, '3A': 0.6, '2A': 0.4, '1A': 0.2 })[f.get('景区等级')] || 0.1,
    })

    const highlightSource = new VectorSource()
    const highlightLayer = new VectorLayer({
        source: highlightSource,
        style: new Style({
            image: new CircleStyle({
                radius: 10,
                fill: new Fill({ color: '#7AB8F7' }),
                stroke: new Stroke({ color: '#5FB2FF', width: 2 }),
            }),
        }),
    })

    scatterlayer = new VectorLayer({
        visible: props.showScatter,
        source: vectorSource2,
        style: (f, res) => {
            const r = Math.max(0.3, Math.min(4, 4 - ((res - 3) / (500 - 3)) * (4 - 1)))
            return new Style({
                image: new CircleStyle({
                    radius: r,
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#000', width: 1 }),
                }),
            })
        },
    })

    const cva = new TileLayer({
        source: new XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=0157bf26b4209e598a74a02f8b417cd9',
            wrapX: true,
        }),
        zIndex: 2,
    })
    satelliteLayer = new TileLayer({
        visible: false,
        source: new XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=0157bf26b4209e598a74a02f8b417cd9',
            wrapX: true,
        }),
    })
    mapboxstylelayer = new MapboxVectorLayer({
        visible: true,
        styleUrl: 'mapbox://styles/sjbfy202467/cmh5fpht3001l01qv35vshme8',
        accessToken: 'pk.eyJ1Ijoic2piZnkyMDI0NjciLCJhIjoiY2x4NHN5MHQ0MGlyazJqcTlnbm01NzR6biJ9.r6yJxzlpNgSJCBrNMO9l6A',
    })
    measureSource = new VectorSource()
    measureLayer = new VectorLayer({
        source: measureSource,
        style: new Style({
            fill: new Fill({ color: 'rgba(255,255,255,0.2)' }),
            stroke: new Stroke({ color: '#ffcc33', width: 2 }),
            image: new CircleStyle({ radius: 7, fill: new Fill({ color: '#ffcc33' }) }),
        }),
        zIndex: 99,
    })
    const over = new MapboxVectorLayer({
        styleUrl: 'mapbox://styles/sjbfy202467/cmhacpjd7001y01sb03mpbixr',
        accessToken: 'pk.eyJ1Ijoic2piZnkyMDI0NjciLCJhIjoiY2x4NHN5MHQ0MGlyazJqcTlnbm01NzR6biJ9.r6yJxzlpNgSJCBrNMO9l6A',
    })

    const mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(2),
        projection: 'EPSG:4326',
        className: 'position',
        target: document.getElementById('position'),
    })
    const overviewMapControl = new OverviewMap({
        layers: [over],
        target: document.getElementById('overviewmap'),
        collapsed: false,
        collapsible: false,
    })

    map = new Map({
        target: 'map',
        layers: [
            satelliteLayer,
            mapboxstylelayer,
            cva,
            measureLayer,
            heatmapLayer,
            scatterlayer,
            highlightLayer,
            targetVectorLayer,
            filteredVectorLayer,
        ],
        view: new View({
            projection: 'EPSG:3857',
            center: fromLonLat([120, 30]),
            minZoom: 3,
            maxZoom: 16,
            zoom: 5,
        }),
        controls: [
            new ScaleLine(),
            new Zoom(),
            mousePositionControl,
            new FullScreen(),
            overviewMapControl,
            new ZoomToExtent({ extent: [8105744.5, 1979115.9, 15557128.7, 7145978.8] }),
        ],
    })

    watch(() => props.showHeat, val => heatmapLayer.setVisible(val))
    watch(() => props.showScatter, val => scatterlayer.setVisible(val))

    const overlay = new Overlay({ element: popup.value, positioning: 'top-center', offset: [15, 0] })
    map.addOverlay(overlay)
    map.on('click', e => {
        if (props.measureType && props.measureType !== 'Clear') return
        let hit = false
        map.forEachFeatureAtPixel(e.pixel, f => {
            if (f.getGeometry().getType() !== 'Point') return
            hit = true
            cardInfo.value = f.getProperties()
            overlay.setPosition(f.getGeometry().getCoordinates())
            showCard.value = true
        }, { hitTolerance: 3 })
        if (!hit) showCard.value = false
    })

    let currentFeat = null
    map.on('pointermove', e => {
        if (e.dragging) return
        if (props.measureType && props.measureType !== 'Clear') {
            map.getTargetElement().style.cursor = 'crosshair'
            return
        }
        const hit = map.hasFeatureAtPixel(e.pixel, { layerFilter: l => l === scatterlayer })
        map.getTargetElement().style.cursor = hit ? 'pointer' : ''
        const feature = map.forEachFeatureAtPixel(e.pixel, f => f, { layerFilter: l => l === scatterlayer })
        if (feature !== currentFeat) {
            highlightSource.clear()
            currentFeat = null
            if (feature) {
                highlightSource.addFeature(feature)
                currentFeat = feature
            }
        }
    })
})
</script>

<style>
/* 引入字体 */
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap');

/* 原有控件样式 */
.ol-zoom .ol-zoom-in {
    border-radius: 20px 20px 0 0;
    box-shadow: 1px 1px 5px #ccc;
    font-family: 'Ubuntu', sans-serif;
}

.ol-zoom .ol-zoom-out {
    border-radius: 0 0 20px 20px;
    box-shadow: 1px 1px 5px #ccc;
    font-family: 'Ubuntu', sans-serif;
}

.ol-zoom .ol-zoom-in:hover,
.ol-zoom .ol-zoom-out:hover {
    background-color: #b6b6b66b;
}

.ol-control {
    background-color: #ffffff00;
}

.ol-scale-line {
    background-color: transparent;
    font-weight: 800;
}

.ol-scale-line .ol-scale-line-inner {
    border: 2px solid #000;
    border-top: none;
    font-family: 'Ubuntu', sans-serif;
}

.ol-control button {
    border-radius: 20px;
    box-shadow: 1px 1px 5px #ccc;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    border: none;
    font-family: 'Ubuntu', sans-serif;
}

.ol-control button:hover {
    border-radius: 0;
    background-color: #b6b6b66b;
    border: none;
}

/* 容器与地图 */
.map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.map {
    width: 100%;
    height: 100%;
}

/* 鹰眼图 */
.overviewmap {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    border: #fff 2px solid;
    box-shadow: 1px 5px 10px rgba(111, 111, 111, 0.3);
    z-index: 1;
}

/* 经纬度 */
.mouseposition {
    position: absolute;
    width: auto;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.5);
    color: #5b5b5b;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
    z-index: 1;
    font-family: 'Ubuntu', sans-serif;
}

/* 信息卡片 */
.card {
    display: flex;
    gap: 3px;
    justify-self: end;
}

.info-card {
    position: absolute;
    background: #fff;
    border-radius: 10px;
    padding: 8px 12px;
    box-shadow: 0 2px 6px rgba(101, 101, 101, 0.3);
    font-size: 14px;
    min-width: 240px;
}

.info-card .title {
    font-weight: bold;
    margin-bottom: 4px;
}

.info-card button {
    float: right;
    margin-top: 12px;
    padding: 3px;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    display: flex;
    justify-items: center;
    align-items: center;
    background: #fff;
    color: #000;
    border: #3b3b3b 1px solid;
    transition: all 0.3s ease-in-out;
}

.info-card button:hover {
    background: #3b3b3b;
    color: #fff;
    border: #fff;
}

.info-card button:nth-child(1):hover {
    background: #ff2525;
    color: #fff;
    border: #fff;
}

ion-icon {
    font-size: 32px;
    font-weight: 800;
}

/*+++ 测量提示框样式 +++*/
.ol-tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
    font-size: 12px;
    cursor: default;
    user-select: none;
}

.ol-tooltip-measure {
    opacity: 1;
    font-weight: bold;
}

.ol-tooltip-static {
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
}

.ol-tooltip-measure:before,
.ol-tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: '';
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
}

.ol-tooltip-static:before {
    border-top-color: #ffcc33;
}
</style>