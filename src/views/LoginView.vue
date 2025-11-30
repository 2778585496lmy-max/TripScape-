<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showResetPasswordAlert = () => {
    alert('不会此功能o_O')
}


onMounted(() => {
    /* --- DOM 选取 --- */
    const form = document.querySelector('.loginform .right form')
    const userInp = form.querySelector('input[type="text"]')
    const pwdInp = form.querySelector('input[type="password"]')
    const eye = form.querySelector('.password ion-icon')

    /* --- 显示/隐藏密码 --- */
    eye.addEventListener('click', () => {
        const isPwd = pwdInp.type === 'password'
        pwdInp.type = isPwd ? 'text' : 'password'
        eye.name = isPwd ? 'eye-off-outline' : 'eye-outline'
    })

    /* --- 提交拦截 --- */
    const accounts = {
        1: '1'
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const u = userInp.value.trim()
        const p = pwdInp.value.trim()

        if (!u || !p) {
            alert('请输入账号和密码')
            return
        }
        if (accounts[u] && accounts[u] === p) {
            // 登录成功，存个简单标记并跳转
            sessionStorage.setItem('uid', u)
            router.push('/map')
        } else {
            alert('账号或密码错误')
        }
    })
})
</script>

<template>
    <div class="loginpage">
        <section>
            <img src="/public/picture/Whitelogo.svg" width="100em" height="auto" alt="Logo"
                @click="$router.push('/')" style="cursor:pointer;" />
            <span>探索世界，发现旅途美景。</span>
        </section>
        <div class="loginform">
            <div class="left">
                <div class="welcomewords">
                    Log In to<br>
                    Open the World !
                </div>
                <div class="circle1"></div>
                <div class="circle2"></div>
                <div class="alertwords">
                    如果您还没有账户,请<router-link to="/signin" class="linkfont">点击这里</router-link>。
                </div>
                <div class="back">
                    <ion-icon name="arrow-back-circle" @click="$router.push('/')"></ion-icon>
                </div>
            </div>
            <div class="right">
                <form action="">
                    <p>
                        <input type="text" placeholder="请输入您的账户">
                    </p>
                    <p class="password">
                        <input type="password" placeholder="请输入您的密码">
                        <ion-icon name="eye-outline"></ion-icon>
                        <a href="#" @click="showResetPasswordAlert">找回密码</a>
                    </p>
                    <p>
                        <input type="submit" class="submit" value="登录">
                    </p>
                </form>
                <div class="options">
                    <div class="separator">
                        <p>其他登录方式</p>
                    </div>
                    <ul>
                        <li>
                            <a href="https://www.youtube.com/">
                                <ion-icon name="logo-youtube"></ion-icon>
                            </a>
                        </li>
                        <li>
                            <a href="https://weixin.qq.com/">
                                <ion-icon name="logo-wechat"></ion-icon>
                            </a>
                        </li>
                        <li>
                            <a href="https://twitter.com/">
                                <ion-icon name="logo-twitter"></ion-icon>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Noto Sans Simplified Chinese:wght@400;500;700&display=swap');

.loginpage {
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    background-image: linear-gradient(180deg, #291a6f 0%, #674ddb 50%, #cfc5fd 100%);
    background-clip: border-box;
    object-fit: contain;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1em;
    animation: bg 10s linear infinite alternate;
}

@keyframes bg {
    0% {
        background-size: 100%;
    }

    100% {
        background-size: 110%;
    }
}

section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    animation: fadeintext0 3s cubic-bezier(0.471, -0.006, 0.111, 1.407) -.3s;

    span {
        color: #ffffff;
    }
}

