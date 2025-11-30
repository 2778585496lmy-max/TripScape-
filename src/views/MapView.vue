<!-- MapView.vue  最终合并版（含代码2 补充） -->
<template>
    <Navbar />
    <div class="container">
        <div class="grid">
            <!-- 地图：同时接收 6 组参数 -->
            <div id="grid1" class="grid-item">
                <Map ref="mapRef" :show-heat="showHeat" :show-scatter="showScatter" :jump-target="jumpTarget"
                    :base-map-type="activeBaseMap" :measure-type="activeMeasureType" :selected-spot="selectedSpot"
                    :filtered-spots="filteredSpots" />
            </div>

            <!-- 其余格子保持原样 -->
            <div id="grid2" class="grid-item">1</div>
            <div id="grid3" class="grid-item">
                <div class="search-section">
                    <h3>景点搜索</h3>
                    <Search @spotSelected="handleSpotSelected" />
                </div>
                <!-- 第二行：筛选框 -->
                <div class="filter-section">
                    <div class="filter-group">
                        <h3>地区筛选</h3>
                        <select v-model="selectedProvince" class="filter-select" @change="handleProvinceChange">
                            <option value="">选择省份</option>
                            <option value="北京市">北京市</option>
                            <option value="天津市">天津市</option>
                            <option value="河北省">河北省</option>
                            <option value="山西省">山西省</option>
                            <option value="内蒙古自治区">内蒙古自治区</option>
                            <option value="辽宁省">辽宁省</option>
                            <option value="吉林省">吉林省</option>
                            <option value="黑龙江省">黑龙江省</option>
                            <option value="上海市">上海市</option>
                            <option value="江苏省">江苏省</option>
                            <option value="浙江省">浙江省</option>
                            <option value="安徽省">安徽省</option>
                            <option value="福建省">福建省</option>
                            <option value="江西省">江西省</option>
                            <option value="山东省">山东省</option>
                            <option value="河南省">河南省</option>
                            <option value="湖北省">湖北省</option>
                            <option value="湖南省">湖南省</option>
                            <option value="广东省">广东省</option>
                            <option value="广西壮族自治区">广西壮族自治区</option>
                            <option value="海南省">海南省</option>
                            <option value="重庆市">重庆市</option>
                            <option value="四川省">四川省</option>
                            <option value="贵州省">贵州省</option>
                            <option value="云南省">云南省</option>
                            <option value="西藏自治区">西藏自治区</option>
                            <option value="陕西省">陕西省</option>
                            <option value="甘肃省">甘肃省</option>
                            <option value="青海省">青海省</option>
                            <option value="宁夏回族自治区">宁夏回族自治区</option>
                            <option value="新疆维吾尔自治区">新疆维吾尔自治区</option>
                            <option value="台湾省">台湾省</option>
                            <option value="香港特别行政区">香港特别行政区</option>
                            <option value="澳门特别行政区">澳门特别行政区</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <h3>景区等级</h3>
                        <select v-model="selectedLevel" class="filter-select" @change="handleLevelChange">
                            <option value="">选择等级</option>
                            <option value="1A">1A景区</option>
                            <option value="2A">2A景区</option>
                            <option value="3A">3A景区</option>
                            <option value="4A">4A景区</option>
                            <option value="5A">5A景区</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="grid4" class="grid-item">3</div>
            <div id="grid5" class="grid-item">4</div>
            <div id="grid6" class="grid-item">5</div>
            <div id="grid7" class="grid-item">6</div>
            <div id="grid8" class="grid-item">7</div>
            <div id="grid9" class="grid-item">8</div>

            <!-- 操作栏：发射 4 个事件 -->
            <div id="grid10" class="grid-item">
                <Operation @toggle-heat="showHeat = !showHeat" @toggle-scatter="showScatter = !showScatter"
                    @change-base-map="handleBaseMapChange" @start-measure="handleMeasureChange" />
            </div>

            <!-- 热门榜单：继续提供跳转 -->
            <div id="grid11" class="grid-item">
                <Popular api-url="http://localhost:3001/api/popular-attractions" @jump="handleJump" />
            </div>

            <div id="grid12" class="grid-item">
                <ChartCarousel />
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
/* ----------  组件引入 ---------- */
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ChartCarousel from '@/components/ChartCarousel.vue'
import Map from '@/components/Map.vue'
import Operation from '@/components/Operation.vue'
import Search from '@/components/Search.vue'
import Popular from '@/components/Popular.vue'

/*+++ 代码2 新增 +++*/
import { loadExcelData } from '@/utils/excelLoader'
/*----------  响应式 & 生命周期  ----------*/
import { ref, onMounted } from 'vue'

