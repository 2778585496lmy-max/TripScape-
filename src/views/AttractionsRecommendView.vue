<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import Carousel from '@/components/Carousel.vue';
import Carousel2 from '@/components/Carousel2.vue';

</script>

<template>
    <Navbar />
    <div class="attraction">
        <Carousel />
        <Carousel2 />
        <Carousel />
        <Carousel2 />
    </div>
    <Footer />
</template>

<style scoped>
.attraction {
    height: 100%;
    width: 100%;
    padding-top: 60px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    font-size: 2rem;
    background-image: linear-gradient(315deg, #fff 0%, #f0f8ff 100%);
}
</style>
