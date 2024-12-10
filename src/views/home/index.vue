<template>
    <div class="home">
        <Top></Top>
        <Mid></Mid>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Home',
}
</script>
<script lang="ts" setup>
import { onMounted } from 'vue';
import Top from '@/views/home/TopChart/index.vue'
import Mid from '@/views/home/MidChart/index.vue'
onMounted(() => {

})
// 获取用户信息

</script>

<style scoped>
.home {
    width: 100%;
    height: 100%;
    font-size: 30px;
}
</style>
