<!-- CarouselCard.vue -->
<template>
    <!-- 轮播区域 -->
    <div class="carousel" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <!-- 第一组 -->
        <div class="group" :style="{ animationPlayState: paused ? 'paused' : 'running' }">
            <div class="card" v-for="(img, idx) in randomImages" :key="idx" @click="openDetail(img)">
                <img :src="img" alt="" />
            </div>
        </div>

        <!-- 第二组（复制） -->
        <div class="group" aria-hidden :style="{ animationPlayState: paused ? 'paused' : 'running' }">
            <div class="card" v-for="(img, idx) in randomImages" :key="'copy-' + idx" @click="openDetail(img)">
                <img :src="img" alt="" />
            </div>
        </div>
    </div>

    <!-- 详情页遮罩 -->
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="showDetail" class="mask" @click.self="closeDetail">
                <div class="detail">
                    <img :src="detailSrc" alt="detail" />
                    <button class="close" @click="closeDetail">✕</button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* 图片池 */
const allImages = [
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyytpLBw8Nwt9hh4WAdcCiWc_OhFFzQADKAAC1exhVcvNo3ma1--HNgQ.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyyxpLBxI7nPNKLJaYfOZw36j6JT3fAACASgAAtXsYVUhXNinISpVFTYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyy9pLBxZgSygXe4hKeHD7c2qTpgjIgACBCgAAtXsYVXXIzGYNrAjEzYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzBpLBxgCZX9kdt3cYLYhBMjHS5uVgACBSgAAtXsYVX2Znqm7feQ2zYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzFpLBxkCH9jffUvwhW-l8DalZsmUgACBigAAtXsYVXMsdqbMYA5yjYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzJpLBxqmgIB3YX1AAGJqRFlehIvgCwAAgcoAALV7GFVLHGwikQzFI82BA.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzRpLBxvLcLUudqNPI_Fd5uzxT4Y9QACCSgAAtXsYVXYa6lFd6SVUzYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzVpLBx05IEdEskHLdAwnR79MySqLAACCigAAtXsYVVC5TU23ml_uzYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzZpLBx6cIGFrS0PdLu_sIkciH_vqQACCygAAtXsYVUcsHmKCDaySDYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzdpLByA9sEp1aRzuZDZFuibp50HPwACDCgAAtXsYVVRPciuT_7OxTYE.jpg',
    'https://img.remit.ee/api/file/BQACAgUAAyEGAASHRsPbAAELyzhpLByGGoBdG9JC1xTrmVc0-g3IJgACDSgAAtXsYVXrVUq1JKhDVjYE.jpg'
]

const randomImages = ref([])
const paused = ref(false)
const showDetail = ref(false)
const detailSrc = ref('')

/* 随机抽 6 张 */
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)

onMounted(() => {
    randomImages.value = shuffle(allImages).slice(0, 6)
    window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
})

/* 鼠标进出 */
const onMouseEnter = () => (paused.value = true)
const onMouseLeave = () => (paused.value = false)

/* 打开/关闭详情页 */
const openDetail = src => {
    detailSrc.value = src
    showDetail.value = true
}
const closeDetail = () => {
    showDetail.value = false
    detailSrc.value = ''
}
const onKeyDown = e => {
    if (e.key === 'Escape') closeDetail()
}
</script>

<style scoped>
/*======== 轮播主体 ========*/
.carousel {
    margin: 10px auto;
    width: 90%;
    display: flex;
    overflow-x: auto;
    mask-image: linear-gradient(to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 20%,
            rgba(0, 0, 0, 1) 80%,
            rgba(0, 0, 0, 0) 100%);
    -webkit-mask-image: linear-gradient(to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 1) 20%,
            rgba(0, 0, 0, 1) 80%,
            rgba(0, 0, 0, 0) 100%);
}

.carousel::-webkit-scrollbar {
    display: none;
}

.group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    padding-right: 0.5em;
    animation: scroll 30s linear infinite;
}

.card {
    flex: 0 0 6em;
    height: 4em;
    background: #fff;
    font-size: 3rem;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
}

.card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card:hover {
    transform: scale(1.05);
}

@keyframes scroll {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

/*======== 详情页遮罩 ========*/
.mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.detail {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
}

.detail img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 0.5rem;
}

.close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: #fff;
    font-size: 18px;
    cursor: pointer;
}

/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>