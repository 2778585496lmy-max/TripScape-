<script setup>
import TopNav from '@/components/TopNav.vue';

</script>

<template>
  <TopNav />
  <div class="home">
    <img src="/public/picture/homeimg.png" alt="背景图" class="bg-img" />
    <div class="home-main">
      <img src='/public/picture/Whitelogo.svg' width="25%" height="auto" class="img1" alt="TripScape">
      <span>探索世界，发现旅途美景。</span>
      <span class="span2">Explore the world and discover the beauty along the journey.</span>
      <div class="main-btns">
        <button class="main-btn" @click="$router.push('/map')">开始旅程</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap');

.home {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  font-family: "Noto Sans SC", sans-serif;
}

.bg-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -1;
}


.img1 {
  position: relative;
  top: -110px;
  margin-left: auto;
  margin-bottom: -90px;
  cursor: pointer;
  animation: fadeInImage 3s cubic-bezier(0.471, -0.006, 0.111, 1.407);
}

@keyframes fadeInImage {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.home-main {
  text-align: center;
  margin-top: -20px;
  font-size: 2rem;
  color: #ffffff;
  font-weight: bold;
  font-family: "Noto Sans SC", sans-serif;
}

.home-main span {
  display: block;
  position: relative;
  margin-bottom: 20px;
  margin-left: auto;
  animation: fadeInText 3s cubic-bezier(0.471, -0.006, 0.111, 1.407);
}

.span2 {
  font-size: 1.1rem;
  margin-top: -15px;
  font-family: 'Ubuntu', sans-serif;
  color: #ffffff;
}

@keyframes fadeInText {
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-btns {
  margin-top: 30px;
}

.main-btn {
  background-color: #ffffff;
  color: #000;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  animation: fadeInButton 3s cubic-bezier(0.471, -0.006, 0.111, 1.407)
}

.main-btn:hover {
  background-color: #25252500;
  color: #ffffff;
  border: 1px solid #ffffff;
  transform: scale(1.1);

}

@keyframes fadeInButton {
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(60px);
  }
}
</style>
