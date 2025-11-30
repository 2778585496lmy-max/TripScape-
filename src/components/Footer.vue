<script setup>

</script>

<template>
    <footer class="site-footer">
        <div class="footer-main">
            <section class="footer-logo">
                <img src="/public/picture/Whitelogo.svg"  alt="TripScape" @click="$router.push('/')" style="cursor:pointer;"/>
                <p>探索世界，从这里开始。</p>
            </section>

            <section class="footer-links">
                <h4>快速链接</h4>
                <ul>
                    <li><router-link to="/map">地图浏览</router-link></li>
                    <li><router-link to="/route">路线选择</router-link></li>
                    <li><router-link to="/spot">景点推荐</router-link></li>
                    <li><router-link to="/about">关于我们</router-link></li>
                </ul>
            </section>

            <section class="footer-social">
                <h4>关注我们</h4>
                <div class="social-icons">
                    <a href="https://twitter.com/" aria-label="Twitter"><ion-icon name="logo-twitter"></ion-icon></a>
                    <a href="https://github.com/" aria-label="Github"><ion-icon name="logo-github"></ion-icon></a>
                    <a href="https://www.youtube.com/" aria-label="Youtube"><ion-icon name="logo-youtube"></ion-icon></a>
                    <a href="https://weixin.qq.com/" aria-label="微信"><ion-icon name="logo-wechat"></ion-icon></a>
                </div>
            </section>
        </div>

        <div class="footer-bottom">
            <p>© 2025 TripScape. All rights reserved. | <a href="https://www.baidu.com">关于</a> <a href="https://www.baidu.com">隐私</a></p>
        </div>
    </footer>
</template>

<style scoped>

.site-footer {
    width: 100%;
    background: #1b1f23;
    color: #c9c9c9;
    padding: 1.2rem 1rem;
    margin-top: auto; 
    /* 粘性页脚：把内容顶上去 */
}

.footer-main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-main h4 {
    margin-bottom: 0.8rem;
    color: #fff;
    font-size: 1rem;
}

.footer-main ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
}

.footer-main li {
    margin: 0.4rem 0;
}

.footer-main a {
    color: #c9c9c9;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-main a:hover {
    color: #fff;
}

.footer-logo img {
    height: 72px;
    width: auto;
    margin-bottom: 0.6rem;
}

.social-icons {
    display: flex;
    gap: 0.8rem;
    justify-items: center;
    align-items: center;
}

.social-icons a {
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 40px;
    text-align: center;
    background: #333;
    border-radius: 50%;
    transition: background 0.3s;
}

.social-icons a:nth-child(1):hover {
    background: #0099ff;
}
.social-icons a:nth-child(2):hover {
    background: #000000;
}
.social-icons a:nth-child(3):hover {
    background: #ff0000;
}
.social-icons a:nth-child(4):hover {
    background: #0cf000;
}

.footer-bottom {
    text-align: center;
    margin-top: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid #333;
    font-size: 0.875rem;
}
.footer-bottom a {
    color: #c9c9c9;
    text-decoration: none;
    margin: 0 0.5rem;
}
.footer-bottom a:hover {
    text-decoration: underline;
    color: #fff;
}
ion-icon {
    font-size: 20px;
}

</style>