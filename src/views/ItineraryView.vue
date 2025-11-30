<template>
    <Navbar />
    <div class="itinerary">
        <div class="content">
            <!-- 主要内容 -->
            <div class="main">
                <div class="map-container">
                    <Map2 ref="mapRef" @map-ready="onMapReady" />
                    <!-- 折叠工具栏 -->
                    <div class="tool-overlay">
                        <Tool />
                    </div>
                </div>
            </div>

            <!-- 次要内容 -->
            <div class="sub">
                <RouteRecommend @select="onRouteSelect" />
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import RouteRecommend from '@/components/RouteRecommend.vue'
import Map2 from '@/components/Map2.vue'
import Tool from '@/components/Tool.vue'

import { ref, onMounted, onUnmounted } from 'vue'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { LineString } from 'ol/geom'
import { Stroke, Style } from 'ol/style'
import eventBus from '@/utils/eventBus.js'

const mapRef = ref(null)
let globalMap = null

// Map2 加载完成会触发这个事件（你原来的 eventBus 方式也保留，双保险）
const onMapReady = (map) => {
    console.log('地图已就绪（@map-ready）')
    globalMap = map
}

// 通过 eventBus 再监听一次（防止 @map-ready 没触发）
onMounted(() => {
    eventBus.on('mapReady', (map) => {
        console.log('地图已就绪（eventBus）')
        globalMap = map
    })
})
onUnmounted(() => {
    eventBus.off('mapReady')
})

// 核心：点击推荐路线 → 画线 + 自动飞过去（已彻底移除所有 alert）
const onRouteSelect = (route) => {
    console.log('点击推荐路线 →', route.title)

    // 如果地图还没准备好，静默等待（不弹窗）
    if (!globalMap) {
        console.log('地图还在初始化，稍后自动绘制')
        return
    }

    // 如果没有路径数据，静默返回
    if (!route.path || route.path.length < 2) {
        console.log('该路线暂无路径数据')
        return
    }

    // 清除旧的推荐路线
    globalMap.getLayers().getArray()
        .filter(layer => layer.get('name') === 'recommendedRoute')
        .forEach(layer => globalMap.removeLayer(layer))

    // 转换坐标并创建线
    const coordinates = route.path.map(coord => fromLonLat(coord))

    const lineFeature = new Feature({
        geometry: new LineString(coordinates)
    })

    lineFeature.setStyle(new Style({
        stroke: new Stroke({
            color: '#409EFF',
            width: 8,
            lineCap: 'round',
            lineJoin: 'round'
        })
    }))

    // 创建并添加新图层
    const routeLayer = new VectorLayer({
        source: new VectorSource({
            features: [lineFeature]
        }),
        zIndex: 999,
        properties: { name: 'recommendedRoute' }  // 方便下次清除
    })

    globalMap.addLayer(routeLayer)

    // 自动飞行到最佳视角（带动画）
    const view = globalMap.getView()
    view.fit(lineFeature.getGeometry(), {
        padding: [120, 120, 120, 120],
        duration: 1500,
        maxZoom: 17
    })

    console.log('路线绘制完成并已飞过去')
}
</script>

<style scoped>
.itinerary {
    height: 100vh;
    width: 100%;
    padding-top: 60px;
    box-sizing: border-box;
    font-size: 2rem;
}

.content {
    box-sizing: border-box;
    padding: 3px;
    display: flex;
    height: 100%;
    width: 100%;
    gap: 5px;
}

.main {
    flex: 7;
    background: #a1a1a1;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.map-container {
    position: relative;
    width: 100%;
    height: 100%;
}


.sub {
    flex: 2;
    box-sizing: border-box;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
}

.search {
    justify-items: center;
}

.tool-overlay {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
}
</style>
