import request from '@/utils/request'


enum API {
    // 登陆URL(返回路由信息)
    LOGIN = "/api/user/login",
    // 用户信息(组织信息)
    USERINFO = "/api/user/info",
    // 验证码
    CAPTCHA = "/api/user/captcha"
}

// 登陆(返回路由信息)
export const reqUserLogin = (data: any) => request.post<any, any>(API.LOGIN, data)
// 验证码
export const reqCaptcha = (randomId: any) => request.get<any, any>(API.CAPTCHA + `?key=${randomId}`, {
    responseType: 'arraybuffer'
})
// 用户信息(组织信息)
export const reqUserInfo = (token:string) => request.get<any, any>(API.USERINFO,{
    params:{
        token,
    }
})