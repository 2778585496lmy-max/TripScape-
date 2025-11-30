<template>
    <div class="card" @click="goToDetail">
        <div class="image-wrapper">
            <img :src="attraction.image" :alt="attraction.name" class="image">
            <span class="category-tag">{{ attraction.category }}</span>
        </div>

        <div class="content">
            <h3 class="title">{{ attraction.name }}</h3>
            <p class="description">{{ attraction.description }}</p>

            <div class="footer">
                <div class="rating">
                    <span class="star">★</span>
                    <span class="score">{{ attraction.rating }}</span>
                </div>
                <div class="price">
                    <span v-if="attraction.price === 0" class="free">免费</span>
                    <span v-else>¥{{ attraction.price }}起</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    attraction: {
        type: Object,
        required: true
    }
});

const goToDetail = () => {
    console.log(`跳转到景点详情: ${props.attraction.name}`);
    // 实际项目: router.push(`/attraction/${props.attraction.id}`)
};
</script>

<style scoped>
.card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.card:hover .image {
    transform: scale(1.05);
}

.category-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #2c3e50;
    font-weight: 500;
}

.content {
    padding: 1.5rem;
}

.title {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    color: #2c3e50;
    font-weight: 600;
}

.description {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
    height: 40px;
    overflow: hidden;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
}

.rating .star {
    color: #ffd700;
    margin-right: 4px;
}

.score {
    font-weight: 600;
    color: #2c3e50;
}

.price {
    font-size: 1.1rem;
    color: #ff6b6b;
    font-weight: 600;
}

.price .free {
    color: #4caf50;
}
</style>