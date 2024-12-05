<template>
  <div class="navbar">
    <hamburger :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-dropdown" trigger="hover">
        <div class="avatar-wrapper">
          <img v-if="userInfoStore.avatar" :src="userInfoStore.avatar" class="user-avatar">
          <div class="user-name">{{ userInfoStore.name }}</div>
          <ele-ArrowRight class="el-icon-caret-bottom"></ele-ArrowRight>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="logout">
              <span style="display:block;">退出登陆</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Navbar'
}
</script>

<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { useAppStore } from '@/stores/app';
import { useUserInfoStore } from '@/stores/userInfo';
import { useRoute, useRouter } from 'vue-router';

const appStore = useAppStore()
const userInfoStore = useUserInfoStore()
const router = useRouter()
const route = useRoute()

const toggleSideBar = () => {
  appStore.toggleSidebar()
}

const logout = async () => {
  await userInfoStore.reset()
  router.push(`/login?redirect=${route.fullPath}`)
}

</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 64px;

    &:focus {
      outline: none;
    }

    .avatar-dropdown {
      margin-top: 5px;

      .avatar-wrapper {
        width: 160px;
        position: relative;
        top: -7px;
        right: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;

        &:hover {
          transition-duration: 1s;
          background-color: #e9e9e9;
          cursor: pointer;
          >:nth-child(3){
            transition: transform 0.5s ease;
            transform:rotate(90deg);
          }
        }
        .user-avatar {
          padding: 4px;
          width: 50px;
          height: 50px;
          border-radius: 25px;
        }

        .user-name {
          text-align: center;
          white-space: nowrap;
          overflow: hidden; 
          text-overflow: ellipsis;
          max-width: 140px;
          font-weight: 500;
          font-size: 15px;
        }

        .el-icon-caret-bottom {
          width: 16px;
        }
      }
    }

  }
}
::deep(.el-popper){
  padding: 30px!important;
}
</style>