/* ---------- 原有开关 ---------- */
const showHeat = ref(false)
const showScatter = ref(false)
const jumpTarget = ref(null)

/*+++ 代码2 新增 +++*/
const mapRef = ref(null)
const selectedSpot = ref(null)
const filteredSpots = ref([])
const selectedProvince = ref('')
const selectedLevel = ref('')
const allSpots = ref([])

/*+++ 代码4 新增：底图 & 测量 +++*/
const activeBaseMap = ref('vector')        // 默认矢量底图
const activeMeasureType = ref(null)            // 默认无测量

/*================================================*
 *  逻辑函数
 *================================================*/
/* ---------- 事件处理 ---------- */
/* 热门跳转（代码3 功能） */
function handleJump(payload) {
    jumpTarget.value = payload
}

/* 底图切换（代码4 功能） */
function handleBaseMapChange(type) {
    console.log('切换底图为:', type)
    activeBaseMap.value = type
}

/* 测量工具（代码4 功能） */
function handleMeasureChange(type) {
    console.log('使用测量工具:', type)
    activeMeasureType.value = type
}

/*+++ 代码2 新增：搜索/筛选相关 +++*/
// 加载所有景点数据
const loadAllSpots = async () => {
    try {
        allSpots.value = await loadExcelData('public/A级景区.xlsx')
        console.log('加载景区数据成功:', allSpots.value.length, '条')
    } catch (error) {
        console.error('加载景区数据失败:', error)
    }
}

// 处理选中的景区
const handleSpotSelected = (spot) => {
    selectedSpot.value = spot
    console.log('选中的景区:', spot)

    // 调用地图组件的跳转方法
    if (mapRef.value && mapRef.value.flyToSpot) {
        mapRef.value.flyToSpot(spot)
    }
}

// 统一筛选入口
const handleFilterChange = () => {
    let filtered = allSpots.value

    if (selectedProvince.value) {
        filtered = filtered.filter((spot) => spot.地区 && spot.地区.includes(selectedProvince.value))
    }

    if (selectedLevel.value) {
        filtered = filtered.filter(
            (spot) => spot.景区等级 && spot.景区等级.includes(selectedLevel.value),
        )
    }

    filteredSpots.value = filtered
    console.log('筛选结果:', filtered.length, '个景点')
}

// 省份选择变化
const handleProvinceChange = () => {
    handleFilterChange()
}

// 等级选择变化
const handleLevelChange = () => {
    handleFilterChange()
}

onMounted(() => {
    loadAllSpots()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap ');

.container {
    display: flex;
    justify-content: center;
    margin-top: 60px;
    background: #ffffff;
}

/* 3×3 网格布局 */
.grid {
    display: grid;
    grid-template-rows: 1fr 1fr 2fr 1fr;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    height: 92vh;
    padding: 5px;
    box-sizing: border-box;
    grid-template-areas:
        "a a b"
        "a a c"
        "a a c"
        "d e c";
}

#grid3 {
    justify-content: left;
    align-items: start;
    padding-top: 10px;
    padding-left: 5px;
}

/* 每个格子样式 */
.grid-item {
    background: #e0e0e0;
    border: #b0b0b0 0.05rem solid;
    box-sizing: border-box;
    border-radius: 15px;
    background-color: rgb(255, 255, 255);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Noto Sans SC", sans-serif;
}

#grid1,
#grid2,
#grid4,
#grid5,
#grid7,
#grid8 {
    grid-area: a;
}

#grid3 {
    grid-area: b;
}

#grid6,
#grid9,
#grid12 {
    grid-area: c;
}

#grid10 {
    grid-area: d;
}

#grid11 {
    grid-area: e;
}

/*================================================*
 *  代码2 新增：搜索/筛选区域细化样式
 *================================================*/
#grid3 {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 15px;
    overflow: visible;
}

.control-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    /* 搜索框和筛选框之间的间距 */
}

/* 搜索区域 */
.search-section {
    width: 100%;
    flex: 1;
}

.search-section h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

/* 筛选区域（横向并列） */
.filter-section {
    width: 100%;
    display: flex;
    gap: 10px;
    /* 两个筛选框之间的间距 */
    align-items: flex-start;
}

.filter-group {
    flex: 1;
    /* 两个筛选框平均分配宽度 */
    display: flex;
    flex-direction: column;
}

.filter-group h3 {
    margin: 0 0 6px 0;
    font-size: 13px;
    color: #333;
    font-weight: 500;
    white-space: nowrap;
}

.filter-select {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 13px;
    background-color: white;
    cursor: pointer;
}

.filter-select:focus {
    outline: none;
    border-color: #409eff;
}

/* 移除不需要的样式 */
.search-overlay {
    display: none;
}
</style>