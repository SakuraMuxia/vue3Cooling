<template>
  <div class="home">
    Hello, {{userInfoStore.name}}
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import { useUserInfoStore } from '@/stores/userInfo';
import { onMounted } from 'vue';
const userInfoStore = useUserInfoStore()
onMounted(()=>{

})
// 获取用户信息
const getUserInfo =async () =>{
  const result = await userInfoStore.getInfo()
  console.log(result)
}
</script>

<style scoped>
  .home {
    width: 100%;
    height: 100%;
    padding: 20px;
    font-size: 30px;
  }
</style>
