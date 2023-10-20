import request from '@/api/request'
const http = {
        get(url, params) {
            return request(url,params,"get")
        },
        post(url, params) {
            return request(url,params,"post")
        },
        postJson(url, params) {
            return request(url,params,"postJson")
        },
    }
    
//暴露接口，允许Vue文件或其他js,ts文件使用http结构体中的方法
export default http