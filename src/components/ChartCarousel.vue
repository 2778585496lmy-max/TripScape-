<!-- 图表轮播图 -->
<template>
    <div class="chartcarousel">
        <swiper :slidesPerView="1" :spaceBetween="30" :loop="true" :pagination="{
            clickable: true,
        }" :navigation="true" :modules="modules" class="mySwiper">
            <swiper-slide>
                <Linechart />
            </swiper-slide>
            <swiper-slide>
                <Piechart />
            </swiper-slide>
            <swiper-slide>
                <Barchart />
            </swiper-slide>
            <swiper-slide>
                <city />
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import Piechart from '@/components/Piechart.vue'
import Barchart from '@/components/Barchart.vue'
import Linechart from '@/components/Linechart.vue'
import city from './city.vue'

export default {
    components: {
        Swiper,
        SwiperSlide,
        Piechart,
        Barchart,
        city,
        Linechart,
    },
    setup() {
        return {
            modules: [Navigation, Pagination, Mousewheel, Keyboard],
        }
    },
}
</script>

<style>
.chartcarousel {
    width: 100%;
    height: 100%;
}

.swiper {
    width: 100%;
    height: 100%;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #ffffff;
    /* Center slide text vertically */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.swiper-button-prev,
.swiper-button-next {
    --swiper-navigation-size: 24px;
    /* 图标大小（官方 css 变量） */
    color: #7f7f7f;
    /* 图标颜色 */
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
    color: rgb(0, 0, 0);
}
</style>
