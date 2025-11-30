<script></script>

<template>
    <div class="navigation">
        <img src="/public/picture/Whitelogo.svg" width="7%" height="auto" alt="Logo" @click="$router.push('/')"
            style="cursor:pointer;" />
        <ul class="nav-links">
            <li><router-link to="/map">地图浏览</router-link></li>
            <li><router-link to="/route">路线选择</router-link></li>
            <li><router-link to="/spot">景点推荐</router-link></li>
            <li><router-link to="/setting">设置</router-link></li>
            <li><router-link to="/about">关于</router-link></li>
        </ul>
        <div class="nav-btn">
            <button class="out-btn" @click="$router.push('/')">
                <ion-icon name="exit-outline"></ion-icon><span>退出</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.navigation {
    width: 100%;
    height: 60px;
    background: linear-gradient(3155deg, #2f2f2f 0%, #000000 100%);
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 1rem 5%;
    color: #bfbfbf;
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    box-shadow: 0 2px 10px rgba(186, 188, 208, 0.1);

}

.img {
    cursor: pointer;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin-left: 1.8rem;
    flex-grow: 1;
}

.nav-links li a {
    color: #eeeeeeb0;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.nav-links li a:hover {
    text-decoration: none;
    color: #ffffff;
}

.nav-links li a {
    position: relative;
    color: #eeeeeeb0;
    text-decoration: none;
    font-weight: 500;
    transition: all .3s ease;
}

.nav-links li a::after {
    content: '';
    position: absolute;
    left: 50%;
    /* 关键：先放到中线 */
    bottom: -5px;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #fff, #bfbfbf);
    transform: translateX(-50%);
    /* 保证中线对齐 */
    transition: width 1s linear(0, 0.453 7.8%, 0.803 16.1%, 1.048 24.9%, 1.132 29.5%, 1.194 34.4%, 1.227 38.4%, 1.245 42.5%, 1.25 46.9%, 1.242 51.7%, 1.2 60.5%, 1.038 84.9%, 1.009 92.5%, 1);
}

.nav-links li a:hover::after {
    width: 100%;
    /* 悬停时撑满父级 */
}

/* 1. 按钮基础 */
.out-btn {
    position: relative;
    overflow: hidden;
    /* 关键：隐藏圆外的部分 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    background: transparent;
    border: 1px solid #ffffffb0;
    color: #ffffffb0;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    cursor: pointer;
    transition: color .4s ease;
}

/* 2. 圆形放大层 */
.out-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    padding-bottom: 0;
    /* 用 padding 撑出正方形 */
    border-radius: 50%;
    /* 正圆 */
    background: #fff;
    transform: translate(-50%, -50%);
    transition: width 3s linear(0, 0.453 7.8%, 0.803 16.1%, 1.048 24.9%, 1.132 29.5%, 1.194 34.4%, 1.227 38.4%, 1.245 42.5%, 1.25 46.9%, 1.242 51.7%, 1.2 60.5%, 1.038 84.9%, 1.009 92.5%, 1), padding-bottom 3s linear(0, 0.453 7.8%, 0.803 16.1%, 1.048 24.9%, 1.132 29.5%, 1.194 34.4%, 1.227 38.4%, 1.245 42.5%, 1.25 46.9%, 1.242 51.7%, 1.2 60.5%, 1.038 84.9%, 1.009 92.5%, 1);
    z-index: 0;
}

/* 3. 文字/图标在上层 */
.out-btn span,
.out-btn ion-icon {
    position: relative;
    z-index: 1;
}

ion-icon {
    font-size: 1.2rem;
    margin-right: 0.5rem;
}

/* 4. 悬停：圆形放大到覆盖整个按钮 */
.out-btn:hover::before {
    width: 200%;
    /* 足够大即可 */
    padding-bottom: 200%;
    /* 保持 1:1 正圆 */
}

.out-btn:hover {
    color: #252525;
}
</style>