import request from '@/utils/request'

enum API {
    // 设备列表
    DEVICELIST = "/api/core/device/list",

}

//设备列表 
export const reqDeviceList = (params:any) => request.post<any, any>(API.DEVICELIST,null,{
    params:params
})