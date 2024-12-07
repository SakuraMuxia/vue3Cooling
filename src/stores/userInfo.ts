import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import { staticRoutes,arbitraryRoutes } from '@/router/routes'
import { reqUserInfo, reqUserLogin } from '@/api/user'
import { storage } from '@/utils/storage-utils';
//引入路由器
import router from '@/router';
import { ConvertToRoute } from '@/utils/route-utils';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

    state: (): UserInfoState => ({
        token: getToken() as string,
        id:storage.getItem('id') as string,
        nickName:storage.getItem('nickName') as string,
        mobile:storage.getItem('mobile') as string,
        orgId:storage.getItem('orgId') as string,
        avatar: storage.getItem('avatar') as string,
        roles:storage.getItem('roles') as string,
        menuRoutes: [],
        syncRoutes:[],
        name: '',
    }),

    actions: {
        // 登陆方法
        async login(username: string, password: string, code: string,key:string) {
            const data = {
                username,
                password,
                code,
                key
            }
            const res: any = await reqUserLogin(data)
            // 获取用户token
            this.token = res.userInfo.token
            // 获取昵称
            this.nickName = res.userInfo.user.nickName
            // 获取用户id
            this.id = res.userInfo.user.id
            // 获取用户组织id
            this.orgId = res.userInfo.user.orgId
            // 获取用户角色名
            this.roles = res.userInfo.user.roles
            // 获取用户手机号
            this.mobile = res.userInfo.user.mobile
            // 获取头像
            this.avatar = res.userInfo.user.avatar ? res.userInfo.user.avatar : "https://2216847528.oss-cn-beijing.aliyuncs.com/asset/avatar..png"
            // 存储token
            setToken(res.userInfo.token)
            // 存储其他信息
            storage.setItem('id',this.id as string)
            storage.setItem('orgId',this.orgId as string)
            storage.setItem('roles',this.roles)
            storage.setItem('mobile',this.mobile as string)
            storage.setItem('avatar',this.avatar as string)
            // 把对象转为json字符串，存储菜单信息
            storage.setItem('menus',JSON.stringify(res.userInfo.user.menus))
        },

        // 获取用户名和菜单
        async getInfo() {
            // 获取用户信息
            const result:any = await reqUserInfo(this.token)
            // 获取用户名
            this.name = result.name
            // 获取菜单
            const menus = Array.from(JSON.parse(storage.getItem('menus') as string)) 
            // 转为路由对象
            const convertedRoutes = ConvertToRoute(menus)
            this.menuRoutes = [...staticRoutes,...convertedRoutes,arbitraryRoutes]
            // 添加路由
            const [tmp] = convertedRoutes
            const [tmp2] = arbitraryRoutes
            router.addRoute(tmp)
            router.addRoute(tmp2)
        },

        reset() {
            // 删除local中保存的token
            removeToken()
            // 删除路由
            storage.removeItem('menus')
            // 提交重置用户信息的mutation
            this.token = ''
            this.name = ''
            this.avatar = ''
        },
    },
});