@keyframes fadeintext0 {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.loginform {
    box-sizing: border-box;
    width: 60%;
    height: 60%;
    backdrop-filter: blur(20px) brightness(90%);
    background-color: rgba(243, 243, 243, 0.09);
    border-radius: 10px;
    padding: 10px;
    border: 1px solid #ffffff37;
    box-shadow: .2px .2px 1px #5109d6,
        -0.1px -0.1px 1px #ffffff;
    display: flex;
    animation: fadeinform 3s cubic-bezier(0.471, -0.006, 0.111, 1.407) -1s;
}

@keyframes fadeinform {
    from {
        transform: scale(1.2);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.left {
    flex: 4;
    border-radius: 5px;
    background-color: #ffffff00;
}

.back ion-icon {
    color: #c2b6ffd2;
    font-size: 40px;
    position: relative;
    top: 10em;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
}

.back ion-icon:hover {
    color: #ffffff;
    filter: drop-shadow(0 2px 4px rgba(217, 181, 241, 0.3));

}

.circle1 {
    width: 150px;
    height: 150px;
    background-image: linear-gradient(315deg, #5900ff 0%, #0ddead 100%);
    border-radius: 50%;
    filter: blur(30px) brightness(80%);
    position: absolute;
    top: 3em;
    left: 3em;
    animation: change1 4s cubic-bezier(0.508, -0.363, 0.438, 1.289) 1s infinite alternate;
}

.circle2 {
    width: 150px;
    height: 150px;
    background-image: linear-gradient(-25deg, #c300ff 0%, #640dde 100%);
    border-radius: 50%;
    filter: blur(30px) brightness(80%);
    position: absolute;
    top: 3em;
    left: 12em;
    animation: change2 4s cubic-bezier(0.508, -0.363, 0.438, 1.289) 1s infinite alternate;
}

@keyframes change1 {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(9em);
    }
}

@keyframes change2 {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-9em);
    }
}

.welcomewords {
    color: #ffffff;
    font-family: 'Rubik', sans-serif;
    font-weight: bold;
    font-size: 2.3rem;
    z-index: 10;
    position: absolute;
    top: 2em;
    left: 2em;
    animation: fadeintext 3s cubic-bezier(0.471, -0.006, 0.111, 1.407) -.2s;
}

@keyframes fadeintext {
    from {
        transform: translateX(-50px);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.alertwords {
    color: #ffffff;
    font-family: 'Noto Sans Simplified Chinese', sans-serif;
    font-size: 1rem;
    position: absolute;
    top: 20em;
    left: 5em;
    animation: fadeintext2 3s cubic-bezier(0.471, -0.006, 0.111, 1.407);
}

@keyframes fadeintext2 {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.linkfont {
    color: #ffffff;
    font-weight: 700;
    font-family: 'Noto Sans Simplified Chinese', sans-serif;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
}

.linkfont:hover {
    color: #0088ff;
    text-decoration: underline;
}

.right {
    flex: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
}

.right form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.main form p {
    position: relative;
}

form input {
    font: inherit;
    font-size: 14px;
    width: 100%;
    border: 0;
    outline: 0;
    padding: 0 10px;
    line-height: 40px;
    border-radius: 5px;
    animation: fadein 3s cubic-bezier(0.471, -0.006, 0.111, 1.407);
    caret-color: #fff;
    color: #fff;
}

@keyframes fadein {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

input::placeholder {
    color: #ffffff82;
    font-family: 'Noto Sans Simplified Chinese', sans-serif;
    font-size: inherit;
}

form input:not(.submit) {
    background-color: #2c264855;
}

form .password ion-icon {
    position: absolute;
    top: calc(310px/2);
    right: 72px;
    margin-top: 1px;
    line-height: 1;
    color: #9c9c9c;
    cursor: pointer;
    animation: fadein 3s cubic-bezier(0.471, -0.006, 0.111, 1.407);
    font-size: 16px;
}

form .password ion-icon:hover {
    color: #fff;
}

form .password a {
    font-size: 13px;
    color: #e4e4e4dc;
    float: right;
    margin: 10px 10px 0 0;
    text-decoration: none;
    animation: fadein 3s cubic-bezier(0.471, -0.006, 0.111, 1.407);
}

form .password a:hover {
    color: #e4e4e4dc;
    text-decoration: underline;
}

form input.submit {
    font-family: 'Noto Sans Simplified Chinese', sans-serif;
    font-weight: 700;
    color: #ffffff;
    background-image: linear-gradient(315deg, #3c00ff 0%, #515fff 100%);
    box-shadow: #3131317a 0 20px 30px -10px;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
}

form input.submit:hover {
    box-shadow: #8686867a 5px 5px 15px -3px;
}

.separator {
    position: relative;
    margin: 20px 0 20px;
    animation: fadein1 3s cubic-bezier(0.471, -0.006, 0.111, 1.407) -.1s;
}

.separator p {
    font-size: 14px;
    width: fit-content;
    padding: 0 70px;
    color: #ffffff;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.options ul {
    display: flex;
    justify-content: center;
    gap: 25px;
    list-style: none;
    animation: fadein1 3s cubic-bezier(0.471, -0.006, 0.111, 1.407);
}

@keyframes fadein1 {
    from {
        transform: translateY(40px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}


.options ul li a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background-color: #e0d1f82b;
    border: 0.1em solid #ffffff6d;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.options ul li a:hover {
    border: 0.1em solid #ffffffd4;
    box-shadow: 1px 2px 5px -1px #ffffffc6;
}

.options ul li ion-icon {
    font-size: 24px;
    color: #ffffff;
    transition: all 0.3s ease-in-out;
}

li:nth-child(1) a:hover ion-icon {
    color: #ff0000;
}

li:nth-child(2) a:hover ion-icon {
    color: #4CAF50;
}

li:nth-child(3) a:hover ion-icon {
    color: #2196F3;
}
</style>