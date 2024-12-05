import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import { ElMessage } from 'element-plus'
import { staticRoutes } from '@/router/routes'
import { reqUserInfo, reqUserLogin } from '@/api/user'


/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

    state: (): UserInfoState => ({
        token: getToken() as string,
        name: '',
        avatar: '',
        menuRoutes: []
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
            // 获取token
            this.token = res.userInfo.token
            // 存储token
            setToken(res.userInfo.token)
        },
        
        async getInfo() {
            // 获取用户信息
            const result:any = await reqUserInfo(this.token)
            this.name = result.name
            this.avatar = result.avatar ? result.avatar : "https://2216847528.oss-cn-beijing.aliyuncs.com/asset/avatar..png"
            this.menuRoutes = staticRoutes
        },

        reset() {
            // 删除local中保存的token
            removeToken()
            // 提交重置用户信息的mutation
            this.token = ''
            this.name = ''
            this.avatar = ''
        },
    },
});
