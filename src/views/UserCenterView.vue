<script setup>
import Mytrip from '@/components/mytrip.vue';
import Navbar from '@/components/Navbar.vue';
import TravelcostTable from '@/components/TravelcostTable.vue';
import Userlinechart from '@/components/Userlinechart.vue';
import Mark from '@/components/Mark.vue';

function go(refName) {
    const el = document.querySelector(`.${refName}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => {
        window.scrollBy({ top: -60, behavior: 'auto' })
    }, 400)
}

</script>

<template>
    <Navbar />
    <!-- 侧边栏 -->
    <div class="sidebar">
        <div class="option" id="op1" @click="go('userPannel')"><ion-icon name="person-circle-outline"></ion-icon>个人信息
        </div>
        <div class="option" id="op2" @click="go('mytrip')"><ion-icon name="map-outline"></ion-icon>我的路线</div>
        <div class="option" id="op3" @click="go('mark')"><ion-icon name="bookmark-outline"></ion-icon>我的奖牌</div>
        <div class="option" id="op4" @click="go('recommend')"><ion-icon name="heart-outline"></ion-icon>我的推荐</div>
        <div class="option" id="op5" @click="go('private')"><ion-icon name="key-outline"></ion-icon>隐私</div>
        <div class="option" id="op6" @click="go('setting')"><ion-icon name="settings-outline"></ion-icon>设置</div>
        <div class="option" id="op7"><ion-icon name="diamond-outline"></ion-icon>订阅</div>
    </div>
    <div class="Setting">
        <!-- 主要内容区 -->
        <div class="userPannel">
            <div id='area1' class="area">
            </div>
            <div id='area2' class="area">
            </div>
            <div id='area3' class="area">
            </div>
            <div id='area4' class="area">
            </div>
            <div id='area5' class="area">
            </div>
            <!-- 用户头像 -->
            <div id='area6' class="area">
                <div class="userinfo">
                    <div class="avatar"></div>
                    <div class="name">User</div>
                </div>
                <div class="signature">Discover the journey, enjoy the trip!</div>
                <div class="biaoqian">
                    <div class="char1">INFP</div>
                    <div class="char1">自驾</div>
                    <div class="char1">摄影</div>
                </div>
                <div class="infocard">
                    <div class="day">
                        <div class="dayscount">
                            <ion-icon name="ribbon-outline"></ion-icon>
                            <div class="word-section" style="width: 90px; padding-right: 8px;">
                                <span style="font-size: 14px;">已加入</span>
                                <span style="font-size: 24px;font-weight: 600">1883天</span>
                            </div>

                        </div>
                        <div class="qiandao">
                            <ion-icon name="flame-outline"></ion-icon>
                            <div class="word-section" style="width: 90px; padding-right: 8px;">
                                <span style="font-size: 14px;">已签到</span>
                                <span style="font-size: 24px; font-weight: 600;">117天</span>
                            </div>

                        </div>
                    </div>
                    <div class="prime">
                        <ion-icon name="sparkles-outline"></ion-icon>
                        <div class="word-section">
                            <span>已成为会员!</span>
                            <span>2026-12-6到期</span>
                        </div>

                    </div>
                </div>
            </div>
            <!-- 用户图表 -->
            <div id='area7' class="area">
            </div>
            <div id='area8' class="area">
                <Userlinechart />
            </div>
            <!-- 用户表格 -->
            <div id='area9' class="area">
            </div>
            <div id='area10' class="area">
            </div>
            <div id='area11' class="area">
            </div>
            <div id='area12' class="area">
            </div>
            <div id='area13' class="area">
            </div>
            <div id='area14' class="area">
            </div>
            <div id='area15' class="area">
            </div>
            <div id='area16' class="area">
                <TravelcostTable />
            </div>
        </div>
        <div class="mytrip">
            <Mytrip />
        </div>
        <div class="mark">
            <Mark />
        </div>
        <div class="recommend">
            <h3>我的推荐</h3>
            <ul>
                <span><ion-icon name="heart-outline"></ion-icon>北京 ·故宫博物院</span>
                <span><ion-icon name="heart-outline"></ion-icon>上海 ·外滩夜景</span>
                <span><ion-icon name="heart-outline"></ion-icon>广州 ·珠江夜游</span>
                <span><ion-icon name="heart-outline"></ion-icon>深圳 ·欢乐谷</span>
                <span><ion-icon name="heart-outline"></ion-icon>成都 ·锦里古街</span>
                <span><ion-icon name="heart-outline"></ion-icon>重庆 ·洪崖洞</span>
                <span><ion-icon name="heart-outline"></ion-icon>西安 ·兵马俑</span>
                <span><ion-icon name="heart-outline"></ion-icon>杭州 ·西湖</span>
                <span><ion-icon name="heart-outline"></ion-icon>苏州 ·园林</span>
            </ul>
        </div>
        <div class="private">
            <h3 style="margin-top:0;">隐私设置</h3>
            <div class="case">
                <p style="line-height:1;font-size:16px;">热力图仅好友可见</p>
                <input type="checkbox" class="switch-input" id="switch1">
                <label for="switch1" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">所有人可评论</p>
                <input type="checkbox" class="switch-input" id="switch2">
                <label for="switch2" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">二步验证</p>
                <input type="checkbox" class="switch-input" id="switch3">
                <label for="switch3" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">允许通知</p>
                <input type="checkbox" class="switch-input" id="switch4">
                <label for="switch4" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">消息免打扰</p>
                <input type="checkbox" class="switch-input" id="switch5">
                <label for="switch5" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">允许数据同步</p>
                <input type="checkbox" class="switch-input" id="switch6"></input>
                <label for="switch6" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">自动续费</p>
                <input type="checkbox" class="switch-input" id="switch7"></input>
                <label for="switch7" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">保存历史记录</p>
                <input type="checkbox" class="switch-input" id="switch8"></input>
                <label for="switch8" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">始终保存路线记录</p>
                <input type="checkbox" class="switch-input" id="switch9"></input>
                <label for="switch9" class="switch-label"></label>
            </div>
            <div class="case">
                <p style="line-height:1;font-size:16px;">隐藏我的行程</p>
                <input type="checkbox" class="switch-input" id="switch10"></input>
                <label for="switch10" class="switch-label"></label>
            </div>
        </div>
        <div class="setting">
            <h3>设置</h3>
            <div class="case">
                <p style="line-height:1.8;font-size:14px;">语言</p>
            </div>
            <div class="case">
                <p style="line-height:1.8;font-size:14px;">退出登录</p>
            </div>
        </div>
    </div>
</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400 ;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap ');

.Setting {
    height: fit-content;
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 60px;
    padding-right: 145px;
    padding-left: 250px;
    padding-bottom: 10px;
    padding-top: 10px;
    background: #e0e0e0;
}

.sidebar {
    position: fixed;
    top: 60px;
    width: 250px;
    box-sizing: border-box;
    border-radius: 15px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 15px;
    padding-bottom: 80px;
}

ion-icon {
    font-size: 24px;
}

.option {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    font-size: 1em;
    margin: 5px 1px;
    padding: 8px;
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
}

.option:nth-child(7) {
    margin-top: 320px;
}

.option:hover {
    cursor: pointer;
    background-color: #eeeeeed5;
    color: black;
    border-radius: 10px;
}

.userPannel {
    height: 700px;
    display: grid;
    grid-template-columns: 200px 200px 1fr 100px;
    grid-template-rows: 150px 150px 1fr 1fr;
    gap: 15px;
    box-sizing: border-box;
    grid-template-areas:
        "a a b b"
        "a a b b"
        "c c c c"
        "c c c c"
}

.userinfo {
    display: flex;
    gap: 20px;
    justify-items: center;
    align-items: center;
    box-sizing: border-box;
}

.avatar {
    height: 50px;
    width: 50px;
    background-image: linear-gradient(45deg, #9e44ff 0%, #8b6ea5 100%);
    border: #dddddd 1px solid;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: inset 1px 2px 5px #000000;

}

.name {
    position: relative;
    font-family: 'Ubuntu', sans-serif;
    font-size: 32px;
    font-weight: 500;
}

.signature {
    margin-top: 10px;
    font-family: 'Ubuntu', sans-serif;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.signature:hover {
    color: #000000;
}

.biaoqian {
    margin-top: 10px;
    display: flex;
    gap: 20px;
    box-sizing: border-box;
}

.char1 {
    font-family: 'Noto+Sans+SC', sans-serif;
    width: 40px;
    height: 20px;
    border-radius: 15px;
    padding: 5px 5px;
    display: flex;
    justify-items: center;
    align-items: center;
    font-size: 14px;
    line-height: 14px;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
}

.char1:nth-child(1) {
    border: #6DE089 1px solid;
}

.char1:nth-child(2) {
    border: #A7BAEC 1px solid;
}

.char1:nth-child(3) {
    border: #090979 1px solid;
}

.char1:nth-child(1):hover {
    background-color: #6DE089;
    color: #fff;
    box-shadow: #6de08a54 3px 3px 3px
}

.char1:nth-child(2):hover {
    background-color: #A7BAEC;
    color: #fff;
    box-shadow: #A7BAEC54 3px 3px 3px
}

.char1:nth-child(3):hover {
    background-color: #090979;
    box-shadow: #09097954 3px 3px 3px;
    color: #fff;
}

.infocard {
    margin-top: 10px;
    height: 60%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    gap: 5px;
}

.day {
    border-radius: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;

}

.dayscount {
    background: #7AB8F7;
    border-radius: 10px;
    flex: 1;
    color: #ffffff;
    box-sizing: border-box;
    display: flex;
    justify-items: center;
    align-items: center;
    gap: 60px;
    border: #ffffff 1px solid;
    transition: all 0.3s ease-in-out;
}

.dayscount ion-icon {
    margin-left: 5px;
    font-size: 56px;
    cursor: pointer;
}

.qiandao {
    flex: 1;
    background: #64E9D0;
    border-radius: 10px;
    color: #ffffff;
    box-sizing: border-box;
    display: flex;
    justify-items: center;
    align-items: center;
    gap: 60px;
    border: #ffffff 1px solid;
    transition: all 0.3s ease-in-out;
}

.qiandao ion-icon {
    margin-left: 5px;
    font-size: 56px;
    cursor: pointer;
}

.dayscount .word-section,
.qiandao .word-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    cursor: pointer;
}

.prime {
    background: #B998E7;
    border-radius: 10px;
    flex: 1;
    color: #ffffff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    border: #ffffff 1px solid;
    transition: all 0.3s ease-in-out;
}

.prime ion-icon {
    margin-top: 5px;
    font-size: 64px;
}

.prime .word-section {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    gap: 15px;
    margin-top: 15px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

.dayscount:hover,
.qiandao:hover,
.prime:hover {
    box-shadow: 3px 5px 10px #bdbdbd;
}

.area {
    border-radius: 15px;
    background: #e0e0e0;
    box-shadow: 1px 2px 4px #d9d9d9,
        -1px -2px 4px #e7e7e7;
    border: #f1efef 1px solid;
    box-sizing: border-box;

}

#area1,
#area2,
#area5,
#area6 {
    grid-area: a;
    padding: 10px;
}

#area3,
#area4,
#area7,
#area8 {
    grid-area: b;
}

#area9,
#area10,
#area11,
#area12,
#area13,
#area14,
#area15,
#area16 {
    grid-area: c;
}

.case {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-radius: 10px;
}

.case:hover {
    background-color: #d5d5d5;
    cursor: pointer;
}

.mytrip {
    height: 700px;
    width: 100%;
    background: #94848400;
    border-radius: 15px;
}

.mark {
    height: fit-content;
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    border: #000000 1px solid;
    border-radius: 15px;
}

.recommend {
    border-radius: 15px;
    background: #e0e0e0;
    box-shadow: 1px 2px 4px #d9d9d9,
        -1px -2px 4px #e7e7e7;
    border: #f1efef 1px solid;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
}

.recommend ul {
    display: flex;
    flex-direction: column;
}

.recommend ul span {
    font-size: 16px;
    font-weight: 500;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.recommend ul span ion-icon {
    font-size: 20px;
    font-weight: 600;
    color: #ff0026;
}

.recommend ul span:hover {
    background-color: #d5d5d5;
    cursor: pointer;
}

.private {
    border-radius: 15px;
    background: #e0e0e0;
    box-shadow: 1px 2px 4px #d9d9d9,
        -1px -2px 4px #e7e7e7;
    border: #f1efef 1px solid;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
}

.setting {
    border-radius: 15px;
    background: #e0e0e0;
    box-shadow: 1px 2px 4px #d9d9d9,
        -1px -2px 4px #e7e7e7;
    border: #f1efef 1px solid;
    box-sizing: border-box;
    padding: 15px;
}

.switch-input {
    display: none;
}

.switch-label {
    display: block;
    width: 52px;
    height: 25px;
    border-radius: 15px;
    background: #eee;
    padding: 2px;
    box-sizing: border-box;
    box-shadow: 1px 1px 5px #6f6f6f3b;
    cursor: pointer;
}

.switch-label::after {
    content: '';
    display: block;
    width: 50%;
    height: 100%;
    border-radius: 12px;
    position: relative;
    left: 0;
    background: #fff;
    transition: all .3s ease-in-out;
}

.switch-input:checked+.switch-label {
    background: #83ff5d;
    box-shadow: inset 1px 1px 5px #6f6f6f3b;
}

.switch-input:checked+.switch-label::after {
    left: 50%;
}
</style>