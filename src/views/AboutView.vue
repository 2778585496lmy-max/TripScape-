<script setup>
import videofile from '@/assets/aboutvideo2.mp4';

const links = [
    { to: '/map', label: '地图浏览' },
    { to: '/route', label: '路线选择' },
    { to: '/spot', label: '景点推荐' },
    { to: '/setting', label: '设置' },
    { to: '/about', label: '关于' },
]
</script>

<template>
    <section class="about">
        <video ref="v0" autoplay muted loop playsinline disablepictureinpicture disableremoteplayback preload="auto">
            <source :src="videofile" type="video/mp4" />
        </video>

        <div class="overlay">
            <header class="hero">
                <img class="hero__logo" src="/picture/Blacklogo.svg" alt="TripScape Logo" @click="$router.push('/')" />
                <p class="hero__chinese">探索世界，发现旅途美景。</p>
                <p class="hero__english">
                    Explore the world
                    <span>and</span>
                    discover the beauty along the journey.
                </p>
            </header>
        </div>
                    <nav class="quick-links">
                <router-link v-for="link in links" :key="link.to" :to="link.to">
                    {{ link.label }}
                </router-link>
            </nav>
    </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@200;400;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@200;400;600&display=swap');

.about {
    position: relative;
    width: 100%;
    min-height: 100vh;
    color: #0f1218;
    display: flex;
    flex-direction: column;;
}

.about video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.overlay {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 120px 80px;
    display: flex;
    flex-direction: column;
    gap: 100px;
}

.hero {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.hero__logo {
    width: clamp(100px, 12vw, 140px);
    cursor: pointer;
    transition: transform 0.3s ease;
}

.hero__logo:hover {
    transform: translateY(-3px);
}

.hero__chinese {
    font-size: clamp(24px, 4vw, 34px);
    font-weight: 200;
    margin: 0;
    color: #2d323f;
    font-family: 'HarmonyOS', sans-serif;
}

.hero__chinese::after {
    content: '';
    display: block;
    width: 240px;
    height: 2px;
    position: relative;
    top: 13px;
    margin-left: 2px;
    background: #000;
}

.hero__english {
    font-size: clamp(28px, 5vw, 40px);
    font-weight: 400;
    line-height: 1.3;
    margin: 0;
    font-family: "Ubuntu", sans-serif;
}

.hero__english span {
    font-weight: 600;
    color: #1b4ed8;
}

.quick-links {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 28px;
    padding: 10px;
    font-family: "Noto Sans SC", sans-serif;
    margin-top: -76px;
    margin-left: 70px;
    z-index: 3;
}

.quick-links a {
    color: #e1e1e1;
    text-decoration: none;
    font-weight: 300;
    position: relative;
    padding-bottom: 4px;
    transition: color 0.3s ease;
}

.quick-links a::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0;
    height: 2px;
    background: currentColor;
    transform: translateX(-50%);
    transition: width 0.35s ease;
}

.quick-links a:hover {
    color: #ffffff;
    font-weight: 400;
}

.quick-links a:hover::after {
    width: 100%;
}

</style>