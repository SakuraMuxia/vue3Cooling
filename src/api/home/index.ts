import request from '@/utils/request'

enum API {
    // 登陆URL(返回路由信息)
    LOGIN = "/api/user/login",
    // 用户信息(组织信息)
    USERINFO = "/api/user/info",
    // 验证码
    CAPTCHA = "/api/user/captcha"
}
