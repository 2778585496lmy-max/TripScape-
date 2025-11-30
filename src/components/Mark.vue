<script setup>

</script>

<template>
    <h3 style="margin-left: 15px;">我的奖牌</h3>
    <div class="markarea">
        <div class="card">
            <div class="card_title">初来乍到</div>
            <div class="medal_logo"></div>
            <div class="explanatory_note">注册成功后首次登录！</div>
            <div class="get_time">2023-06-01</div>
            <div class="detail">已获得该奖牌!</div>
        </div>
        <div class="card">
            <div class="card_title">城市猎人</div>
            <div class="medal_logo"></div>
            <div class="explanatory_note">游玩超过10个城市！</div>
            <div class="get_time">2024-11-26</div>
            <div class="detail">已获得该奖牌!</div>
        </div>
        <div class="card">
            <div class="card_title">早起鸟儿</div>
            <div class="medal_logo"></div>
            <div class="explanatory_note">连续21天早上9:00前打卡！</div>
            <div class="get_time">2023-06-22</div>
            <div class="detail">已获得该奖牌!</div>
        </div>
        <div class="card">
            <div class="card_title">夜行者</div>
            <div class="medal_logo"></div>
            <div class="explanatory_note">晚上10点后打卡50次！</div>
            <div class="get_time">2024-3-11</div>
            <div class="detail">已获得该奖牌!</div>
        </div>
        <div class="card">
            <div class="card_title">当地通</div>
            <div class="medal_logo"></div>
            <div class="explanatory_note">拍摄某城市照片超300张！</div>
            <div class="get_time">2024-05-03</div>
            <div class="detail">已获得该奖牌!</div>
        </div>
        <div class="card">
            <div class="card_title">传奇旅人</div>
            <div class="medal_logo"></div>
            <div class="explanatory_note">累计飞行里程超10万公里！</div>
            <div class="get_time">2025-8-26</div>
            <div class="detail">已获得该奖牌!</div>
        </div>

    </div>
</template>

<style scoped>
.markarea {
    padding: 5px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    row-gap: 30px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    flex-wrap: wrap;
}

.card {
    width: 200px;
    height: fit-content;
    border-radius: 15px;
    background-color: #ffffff00;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    cursor: pointer;
}

.card_title {
    font-size: 20px;
    font-weight: bold;
    font-family: 'HarmonyOS Sans SC', sans-serif;
}

.medal_logo {
    width: 100px;
    height: 100px;
    background-color: #ffffff00;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.explanatory_note {
    font-size: 16px;
    color: #7d7d7d;
    text-align: center;
    font-weight: 400;
    font-family: 'HarmonyOS Sans SC', sans-serif;
}

.get_time {
    font-size: 14px;
    color: #999;
    font-weight: 300;
    font-family: 'HarmonyOS Sans SC', sans-serif;
}

.detail {
    font-weight: bold;
    color: #616161;
}
</style>