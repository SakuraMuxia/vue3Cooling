import type { RouteRecordRaw } from "vue-router";

// 用户信息包括权限数据
export interface UserInfoState {
    token: string;
    avatar: string;
    name: string;
    nickName: string;
    id: number|string;
    orgId: number|string;
    mobile: number|string;
    roles:string;
    syncRoutes?:RouteRecordRaw[],
    menuRoutes: RouteRecordRaw[] // 用于生成导航菜单的路由列表
}




