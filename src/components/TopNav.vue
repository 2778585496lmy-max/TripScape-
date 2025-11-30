<template>
    <nav class="navigation">
        <img class="nav-logo" src="/public/picture/Whitelogo.svg" alt="Logo" @click="goHome" />
        <ul class="nav-links">
            <li v-for="link in navLinks" :key="link.to">
                <router-link :to="link.to">{{ link.label }}</router-link>
            </li>
        </ul>
        <div class="nav-btn">
            <button class="nav-btn__login" @click="goLogin"><span>登录</span></button>
            <button class="nav-btn__signup" @click="goSignup"><span>注册</span></button>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navLinks = [
    { to: '/map', label: '地图浏览' },
    { to: '/route', label: '路线选择' },
    { to: '/spot', label: '景点推荐' },
    { to: '/setting', label: '设置' },
    { to: '/about', label: '关于' },
]

const goHome = () => router.push('/')
const goLogin = () => router.push('/login')
const goSignup = () => router.push('/signin')
</script>

<style scoped>
.navigation {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem 5%;
    color: #bfbfbf;
    position: fixed;
    inset: 0 auto auto 0;
    z-index: 1000;
    background: rgba(50, 99, 148, 0);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(15px);
    animation: fadein 1s ease;
}

@keyframes fadein {
    from {
        opacity: 0;
        transform: translateY(-40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.nav-logo {
    width: 7%;
    min-width: 80px;
    height: auto;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.nav-logo:hover {
    transform: translateY(-2px);
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin-left: 2rem;
    flex-grow: 1;
}

.nav-links a {
    position: relative;
    color: #eeeeeeb0;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #fff, #bfbfbf);
    transform: translateX(-50%);
    transition: width 0.4s ease;
}

.nav-links a:hover {
    color: #ffffff;
}

.nav-links a:hover::after {
    width: 100%;
}

.nav-btn {
    display: flex;
    gap: 10px;

}

.nav-btn button {
    background: transparent;
    border: 1px solid #eeeeeeb0;
    color: #000000b0;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: color 0.35s ease;
}

.nav-btn button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 50%, #ffffff 50%);
    background-size: 200% 200%;
    background-position: 100% 100%;
    transition: background-position 0.45s ease;
    z-index: 0;
}

.nav-btn button span {
    position: relative;
    z-index: 1;
}

.nav-btn button:hover::before {
    background-position: 0 0;
}

.nav-btn__login {
    color: rgba(30, 30, 30, 0.7);
}

.nav-btn__login:hover {
    color: #f1f1f1;
}

.nav-btn__signup:hover {
    color: #f1f1f1;
}
</style>